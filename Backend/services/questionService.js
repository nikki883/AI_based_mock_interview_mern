// import { GoogleGenerativeAI } from "@google/generative-ai";

// const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);

// export const generateQuestions = async (department, subject) => {
//   try {
//     const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

//     const prompt = `
//       Generate 5 technical interview questions for a candidate
//       applying in the ${department} department, focusing on ${subject}.
//       Return the questions as a plain JSON array of strings, no extra text.
//     `;

//     const result = await model.generateContent(prompt);
//     const text = result.response.text();

//     // Try to parse clean JSON (Gemini sometimes adds formatting)
//     let questions;
//     try {
//       questions = JSON.parse(text);
//     } catch (err) {
//       console.warn("Parsing Gemini output failed, fallback to text split");
//       questions = text.split("\n").filter(q => q.trim());
//     }

//     return questions;
//   } catch (error) {
//     console.error("Error generating questions:", error);
//     return [];
//   }
// };



import 'dotenv/config';
import { GoogleGenerativeAI } from "@google/generative-ai"; 

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_KEY);

const model = genAI.getGenerativeModel({ 
    model: "gemini-2.0-flash",
    systemInstruction: `
        You are an expert technical interviewer.
        Generate exactly 5 technical interview questions based on the
        department and subject provided.
        Return questions strictly as a JSON array of strings.
        DO NOT include any markdown, code blocks, or extra text.
    `
});


// Cache to prevent duplicate calls
const questionCache = new Map();


export const generateQuestions = async (department, subject) => {

     // Create a cache key
    const cacheKey = `${department}-${subject}`;

     // Check if we already have questions for this department-subject combo
    if (questionCache.has(cacheKey)) {
        console.log('Returning cached questions');
        return questionCache.get(cacheKey);
    }


      const prompt = `
Generate 5 technical interview questions for ${department} department on ${subject}.
Return ONLY a JSON array of strings. No extra text.
    `;

    try {
        const result = await model.generateContent(prompt);
         let text = result.response.text().trim();

          // Remove any markdown/code block artifacts just in case
           text = text.replace(/```json/g, "").replace(/```/g, "").trim();
        
        // Try parse JSON, fallback to text split
        let questions;
        try {
            questions = JSON.parse(text);
        } catch (err) {
            questions = text.split("\n")
                .map(q => q.trim())
                .filter(q => q && !["[", "]"].includes(q))
                .map(q => q.replace(/^["']|["']$/g, "").replace(/,$/, "")); // remove quotes and trailing commas
        }

         // Ensure we only return valid questions
        questions = questions.filter(q => typeof q === 'string' && q.length > 0).slice(0, 5);

        // Cache the result
        questionCache.set(cacheKey, questions);

        return questions;
    } catch (error) {
        console.error("Error generating questions:", error);
        return [];
    }
};