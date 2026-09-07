import express from "express";
import { chatAboutTrip } from "../services/geminiService.js";

const router = express.Router();

/**
 * POST /api/chat
 * Body: { destination, tripContext, question }
 */
router.post("/", async (req, res, next) => {
  try {
    const { destination, tripContext, question } = req.body;

    if (!question || !question.trim()) {
      return res.status(400).json({
        success: false,
        error: "Field 'question' is required.",
      });
    }

    const reply = await chatAboutTrip({
      destination: destination || "your destination",
      tripContext: tripContext || "",
      question: question.trim(),
    });

    return res.json({
      success: true,
      data: {
        reply,
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;
