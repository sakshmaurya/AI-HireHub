import { SkillAssessment, AssessmentResult } from "../models/skillAssessment.model.js";

// @desc    Create a new skill assessment
// @route   POST /api/assessment/create
// @access  Private (Admin/Recruiter)
export const createAssessment = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      skills,
      questions,
      duration,
      passingScore
    } = req.body;

    if (!title || !description || !category || !skills || !questions) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided"
      });
    }

    const assessment = await SkillAssessment.create({
      title,
      description,
      category,
      skills: Array.isArray(skills) ? skills : skills.split(","),
      questions,
      duration: duration || 30,
      passingScore: passingScore || 60,
      createdBy: req.id
    });

    return res.status(201).json({
      success: true,
      message: "Assessment created successfully",
      assessment
    });
  } catch (error) {
    console.log("Error creating assessment:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

// @desc    Get all assessments
// @route   GET /api/assessment/all
// @access  Public
export const getAllAssessments = async (req, res) => {
  try {
    const category = req.query.category || "";
    const skill = req.query.skill || "";

    const query = { isActive: true };

    if (category) {
      query.category = category;
    }

    if (skill) {
      query.skills = { $in: [skill] };
    }

    const assessments = await SkillAssessment.find(query)
      .populate("createdBy", "fullName email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      assessments
    });
  } catch (error) {
    console.log("Error getting assessments:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

// @desc    Get assessment by ID
// @route   GET /api/assessment/:id
// @access  Private
export const getAssessmentById = async (req, res) => {
  try {
    const assessment = await SkillAssessment.findById(req.params.id)
      .populate("createdBy", "fullName email");

    if (!assessment) {
      return res.status(404).json({
        success: false,
        message: "Assessment not found"
      });
    }

    // Don't send correct answers to users
    const assessmentForUser = assessment.toObject();
    assessmentForUser.questions = assessment.questions.map(q => ({
      ...q.toObject(),
      correctAnswer: undefined
    }));

    return res.status(200).json({
      success: true,
      assessment: assessmentForUser
    });
  } catch (error) {
    console.log("Error getting assessment:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

// @desc    Submit assessment result
// @route   POST /api/assessment/:id/submit
// @access  Private
export const submitAssessment = async (req, res) => {
  try {
    const { answers, timeTaken } = req.body;
    const assessmentId = req.params.id;

    const assessment = await SkillAssessment.findById(assessmentId);

    if (!assessment) {
      return res.status(404).json({
        success: false,
        message: "Assessment not found"
      });
    }

    // Calculate score
    let correctAnswers = 0;
    const processedAnswers = answers.map((answer, index) => {
      const isCorrect = answer.selectedAnswer === assessment.questions[index].correctAnswer;
      if (isCorrect) correctAnswers++;
      return {
        questionIndex: index,
        selectedAnswer: answer.selectedAnswer,
        isCorrect
      };
    });

    const totalQuestions = assessment.questions.length;
    const percentage = (correctAnswers / totalQuestions) * 100;
    const passed = percentage >= assessment.passingScore;

    // Save result
    const result = await AssessmentResult.create({
      user: req.id,
      assessment: assessmentId,
      score: correctAnswers,
      totalQuestions,
      correctAnswers,
      percentage,
      passed,
      answers: processedAnswers,
      timeTaken: timeTaken || 0
    });

    return res.status(200).json({
      success: true,
      message: "Assessment submitted successfully",
      result: {
        score: correctAnswers,
        totalQuestions,
        percentage,
        passed,
        timeTaken
      }
    });
  } catch (error) {
    console.log("Error submitting assessment:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

// @desc    Get user's assessment results
// @route   GET /api/assessment/my-results
// @access  Private
export const getUserResults = async (req, res) => {
  try {
    const results = await AssessmentResult.find({ user: req.id })
      .populate("assessment", "title category skills")
      .sort({ completedAt: -1 });

    return res.status(200).json({
      success: true,
      results
    });
  } catch (error) {
    console.log("Error getting user results:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

// @desc    Delete assessment
// @route   DELETE /api/assessment/:id
// @access  Private (Admin/Creator)
export const deleteAssessment = async (req, res) => {
  try {
    const assessment = await SkillAssessment.findById(req.params.id);

    if (!assessment) {
      return res.status(404).json({
        success: false,
        message: "Assessment not found"
      });
    }

    if (assessment.createdBy.toString() !== req.id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized"
      });
    }

    await SkillAssessment.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Assessment deleted successfully"
    });
  } catch (error) {
    console.log("Error deleting assessment:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};
