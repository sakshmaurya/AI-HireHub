import React, { useEffect, useState } from "react";
import Navbar from "../components/shared/Navbar";
import { motion } from "framer-motion";
import axios from "axios";
import { BookOpen, Clock, CheckCircle, XCircle, Play, Award } from "lucide-react";
import { Button } from "../components/ui/button";

const SkillAssessment = () => {
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [result, setResult] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isTakingTest, setIsTakingTest] = useState(false);

  useEffect(() => {
    fetchAssessments();
  }, []);

  const fetchAssessments = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:8000/api/assessment/all', {
        withCredentials: true
      });
      
      if (response.data.success) {
        setAssessments(response.data.assessments);
      }
    } catch (error) {
      console.error("Error fetching assessments:", error);
    } finally {
      setLoading(false);
    }
  };

  const startAssessment = async (assessmentId) => {
    try {
      const response = await axios.get(`http://localhost:8000/api/assessment/${assessmentId}`, {
        withCredentials: true
      });
      
      if (response.data.success) {
        setSelectedAssessment(response.data.assessment);
        setCurrentQuestion(0);
        setAnswers([]);
        setShowResults(false);
        setResult(null);
        setTimeLeft(response.data.assessment.duration * 60);
        setIsTakingTest(true);
      }
    } catch (error) {
      console.error("Error starting assessment:", error);
    }
  };

  const handleAnswer = (selectedAnswer) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = selectedAnswer;
    setAnswers(newAnswers);
  };

  const nextQuestion = () => {
    if (currentQuestion < selectedAssessment.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      submitAssessment();
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const submitAssessment = async () => {
    try {
      const response = await axios.post(
        `http://localhost:8000/api/assessment/${selectedAssessment._id}/submit`,
        { answers: answers.map((ans, idx) => ({ selectedAnswer: ans })) },
        { withCredentials: true }
      );
      
      if (response.data.success) {
        setResult(response.data.result);
        setShowResults(true);
        setIsTakingTest(false);
      }
    } catch (error) {
      console.error("Error submitting assessment:", error);
    }
  };

  const resetAssessment = () => {
    setSelectedAssessment(null);
    setCurrentQuestion(0);
    setAnswers([]);
    setShowResults(false);
    setResult(null);
    setIsTakingTest(false);
  };

  if (isTakingTest && selectedAssessment) {
    const question = selectedAssessment.questions[currentQuestion];
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-purple-50">
        <Navbar />
        <div className="max-w-4xl mx-auto mt-8 px-4 pb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg p-8"
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">{selectedAssessment.title}</h2>
              <div className="flex items-center gap-2 text-gray-600">
                <Clock className="w-5 h-5" />
                <span className="font-semibold">{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</span>
              </div>
            </div>

            {/* Progress */}
            <div className="mb-6">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Question {currentQuestion + 1} of {selectedAssessment.questions.length}</span>
                <span>{Math.round((currentQuestion / selectedAssessment.questions.length) * 100)}% Complete</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="h-2 rounded-full bg-orange-500 transition-all duration-300"
                  style={{ width: `${(currentQuestion / selectedAssessment.questions.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Question */}
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">{question.question}</h3>
              <div className="space-y-3">
                {question.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(index)}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                      answers[currentQuestion] === index
                        ? 'border-orange-500 bg-orange-50'
                        : 'border-gray-200 hover:border-orange-300'
                    }`}
                  >
                    <span className="font-semibold mr-3">{String.fromCharCode(65 + index)}.</span>
                    {option}
                  </button>
                ))}
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between">
              <Button
                onClick={prevQuestion}
                disabled={currentQuestion === 0}
                variant="outline"
                className="px-6"
              >
                Previous
              </Button>
              <Button
                onClick={nextQuestion}
                className="px-6 bg-orange-600 hover:bg-orange-700"
              >
                {currentQuestion === selectedAssessment.questions.length - 1 ? 'Submit' : 'Next'}
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  if (showResults && result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-purple-50">
        <Navbar />
        <div className="max-w-4xl mx-auto mt-8 px-4 pb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg p-8 text-center"
          >
            <div className="mb-6">
              {result.passed ? (
                <CheckCircle className="w-24 h-24 mx-auto text-green-500 mb-4" />
              ) : (
                <XCircle className="w-24 h-24 mx-auto text-red-500 mb-4" />
              )}
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                {result.passed ? 'Congratulations!' : 'Keep Practicing!'}
              </h2>
              <p className="text-gray-600">
                {result.passed ? 'You passed the assessment' : 'You need to score higher to pass'}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-6 mb-8">
              <div className="bg-orange-50 rounded-lg p-4">
                <div className="text-3xl font-bold text-orange-600">{result.score}</div>
                <div className="text-sm text-gray-600">Correct Answers</div>
              </div>
              <div className="bg-purple-50 rounded-lg p-4">
                <div className="text-3xl font-bold text-purple-600">{result.totalQuestions}</div>
                <div className="text-sm text-gray-600">Total Questions</div>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <div className="text-3xl font-bold text-green-600">{result.percentage}%</div>
                <div className="text-sm text-gray-600">Score</div>
              </div>
            </div>

            <div className="flex justify-center gap-4">
              <Button onClick={resetAssessment} variant="outline" className="px-6">
                Back to Assessments
              </Button>
              <Button onClick={() => startAssessment(selectedAssessment._id)} className="px-6 bg-orange-600 hover:bg-orange-700">
                Retake Assessment
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-purple-50">
      <Navbar />
      <div className="max-w-7xl mx-auto mt-8 px-4 pb-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            <BookOpen className="inline-block w-10 h-10 mr-3 text-orange-600" />
            Skill Assessments
          </h1>
          <p className="text-gray-600">Test your skills and get certified</p>
        </motion.div>

        {/* Assessment Cards */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
          </div>
        ) : assessments.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16 bg-white rounded-2xl shadow-lg"
          >
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Assessments Available</h3>
            <p className="text-gray-500">Check back later for new skill assessments</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assessments.map((assessment, index) => (
              <motion.div
                key={assessment._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="bg-orange-100 p-3 rounded-lg">
                    <Award className="w-8 h-8 text-orange-600" />
                  </div>
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                    {assessment.category}
                  </span>
                </div>
                
                <h3 className="text-xl font-bold text-gray-800 mb-2">{assessment.title}</h3>
                <p className="text-gray-600 mb-4 line-clamp-2">{assessment.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {assessment.skills.slice(0, 3).map((skill, idx) => (
                    <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                      {skill}
                    </span>
                  ))}
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{assessment.duration} mins</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" />
                    <span>{assessment.passingScore}% to pass</span>
                  </div>
                </div>
                
                <Button
                  onClick={() => startAssessment(assessment._id)}
                  className="w-full bg-orange-600 hover:bg-orange-700"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Start Assessment
                </Button>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SkillAssessment;
