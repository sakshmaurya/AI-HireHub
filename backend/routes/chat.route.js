import express from "express";
import {
    createConversation,
    getConversations,
    getConversationMessages,
    sendMessage,
    deleteConversation,
    getJobRecommendations
} from "../controllers/chat.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

// All chat routes require authentication
router.use(protect);

// Conversation management
router.post("/conversations", createConversation);
router.get("/conversations", getConversations);
router.get("/conversations/:conversationId/messages", getConversationMessages);
router.delete("/conversations/:conversationId", deleteConversation);

// Messaging
router.post("/message", sendMessage);

// AI-powered features
router.get("/recommendations", getJobRecommendations);

export default router;
