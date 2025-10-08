// import { GoogleGenerativeAI } from "@google/generative-ai";

// const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_KEY);

// export const evaluateAnswer = async (question, answer) => {
//   try {
//     const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

//     const prompt = `
//       You are an AI interview evaluator.
//       Question: "${question}"
//       Candidate's Answer: "${answer}"

//       Evaluate the answer strictly on these criteria (0-10 scale for each):
//       - grammar
//       - technicalAccuracy
//       - confidence

//       Return a JSON object only, like:
//       {
//         "grammar": 7,
//         "technicalAccuracy": 8,
//         "confidence": 6
//       }
//     `;

//     const result = await model.generateContent(prompt);
//     const text = result.response.text();

//     let evaluation;
//     try {
//       evaluation = JSON.parse(text);
//     } catch (err) {
//       console.warn("Evaluation parse failed, fallback to defaults");
//       evaluation = {
//         grammar: 0,
//         technicalAccuracy: 0,
//         confidence: 0,
//       };
//     }

//     return evaluation;
//   } catch (error) {
//     console.error("Error evaluating answer:", error);
//     return { grammar: 0, technicalAccuracy: 0, confidence: 0 };
//   }
// };


import 'dotenv/config';
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_KEY);

// Verify API key is loaded
if (!process.env.GOOGLE_GEMINI_KEY) {
  console.error("❌ GOOGLE_GEMINI_KEY is not set in .env file!");
} else {
  console.log("✅ Gemini API Key loaded");
}

const model = genAI.getGenerativeModel({ 
  model: "gemini-2.0-flash-exp",
  generationConfig: {
    temperature: 0.3,
    topP: 0.8,
    topK: 40,
  }
});

// Helper function to extract JSON from text
function extractJSON(text) {
  // Remove markdown code blocks
  text = text.replace(/```json\s*/gi, '').replace(/```\s*/g, '');
  
  // Try to find JSON object
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    return jsonMatch[0];
  }
  
  return text;
}

// Helper function to normalize score keys
function normalizeScores(obj) {
  const normalized = {};
  
  for (let key in obj) {
    const lowerKey = key.toLowerCase();
    const value = Number(obj[key]) || 0;
    const clampedValue = Math.min(Math.max(value, 0), 10);
    
    if (lowerKey.includes('confidence')) {
      normalized.confidence = clampedValue;
    } else if (lowerKey.includes('fluency')) {
      normalized.fluency = clampedValue;
    } else if (lowerKey.includes('technical')) {
      normalized.technicalAccuracy = clampedValue;
    } else if (lowerKey.includes('grammar')) {
      normalized.grammar = clampedValue;
    }
  }
  
  // Fill missing values with 5 (neutral)
  normalized.confidence = normalized.confidence ?? 5;
  normalized.fluency = normalized.fluency ?? 5;
  normalized.technicalAccuracy = normalized.technicalAccuracy ?? 5;
  normalized.grammar = normalized.grammar ?? 5;
  
  return normalized;
}

export const evaluateAnswer = async (question, answer) => {
  try {
    if (!question || !answer) {
      console.warn("Missing question or answer");
      return {
        confidence: 5,
        fluency: 5,
        technicalAccuracy: 5,
        grammar: 5
      };
    }

    const prompt = `Evaluate this interview answer. Return ONLY a JSON object with these exact keys:

Question: ${question}

Answer: ${answer}

Required JSON format (no extra text):
{
  "confidence": <number 0-10>,
  "fluency": <number 0-10>,
  "technicalAccuracy": <number 0-10>,
  "grammar": <number 0-10>
}

Scoring guide:
- confidence: How assertive and sure the answer sounds (0=very unsure, 10=very confident)
- fluency: How smooth and natural the answer flows (0=choppy, 10=very fluent)
- technicalAccuracy: How correct the technical content is (0=wrong, 10=perfectly correct)
- grammar: Sentence structure and language quality (0=many errors, 10=perfect grammar)`;

    console.log("\n=== Evaluating Answer ===");
    console.log("Question:", question.substring(0, 100) + "...");
    console.log("Answer:", answer.substring(0, 100) + "...");

    const result = await model.generateContent(prompt);
    let text = result.response.text().trim();

    console.log("\n=== Raw Gemini Response ===");
    console.log(text);
    console.log("========================\n");

    // Extract JSON from response
    const jsonText = extractJSON(text);
    console.log("Extracted JSON:", jsonText);

    let evaluation;
    try {
      const parsed = JSON.parse(jsonText);
      evaluation = normalizeScores(parsed);
      console.log("✅ Parsed evaluation:", evaluation);
    } catch (parseErr) {
      console.error("❌ JSON parse failed:", parseErr.message);
      console.log("Attempting alternative parsing...");
      
      // Try to extract numbers using regex as fallback
      const confidenceMatch = text.match(/confidence['":\s]+(\d+)/i);
      const fluencyMatch = text.match(/fluency['":\s]+(\d+)/i);
      const technicalMatch = text.match(/technical[^:]*['":\s]+(\d+)/i);
      const grammarMatch = text.match(/grammar['":\s]+(\d+)/i);
      
      evaluation = {
        confidence: confidenceMatch ? Math.min(Number(confidenceMatch[1]), 10) : 5,
        fluency: fluencyMatch ? Math.min(Number(fluencyMatch[1]), 10) : 5,
        technicalAccuracy: technicalMatch ? Math.min(Number(technicalMatch[1]), 10) : 5,
        grammar: grammarMatch ? Math.min(Number(grammarMatch[1]), 10) : 5
      };
      
      console.log("⚠️ Using regex-extracted scores:", evaluation);
    }

    return evaluation;

  } catch (error) {
    console.error("❌ Error evaluating answer:", error.message);
    console.error("Stack:", error.stack);
    
    return {
      confidence: 5,
      fluency: 5,
      technicalAccuracy: 5,
      grammar: 5
    };
  }
};