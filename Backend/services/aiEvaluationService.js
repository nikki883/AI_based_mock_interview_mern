//
//import 'dotenv/config';
//import { GoogleGenerativeAI } from "@google/generative-ai";

//const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_KEY1);

// Verify API key
//if (!process.env.GOOGLE_GEMINI_KEY1) {
 // console.error("❌ GOOGLE_GEMINI_KEY is not set in .env file!");
//} else {
//  console.log("✅ Gemini API Key loaded");
//}
/*
const model = genAI.getGenerativeModel({ 
  model: "gemini-2.0-flash-exp",
  generationConfig: {
    temperature: 0.3,
    topP: 0.8,
    topK: 40,
  }
});
*/
//function extractJSON(text) {
// text = text.replace(/```json\s*/gi, '').replace(/```\s*/g, '');
//  const jsonMatch = text.match(/\{[\s\S]*\}/);
//  return jsonMatch ? jsonMatch[0] : text;
// }

/*function normalizeScores(obj) {
  const valueOrZero = (val) => {
    const num = Number(val);
    return isNaN(num) ? 0 : Math.min(Math.max(num, 0), 10);
  };

  return {
    fluency: valueOrZero(obj.fluency),
    technicalAccuracy: valueOrZero(obj.technicalAccuracy),
    grammar: valueOrZero(obj.grammar),
    feedback: obj.feedback || "Answer incomplete or missing key technical points."
  };
}

export const evaluateAnswer = async (question, answer) => {
  try {
    if (!question || !answer) {
      return {
        fluency: 0,
        technicalAccuracy: 0,
        grammar: 0,
        feedback: "No answer provided. Candidate did not respond."
      };
    }

    const prompt = `
You are a strict technical evaluator.

Your job is to grade the candidate's answer **only** based on correctness, completeness, and clarity — 
not politeness or effort. Be extremely objective and critical.

Return ONLY a JSON object with these keys:
- fluency: 0–10
- technicalAccuracy: 0–10
- grammar: 0–10
- feedback: short and correct answer to the question (no remarks, no evaluation, no extra text)

Evaluation Rules:
1. If the answer is blank, nonsense, irrelevant, off-topic, copied from the question, or includes phrases like:
   "I don't know", "idk", "no idea", "not sure", "maybe", "can't remember", or any vague hesitation — 
   give **0 marks** for *all* categories.
2. If the answer is partially correct but misses major parts of the question → **fluency: 4–6**, 
   **technicalAccuracy: 3–5**, **grammar: 4–6**.
3. If the answer is completely correct, clear, and well-written → **8–10** for all.
4. Do **not** give 5 marks by default. 
   Only assign marks according to the above rules.
5. The "feedback" should be the correct and complete answer to the question, not feedback about the user.
6. Always output a valid JSON only — no markdown, no explanations.

Question: ${question}

Answer: ${answer}

Example response:
{
  "fluency": 7,
  "technicalAccuracy": 6,
  "grammar": 8,
  "feedback":  "Correct answer to the question here"
`;

    const result = await model.generateContent(prompt);
    let text = result.response.text().trim();
    const jsonText = extractJSON(text);

    let evaluation;
    try {
      const parsed = JSON.parse(jsonText);
      evaluation = normalizeScores(parsed);
    } catch {
      evaluation = {
        fluency: 0,
        technicalAccuracy: 0,
        grammar: 0,
        feedback: "Answer incomplete or missing key technical points."
      };
    }

    return evaluation;

  } catch (error) {
    console.error("❌ Error evaluating answer:", error.message);
    return {
      fluency: 0,
      technicalAccuracy: 0,
      grammar: 0,
      feedback: "Error evaluating answer. Please try again."
    };
  }
};
*/

import "dotenv/config";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
  systemInstruction: `
You are a strict technical evaluator.
Evaluate candidate answers ONLY based on correctness, clarity, and completeness.
Return ONLY valid JSON. No markdown, no explanations.
  `,
});

/* Extract JSON safely */
function extractJSON(text) {
  return text
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();
}

/* Normalize numbers */
function normalizeScores(obj) {
  const limit = (n) => {
    const x = Number(n);
    return isNaN(x) ? 0 : Math.max(0, Math.min(10, x));
  };

  return {
    fluency: limit(obj.fluency),
    technicalAccuracy: limit(obj.technicalAccuracy),
    grammar: limit(obj.grammar),
    feedback: obj.feedback || "Answer incomplete or missing key technical points.",
  };
}

/* ⭐ FINAL EVALUATION FUNCTION (same version as generateQuestions) */
export const evaluateAnswer = async (question, answer) => {
  try {
    if (!question || !answer?.trim()) {
      return {
        fluency: 0,
        technicalAccuracy: 0,
        grammar: 0,
        feedback: "No answer provided. Candidate did not respond.",
      };
    }

    // Nonsense detection
    const nonsense = [
      /^(a+|b+|c+|d+)$/i,
      /^[a-z]{1,3}$/i,
      /^idk$/i,
      /no idea/i,
      /not sure/i,
      /maybe/i,
      /can't remember/i,
    ];

    if (answer.trim().length < 5 || nonsense.some((p) => p.test(answer.trim()))) {
      return {
        fluency: 0,
        technicalAccuracy: 0,
        grammar: 0,
        feedback: "Answer invalid or unrelated to the question.",
      };
    }

    const prompt = 
`
You are a strict technical evaluator.

Your job is to grade the candidate's answer **only** based on correctness, completeness, and clarity — 
not politeness or effort. Be extremely objective and critical.

Return ONLY a JSON object with these keys:
- fluency: 0–10
- technicalAccuracy: 0–10
- grammar: 0–10
- feedback: short and correct answer to the question (no remarks, no evaluation, no extra text)

Evaluation Rules:
1. If the answer is blank, nonsense, irrelevant, off-topic, copied from the question, or includes phrases like:
   "I don't know", "idk", "no idea", "not sure", "maybe", "can't remember", or any vague hesitation — 
   give **0 marks** for *all* categories.
2. If the answer is partially correct but misses major parts of the question → **fluency: 4–6**, 
   **technicalAccuracy: 3–5**, **grammar: 4–6**.
3. If the answer is completely correct, clear, and well-written → **8–10** for all.
4. Do **not** give 5 marks by default. 
   Only assign marks according to the above rules.
5. The "feedback" should be the correct and complete answer to the question, not feedback about the user.
6. Always output a valid JSON only — no markdown, no explanations.

Question: ${question}

Answer: ${answer}

Example response:
{
  "fluency": 7,
  "technicalAccuracy": 6,
  "grammar": 8,
  "feedback":  "This field should contain the correct answer to the question."
`;

    const result = await model.generateContent(prompt);
    let text = result.response.text().trim();

    const clean = extractJSON(text);

    let parsed;
    try {
      parsed = JSON.parse(clean);
    } catch (err) {
      console.warn("⚠ JSON Parse Failed. Raw:", text);
      return {
        fluency: 0,
        technicalAccuracy: 0,
        grammar: 0,
        feedback: "Answer incomplete or missing key technical points.",
      };
    }

    return normalizeScores(parsed);
  } catch (error) {
    console.error("❌ Error evaluating answer:", error.message);
    return {
      fluency: 0,
      technicalAccuracy: 0,
      grammar: 0,
      feedback: "Error evaluating answer. Please try again.",
    };
  }
};