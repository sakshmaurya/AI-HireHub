import { Chat } from "../models/chat.model.js";
import User from "../models/user.model.js";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// Helper function to get user context for AI
const getUserContext = async (userId) => {
    const user = await User.findById(userId).select("-password");
    if (!user) return null;

    return {
        skills: user.profile?.skills || [],
        resumeText: user.profile?.resumeAnalysis?.summary || "",
        experience: user.profile?.bio || "",
        jobPreferences: {
            title: user.profile?.jobPreferences?.title || "",
            location: user.profile?.jobPreferences?.location || "",
            experience: user.profile?.jobPreferences?.experience || ""
        }
    };
};

// Helper function to generate proactive job suggestions
const generateProactiveSuggestions = (userContext) => {
    const suggestions = [];
    
    if (userContext.skills.length > 0) {
        suggestions.push(`Based on your skills in ${userContext.skills.slice(0, 3).join(", ")}, I can help you find relevant job opportunities.`);
    }
    
    if (userContext.resumeText) {
        suggestions.push("I've analyzed your resume. Let me suggest some roles that match your profile.");
    }
    
    suggestions.push("Would you like me to recommend specific jobs or internships based on your profile?");
    
    return suggestions.join(" ");
};

export const createConversation = async (req, res) => {
    try {
        const { title } = req.body;
        const userContext = await getUserContext(req.id);

        const chat = await Chat.create({
            user: req.id,
            title: title || "New Chat",
            context: userContext,
            messages: []
        });

        // Add proactive AI message based on user profile
        const proactiveMessage = generateProactiveMessage(userContext);
        chat.messages.push({
            role: "assistant",
            content: proactiveMessage,
            timestamp: new Date()
        });

        await chat.save();

        return res.status(201).json({
            success: true,
            chat
        });
    } catch (error) {
        console.log("Create conversation error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to create conversation"
        });
    }
};

// Generate proactive message when starting new chat
const generateProactiveMessage = (userContext) => {
    if (!userContext) {
        return "Hello! I'm your AI Career Assistant. I can help you find jobs, improve your resume, and prepare for interviews. Let's get started!";
    }

    const skills = userContext.skills || [];
    const hasResume = !!userContext.resumeText;
    const hasExperience = !!userContext.experience;

    let message = "Hello! I'm your AI Career Assistant. ";

    if (skills.length > 0) {
        message += `I can see you have skills in ${skills.slice(0, 3).join(", ")}. `;
    }

    if (hasResume) {
        message += "I've analyzed your resume and can suggest roles that match your profile. ";
    }

    if (hasExperience) {
        message += "Based on your experience, I can recommend suitable job opportunities. ";
    }

    message += "\n\nI can help you with:\n";
    message += "• Job recommendations based on your skills\n";
    message += "• Resume improvement tips\n";
    message += "• Interview preparation\n";
    message += "• Skill development suggestions\n";
    message += "• Career path guidance\n\n";
    message += "What would you like to focus on today?";

    return message;
};

export const getConversations = async (req, res) => {
    try {
        const conversations = await Chat.find({ 
            user: req.id,
            isActive: true 
        })
        .sort({ updatedAt: -1 })
        .limit(20);

        return res.status(200).json({
            success: true,
            conversations
        });
    } catch (error) {
        console.log("Get conversations error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to get conversations"
        });
    }
};

export const getConversationMessages = async (req, res) => {
    try {
        const { conversationId } = req.params;
        
        const chat = await Chat.findOne({
            _id: conversationId,
            user: req.id
        });

        if (!chat) {
            return res.status(404).json({
                success: false,
                message: "Conversation not found"
            });
        }

        return res.status(200).json({
            success: true,
            messages: chat.messages,
            title: chat.title
        });
    } catch (error) {
        console.log("Get conversation messages error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to get messages"
        });
    }
};

export const sendMessage = async (req, res) => {
    try {
        const { conversationId, message } = req.body;

        const chat = await Chat.findOne({
            _id: conversationId,
            user: req.id
        });

        if (!chat) {
            return res.status(404).json({
                success: false,
                message: "Conversation not found"
            });
        }

        // Add user message
        chat.messages.push({
            role: "user",
            content: message,
            timestamp: new Date()
        });

        // Get user context
        const userContext = await getUserContext(req.id);
        
        // Check if API key is configured
        if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "your_gemini_api_key") {
            // Provide fallback response without AI
            const fallbackResponse = generateFallbackResponse(message, userContext);
            
            chat.messages.push({
                role: "assistant",
                content: fallbackResponse,
                timestamp: new Date()
            });

            await chat.save();

            return res.status(200).json({
                success: true,
                message: fallbackResponse,
                chat
            });
        }

        // Build conversation history for AI context
        const conversationHistory = chat.messages.map(msg => 
            `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`
        ).join("\n");
        
        // Build AI prompt with user context
        const prompt = `
You are an AI career assistant for AI HireHub, an AI-powered job portal. Help candidates with job search, career advice, and skill development.

User Profile:
- Skills: ${userContext?.skills?.join(", ") || "Not specified"}
- Experience: ${userContext?.experience || "Not specified"}
- Resume Summary: ${userContext?.resumeText || "Not available"}
- Job Preferences: ${userContext?.jobPreferences?.title || "Any"} in ${userContext?.jobPreferences?.location || "Any location"}

Conversation History:
${conversationHistory}

Current User Message: ${message}

Provide helpful, personalized career advice. If the user asks for job recommendations, suggest relevant roles based on their skills and experience. Keep responses concise and actionable.
`;

        // Get AI response
        const response = await ai.models.generateContent({
            model: "gemini-1.5-flash",
            contents: prompt,
        });

        const aiResponse = response.text;

        // Add AI response to chat
        chat.messages.push({
            role: "assistant",
            content: aiResponse,
            timestamp: new Date()
        });

        await chat.save();

        return res.status(200).json({
            success: true,
            message: aiResponse,
            chat
        });
    } catch (error) {
        console.log("Send message error:", error);
        
        // Get user context for fallback
        const userContext = await getUserContext(req.id);
        const fallbackResponse = generateFallbackResponse(req.body.message, userContext);
        
        return res.status(200).json({
            success: true,
            message: fallbackResponse,
            error: "AI service unavailable, using fallback response"
        });
    }
};

// Generate fallback response when AI is not available
const generateFallbackResponse = (message, userContext) => {
    const lowerMessage = message.toLowerCase();
    
    // Proactive job suggestions based on skills
    if (userContext?.skills?.length > 0) {
        const skills = userContext.skills.slice(0, 5);
        if (lowerMessage.includes("job") || lowerMessage.includes("recommend") || lowerMessage.includes("suggest")) {
            return `Based on your skills in ${skills.join(", ")}, I recommend looking for positions like Software Developer, Full Stack Engineer, or Technical Lead. Your experience level suggests you'd be a good fit for mid-level to senior roles. Would you like me to help you prepare for interviews or improve your resume?`;
        }
    }
    
    // General career advice
    if (lowerMessage.includes("resume") || lowerMessage.includes("cv")) {
        return "Your resume looks good! To improve it further, consider adding more quantifiable achievements, specific project details, and tailoring it to the job description. Would you like specific tips for any section?";
    }
    
    if (lowerMessage.includes("skill") || lowerMessage.includes("learn")) {
        const recommendedSkills = ["JavaScript", "React", "Node.js", "Python", "AWS"];
        return `Based on current market trends, I recommend focusing on ${recommendedSkills.slice(0, 3).join(", ")}. These are in high demand. Would you like learning resources for any of these?`;
    }
    
    if (lowerMessage.includes("interview")) {
        return "For interviews, practice common technical questions, prepare STAR method answers for behavioral questions, and research the company thoroughly. Would you like specific interview tips for your target role?";
    }
    
    // Default proactive response
    return `I'm here to help with your career! I can see you have skills in ${userContext?.skills?.slice(0, 3).join(", ") || "various areas"}. 

I can help you with:
• Job recommendations based on your profile
• Resume improvement tips
• Interview preparation
• Skill development suggestions
• Career path guidance

What would you like to focus on today?`;
};

export const deleteConversation = async (req, res) => {
    try {
        const { conversationId } = req.params;

        const chat = await Chat.findOneAndUpdate(
            {
                _id: conversationId,
                user: req.id
            },
            { isActive: false },
            { new: true }
        );

        if (!chat) {
            return res.status(404).json({
                success: false,
                message: "Conversation not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Conversation deleted successfully"
        });
    } catch (error) {
        console.log("Delete conversation error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to delete conversation"
        });
    }
};

export const getJobRecommendations = async (req, res) => {
    try {
        const userContext = await getUserContext(req.id);

        if (!userContext) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Check if API key is configured
        if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "your_gemini_api_key") {
            // Provide fallback recommendations
            const fallbackRecommendations = generateFallbackRecommendations(userContext);
            return res.status(200).json({
                success: true,
                recommendations: fallbackRecommendations
            });
        }

        const prompt = `
Based on the candidate's profile, recommend suitable job categories and specific roles with match scores.

Candidate Profile:
- Skills: ${userContext?.skills?.join(", ") || "Not specified"}
- Experience: ${userContext?.experience || "Not specified"}
- Resume Summary: ${userContext?.resumeText || "Not available"}
- Preferred Job Title: ${userContext?.jobPreferences?.title || "Any"}
- Preferred Location: ${userContext?.jobPreferences?.location || "Any"}

Provide the following in valid JSON format:
{
  "recommendedRoles": [
    {
      "role": string,
      "matchScore": number (0-100),
      "reason": string,
      "requiredSkills": string[],
      "salaryRange": string
    }
  ],
  "skillsToImprove": string[],
  "careerPath": string[],
  "marketInsights": string
}

Recommend 5-8 suitable roles based on the candidate's profile. Include realistic salary ranges and specific skills needed for each role.
Ensure the response is valid JSON without any markdown formatting.
`;

        const response = await ai.models.generateContent({
            model: "gemini-1.5-flash",
            contents: prompt,
        });

        const text = response.text;
        const cleanedText = text
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();

        const recommendations = JSON.parse(cleanedText);

        return res.status(200).json({
            success: true,
            recommendations
        });
    } catch (error) {
        console.log("Job recommendations error:", error);
        
        // Fallback to recommendations without AI
        const userContext = await getUserContext(req.id);
        const fallbackRecommendations = generateFallbackRecommendations(userContext);
        
        return res.status(200).json({
            success: true,
            recommendations: fallbackRecommendations,
            error: "AI service unavailable, using fallback recommendations"
        });
    }
};

// Generate fallback job recommendations
const generateFallbackRecommendations = (userContext) => {
    const skills = userContext?.skills || [];
    const experience = userContext?.experience || "";
    
    // Determine experience level
    let experienceLevel = "Entry Level";
    if (experience.toLowerCase().includes("senior") || experience.toLowerCase().includes("lead")) {
        experienceLevel = "Senior";
    } else if (experience.toLowerCase().includes("mid") || experience.includes("2-5")) {
        experienceLevel = "Mid-Level";
    }
    
    // Generate roles based on skills
    const roles = [];
    
    if (skills.some(s => s.toLowerCase().includes("react") || s.toLowerCase().includes("javascript"))) [
        roles.push({
            role: "Frontend Developer",
            matchScore: 85,
            reason: "Strong match based on your JavaScript/React skills",
            requiredSkills: ["JavaScript", "React", "HTML/CSS", "TypeScript"],
            salaryRange: "₹6-12 LPA"
        }),
        roles.push({
            role: "Full Stack Developer",
            matchScore: 78,
            reason: "Good fit with your current skill set",
            requiredSkills: ["JavaScript", "React", "Node.js", "Database"],
            salaryRange: "₹8-18 LPA"
        })
    ];
    
    if (skills.some(s => s.toLowerCase().includes("python") || s.toLowerCase().includes("java"))) {
        roles.push({
            role: "Backend Developer",
            matchScore: 82,
            reason: "Matches your backend programming skills",
            requiredSkills: ["Python/Java", "APIs", "Database", "Cloud"],
            salaryRange: "₹7-15 LPA"
        });
    }
    
    if (skills.some(s => s.toLowerCase().includes("aws") || s.toLowerCase().includes("cloud"))) {
        roles.push({
            role: "DevOps Engineer",
            matchScore: 75,
            reason: "Cloud skills are in high demand",
            requiredSkills: ["AWS", "Docker", "Kubernetes", "CI/CD"],
            salaryRange: "₹10-20 LPA"
        });
    }
    
    // Add general roles if not enough specific matches
    if (roles.length < 5) {
        roles.push({
            role: "Software Engineer",
            matchScore: 70,
            reason: "General software development role",
            requiredSkills: ["Programming", "Problem Solving", "System Design"],
            salaryRange: "₹6-15 LPA"
        });
        
        roles.push({
            role: "Technical Support Engineer",
            matchScore: 65,
            reason: "Good entry point with your skill set",
            requiredSkills: ["Technical Knowledge", "Communication", "Troubleshooting"],
            salaryRange: "₹4-8 LPA"
        });
        
        if (experienceLevel === "Senior") {
            roles.push({
                role: "Technical Lead",
                matchScore: 72,
                reason: "Leadership role based on your experience",
                requiredSkills: ["Leadership", "Architecture", "Mentoring"],
                salaryRange: "₹15-30 LPA"
            });
        }
    }
    
    return {
        recommendedRoles: roles.slice(0, 6),
        skillsToImprove: ["System Design", "Cloud Computing", "Advanced Algorithms"],
        careerPath: ["Junior Developer → Mid-Level → Senior → Tech Lead", "Specialize in Frontend/Backend/DevOps", "Consider Management Track"],
        marketInsights: "The job market is strong for developers with practical skills. Focus on building projects and gaining experience to increase your market value."
    };
};
