import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

/**
 * Helper function to call the Gemini API with retry logic and fallback models.
 * Helps handle temporary 503 (high demand) or 429 (rate limit) errors.
 */
async function generateContentWithRetry(prompt, modelsToTry = ["gemini-3.5-flash", "gemini-3.6-flash", "gemini-2.0-flash"]) {
  let lastError = null;

  for (const modelName of modelsToTry) {
    let attempts = 3;
    let delay = 1000; // start with 1 second delay

    while (attempts > 0) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent(prompt);
        if (result && result.response) {
          return result;
        }
      } catch (error) {
        lastError = error;
        
        // If it's a 404 (model deprecated/unavailable), don't retry, try the next model immediately
        if (error.status === 404 || (error.message && error.message.includes("404"))) {
          break;
        }

        attempts--;
        if (attempts > 0) {
          await new Promise((resolve) => setTimeout(resolve, delay));
          delay *= 2; // exponential backoff
        }
      }
    }
  }

  throw lastError || new Error("All generative AI models failed to generate a response.");
}

/**
 * Analyze symptoms using Gemini AI and return structured JSON.
 * @param {string} userSymptoms - User-described symptoms
 * @returns {Promise<Object>} Parsed diagnosis result
 */
export async function analyzeSymptoms(userSymptoms) {
  const prompt = `
You are an experienced AI Doctor Assistant.

Your responsibility is to analyze the user's symptoms and provide educational health guidance. Never present your response as a confirmed medical diagnosis. If the symptoms suggest a medical emergency, clearly advise the user to seek immediate medical attention.

IMPORTANT LANGUAGE INSTRUCTIONS:
- Use SIMPLE and MEDIUM-LEVEL English.
- Write as if explaining to a person with basic English knowledge.
- Avoid difficult medical words whenever possible.
- If you must use a medical term, explain it in simple words.
- Keep sentences short and easy to read.
- Use a friendly, caring, and professional tone.
- Do NOT use highly technical or doctor-only language.
- Make explanations practical and easy to understand.

User Symptoms:
"${userSymptoms}"

Instructions:

1. Analyze the user's symptoms carefully.
2. Add a short, user-friendly diagnosis title.
   Examples:
   - "Possible Diagnosis"
   - "Most Likely Condition"
   - "Health Assessment"
3. Identify the most likely disease or health condition (not a confirmed diagnosis).
4. Give a confidence score between 0 and 100.
5. Explain in simple English why this condition is suspected.
6. Mention possible causes using easy-to-understand language.
7. List common symptoms in simple words.
8. Suggest appropriate medicines for the suspected disease. For each medicine include:
   - Medicine name
   - Generic name
   - Medicine category
   - Purpose (explain in simple English)
   - Recommended dosage
   - Precautions (easy to understand)
   - Common side effects (simple language)
9. Suggest simple home remedies.
10. Recommend healthy foods to eat.
11. Mention foods and drinks to avoid.
12. Give simple self-care tips.
13. Mention warning signs that mean the user should get medical help immediately.
14. Mention whether the user should visit a doctor and explain why in simple English.
15. Mention whether hospitalization is recommended and explain why.
16. Provide easy prevention tips to reduce the chance of getting this condition again.
17. Include a simple medical disclaimer stating that the information is only for education and is not a substitute for professional medical advice.

IMPORTANT RULES:
- Return ONLY valid JSON.
- Do NOT return Markdown.
- Do NOT use \`\`\`json.
- Do NOT include explanations outside the JSON.
- Every field must be present.
- If information is unavailable, return an empty string or an empty array.
- Make sure the JSON is valid and can be parsed directly using JSON.parse().
- Every string value should be be written in SIMPLE and MEDIUM-LEVEL English.
- Avoid complex medical jargon unless necessary.
- If a medical term is necessary, explain it in simple words.
- The "diagnosisTitle" must always be short, friendly, and suitable as an app heading.

Return a JSON object in exactly this structure:

{
  "diagnosisTitle": "Possible Diagnosis",
  "suspectedDisease": "Name of the most likely disease or health condition",
  "confidenceScore": 85,
  "reasonForSuspicion": "Explain in simple English why this condition is suspected.",
  "possibleCauses": [
    "Cause 1",
    "Cause 2"
  ],
  "commonSymptoms": [
    "Symptom 1",
    "Symptom 2"
  ],
  "medicines": [
    {
      "name": "Medicine Name",
      "genericName": "Generic Name",
      "category": "Medicine Category",
      "purpose": "Explain what this medicine does in simple English.",
      "dosage": "Recommended dosage and frequency.",
      "precautions": "Simple precautions before taking this medicine.",
      "sideEffects": "Common side effects in easy language."
    }
  ],
  "homeRemedies": [
    "Home remedy 1",
    "Home remedy 2"
  ],
  "recommendedFoods": [
    "Food 1",
    "Food 2"
  ],
  "foodsToAvoid": [
    "Food or drink 1",
    "Food or drink 2"
  ],
  "selfCareTips": [
    "Self-care tip 1",
    "Self-care tip 2"
  ],
  "warningSignsForImmediateAttention": [
    "Warning sign 1",
    "Warning sign 2"
  ],
  "shouldVisitDoctor": true,
  "visitDoctorReason": "Explain in simple English why the user should or should not visit a doctor.",
  "hospitalizationRecommended": false,
  "hospitalizationReason": "Explain in simple English why hospitalization is or is not needed.",
  "preventionGuide": [
    "Prevention tip 1",
    "Prevention tip 2"
  ],
  "disclaimer": "This information is for educational purposes only. It is not a substitute for advice, diagnosis, or treatment from a qualified doctor. Always consult a healthcare professional before taking any medicine or making health decisions."
}
`;

  const result = await generateContentWithRetry(prompt, ["gemini-3.5-flash", "gemini-3.6-flash", "gemini-2.0-flash"]);
  const text = result.response.text().trim();

  // Strip markdown code fences if the model wraps the response anyway
  const cleaned = text
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim();

  return JSON.parse(cleaned);
}
