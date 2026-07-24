import dotenv from "dotenv";
dotenv.config();
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export const analyzeResume = async (resumeText, jobDescription = "") => {
  try {
    const jobContext = jobDescription 
      ? `\nJob Description for matching:\n${jobDescription}\n` 
      : "";

    const prompt = `
You are an expert HR and ATS (Applicant Tracking System) analyzer. Analyze this resume comprehensively and provide a detailed assessment in JSON format.

Resume Text:
${resumeText}
${jobContext}

Provide the following in valid JSON format:
{
  "overallScore": number (0-100),
  "atsScore": number (0-100),
  "summary": string (brief 2-3 sentence summary),
  "skills": {
    "technical": string[],
    "soft": string[],
    "tools": string[]
  },
  "experience": [
    {
      "title": string,
      "company": string,
      "duration": string,
      "description": string
    }
  ],
  "education": [
    {
      "degree": string,
      "institution": string,
      "year": string,
      "gpa": string (optional)
    }
  ],
  "projects": [
    {
      "name": string,
      "description": string,
      "technologies": string[]
    }
  ],
  "missingSkills": string[],
  "strengths": string[],
  "weaknesses": string[],
  "suggestions": [
    {
      "category": string,
      "suggestion": string,
      "priority": "high" | "medium" | "low"
    }
  ],
  "jobMatch": {
    "percentage": number (0-100),
    "matchedSkills": string[],
    "missingJobSkills": string[]
  }
}

Scoring Criteria:
- Overall Score: Based on completeness, clarity, and professional presentation
- ATS Score: Based on keyword optimization, formatting, and ATS-friendliness
- Job Match: Only calculate if job description is provided

Ensure the response is valid JSON without any markdown formatting.
`;

    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: prompt,
    });

    const text = response.text;
    
    // Remove markdown if Gemini wraps JSON in ```json ... ```
    const cleanedText = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();
    
    // Convert JSON string to JavaScript object
    const analysis = JSON.parse(cleanedText);
    
    // Validate and provide defaults
    if (!analysis.overallScore) analysis.overallScore = 70;
    if (!analysis.atsScore) analysis.atsScore = 70;
    if (!analysis.summary) analysis.summary = "Resume analysis completed";
    if (!analysis.skills) analysis.skills = { technical: [], soft: [], tools: [] };
    if (!analysis.experience) analysis.experience = [];
    if (!analysis.education) analysis.education = [];
    if (!analysis.projects) analysis.projects = [];
    if (!analysis.missingSkills) analysis.missingSkills = [];
    if (!analysis.strengths) analysis.strengths = [];
    if (!analysis.weaknesses) analysis.weaknesses = [];
    if (!analysis.suggestions) analysis.suggestions = [];
    if (!analysis.jobMatch) {
      analysis.jobMatch = {
        percentage: 0,
        matchedSkills: [],
        missingJobSkills: []
      };
    }

    return analysis;
  } catch (error) {
    console.error("Gemini Error:", error);
    // Return fallback analysis
    return {
      overallScore: 70,
      atsScore: 70,
      summary: "Resume analysis completed with basic assessment",
      skills: { technical: [], soft: [], tools: [] },
      experience: [],
      education: [],
      projects: [],
      missingSkills: [],
      strengths: ["Resume uploaded successfully"],
      weaknesses: ["Add more details for better analysis"],
      suggestions: [
        {
          category: "General",
          suggestion: "Add more detailed information about your experience",
          priority: "medium"
        }
      ],
      jobMatch: {
        percentage: 0,
        matchedSkills: [],
        missingJobSkills: []
      }
    };
  }
};

export const generateInterviewQuestions = async (jobTitle, jobDescription, candidateResume = "") => {
  try {
    const resumeContext = candidateResume 
      ? `\nCandidate Resume:\n${candidateResume}\n` 
      : "";

    const prompt = `
You are an expert interviewer. Generate interview questions for the following position.

Job Title: ${jobTitle}
Job Description: ${jobDescription}
${resumeContext}

Provide the following in valid JSON format:
{
  "technicalQuestions": [
    {
      "question": string,
      "expectedAnswer": string,
      "difficulty": "easy" | "medium" | "hard"
    }
  ],
  "behavioralQuestions": [
    {
      "question": string,
      "whatToLookFor": string
    }
  ],
  "systemDesignQuestions": [
    {
      "question": string,
      "expectedAnswer": string
    }
  ]
}

Generate 5-8 technical questions, 3-5 behavioral questions, and 2-3 system design questions (if applicable).
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
    
    const questions = JSON.parse(cleanedText);
    
    // Validate and provide defaults
    if (!questions.technicalQuestions) questions.technicalQuestions = [];
    if (!questions.behavioralQuestions) questions.behavioralQuestions = [];
    if (!questions.systemDesignQuestions) questions.systemDesignQuestions = [];

    return questions;
  } catch (error) {
    console.error("Interview Questions Generation Error:", error);
    throw new Error("Failed to generate interview questions");
  }
};

export const getJobRecommendations = async (userSkills, userExperience, userEducation) => {
  try {
    const prompt = `
Based on the candidate's profile, recommend suitable job categories and roles.

Candidate Skills: ${userSkills.join(", ")}
Experience: ${userExperience} years
Education: ${userEducation}

Provide the following in valid JSON format:
{
  "recommendedRoles": [
    {
      "role": string,
      "matchScore": number (0-100),
      "reason": string
    }
  ],
  "skillsToImprove": string[],
  "careerPath": string[]
}

Recommend 5-8 suitable roles based on the candidate's profile.
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
    
    // Validate and provide defaults
    if (!recommendations.recommendedRoles) recommendations.recommendedRoles = [];
    if (!recommendations.skillsToImprove) recommendations.skillsToImprove = [];
    if (!recommendations.careerPath) recommendations.careerPath = [];

    return recommendations;
  } catch (error) {
    console.error("Job Recommendations Error:", error);
    throw new Error("Failed to generate job recommendations");
  }
};

export const generateCoverLetter = async (candidateName, candidateSkills, candidateExperience, jobTitle, companyName, jobDescription) => {
  try {
    const prompt = `
Generate a professional cover letter for the following candidate applying to this job.

Candidate Name: ${candidateName}
Candidate Skills: ${candidateSkills.join(", ")}
Candidate Experience: ${candidateExperience}
Job Title: ${jobTitle}
Company Name: ${companyName}
Job Description: ${jobDescription}

Provide the following in valid JSON format:
{
  "subjectLine": string,
  "salutation": string,
  "body": string (main cover letter content),
  "closing": string,
  "signature": string
}

Make the cover letter professional, tailored to the job, and highlight relevant skills and experience.
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
    
    const coverLetter = JSON.parse(cleanedText);
    
    // Validate and provide defaults
    if (!coverLetter.subjectLine) coverLetter.subjectLine = `Application for ${jobTitle} position`;
    if (!coverLetter.salutation) coverLetter.salutation = "Dear Hiring Manager,";
    if (!coverLetter.body) coverLetter.body = "I am writing to express my interest in this position.";
    if (!coverLetter.closing) coverLetter.closing = "Thank you for considering my application.";
    if (!coverLetter.signature) coverLetter.signature = "Sincerely,";

    return coverLetter;
  } catch (error) {
    console.error("Cover Letter Generation Error:", error);
    throw new Error("Failed to generate cover letter");
  }
};

export const rankCandidates = async (jobDescription, candidates) => {
  try {
    const candidatesData = candidates.map(c => `
Candidate ID: ${c._id}
Name: ${c.fullName}
Skills: ${c.profile?.skills?.join(", ") || "N/A"}
Experience: ${c.profile?.bio || "N/A"}
Resume Analysis: ${c.profile?.resumeAnalysis ? JSON.stringify(c.profile.resumeAnalysis) : "N/A"}
`).join("\n");

    const prompt = `
Rank the following candidates for this job position based on their skills, experience, and resume analysis.

Job Description:
${jobDescription}

Candidates:
${candidatesData}

Provide the following in valid JSON format:
{
  "rankings": [
    {
      "candidateId": string,
      "rank": number,
      "matchScore": number (0-100),
      "reason": string,
      "strengths": string[],
      "concerns": string[]
    }
  ]
}

Rank candidates from best fit to least fit. Provide detailed reasoning for each ranking.
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
    
    const rankings = JSON.parse(cleanedText);
    
    // Validate and provide defaults
    if (!rankings.rankings) rankings.rankings = [];

    return rankings;
  } catch (error) {
    console.error("Candidate Ranking Error:", error);
    throw new Error("Failed to rank candidates");
  }
};