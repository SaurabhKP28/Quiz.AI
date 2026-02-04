import OpenAI from "openai";
import { QuizQuestion } from "./types";
import "server-only";

const openrouter = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY!,
  baseURL: "https://openrouter.ai/api/v1",
  defaultHeaders: {
    "HTTP-Referer": "http://localhost:3000",
    "X-Title": "Quiz Master AI",
  },
});

export async function generateQuizQuestions(
  topic: string,
  difficulty: string,
  numberOfQuestions: number
): Promise<QuizQuestion[]> {
  try {
    const prompt = `Generate ${numberOfQuestions} multiple-choice quiz questions on the topic "${topic}" with ${difficulty} difficulty.

Each question must have:
- Question text
- Four options
- Correct answer (must match one option exactly)
- Brief explanation

Return ONLY a valid JSON array like:
[
  {
    "question": "What is the capital of France?",
    "options": ["London", "Berlin", "Paris", "Madrid"],
    "answer": "Paris",
    "explanation": "Paris is the capital and largest city of France."
  }
]

Do not include markdown or extra text.`;

    const completion = await openrouter.chat.completions.create({
      model: process.env.OPENROUTER_MODEL || "meta-llama/llama-3-8b-instruct",
      messages: [
        { role: "system", content: "You output strict, parseable JSON only." },
        { role: "user", content: prompt },
      ],
      temperature: 0.6,
    });

    let text = completion.choices[0].message.content?.trim() ?? "";

    // --- CLEAN RESPONSE ---
    text = text
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    const start = text.indexOf("[");
    const end = text.lastIndexOf("]");

    if (start === -1 || end === -1 || start >= end) {
      throw new Error("No valid JSON array found in response");
    }

    const questions = JSON.parse(text.substring(start, end + 1));

    if (!Array.isArray(questions) || questions.length === 0) {
      throw new Error("Response is not a valid non-empty array");
    }

    // --- VALIDATION + NORMALIZATION ---
    const validatedQuestions: QuizQuestion[] = questions.map((q: any, index: number) => {
      if (!q.question || typeof q.question !== "string") {
        throw new Error(`Invalid question at index ${index}`);
      }

      if (!Array.isArray(q.options) || q.options.length !== 4) {
        throw new Error(`Question at index ${index} must have exactly 4 options`);
      }

      const cleanOptions = q.options.map((opt: any) => String(opt).trim());
      const rawAnswer = String(q.answer || "").trim();

      // --- ROBUST ANSWER MATCHING ---
      let finalAnswer =
        cleanOptions.find((o: string) => o === rawAnswer) ||
        cleanOptions.find((o: string) => o.toLowerCase() === rawAnswer.toLowerCase()) ||
        cleanOptions.find((o: string) => rawAnswer.toLowerCase().includes(o.toLowerCase()));

      if (!finalAnswer) {
        console.warn(
          `Answer mismatch at index ${index}. Defaulting to first option.`,
          { rawAnswer, options: cleanOptions }
        );
        finalAnswer = cleanOptions[0]; // safe fallback
      }

      if (!q.explanation || typeof q.explanation !== "string") {
        throw new Error(`Invalid explanation at index ${index}`);
      }

      return {
        question: q.question.trim(),
        options: cleanOptions,
        answer: finalAnswer,
        explanation: q.explanation.trim(),
      };
    });

    if (validatedQuestions.length !== numberOfQuestions) {
      console.warn(
        `Requested ${numberOfQuestions} questions but got ${validatedQuestions.length}`
      );
    }

    return validatedQuestions;

  } catch (error: any) {
    console.error("OpenRouter generation error:", error);

    if (error.status === 429) {
      throw new Error("OpenRouter rate limit exceeded. Please try again.");
    }

    throw new Error(`Failed to generate quiz questions: ${error.message || "Unknown error"}`);
  }
}
