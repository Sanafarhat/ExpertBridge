import Groq from "groq-sdk";
import { VerificationInsights, AIProvider } from "./types";

export class GroqVerificationProvider implements AIProvider {
  private groq: Groq;
  private modelName: string;

  constructor() {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      console.warn("GROQ_API_KEY is missing. AI verification will fail if invoked.");
    }
    this.groq = new Groq({ apiKey: apiKey || "dummy_key" });
    this.modelName = process.env.GROQ_VERIFICATION_MODEL || "llama-3.3-70b-versatile";
  }

  async verifyExpertSubmission(
    expertProfile: unknown,
    documents: unknown[],
    engagements: unknown[]
  ): Promise<VerificationInsights> {
    if (!process.env.GROQ_API_KEY) {
      throw new Error("GROQ_API_KEY is not configured in the environment variables.");
    }

    const prompt = `
You are an expert credential verification assistant. Your task is to analyze an expert's submitted profile, their documents, and engagement history to generate verification insights for a human administrator. 

IMPORTANT RULES:
1. You assist the human admin. Do not make a final VERIFIED/REJECTED decision.
2. Compare the Extracted Document Evidence against the Expert Profile.
3. Identify inconsistencies (e.g. name mismatch, dates mismatch).
4. Identify missing evidence (e.g. missing degrees, unverified claims).
5. Output ONLY a strictly formatted JSON object matching this exact schema:

{
  "summary": "Overall short verification summary",
  "consistent": true, // boolean (true if overall evidence is mostly consistent)
  "confidence": 85, // integer 0-100
  "missingInformation": ["List of missing information"],
  "inconsistencies": ["List of inconsistencies found"],
  "documentFindings": [
    {
      "document": "Name or type of document",
      "status": "CONSISTENT | INCONSISTENT | UNVERIFIABLE",
      "finding": "Detailed explanation of the finding"
    }
  ],
  "requiresAdminReview": true // boolean (true if there are inconsistencies or missing info)
}

--- EXPERT PROFILE ---
${JSON.stringify(expertProfile, null, 2)}

--- EXTRACTED DOCUMENT EVIDENCE ---
${JSON.stringify(documents, null, 2)}

--- ENGAGEMENT HISTORY ---
${JSON.stringify(engagements, null, 2)}
`;

    try {
      const response = await this.groq.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: this.modelName,
        response_format: { type: "json_object" },
        temperature: 0.1
      });

      const responseText = response.choices[0]?.message?.content;
      if (!responseText) throw new Error("No response from Groq.");

      const parsed = JSON.parse(responseText);
      
      // Basic runtime validation
      if (typeof parsed.summary !== 'string' || typeof parsed.consistent !== 'boolean' || typeof parsed.requiresAdminReview !== 'boolean' || !Array.isArray(parsed.documentFindings)) {
        throw new Error("Invalid JSON structure returned by Groq.");
      }
      
      return parsed as VerificationInsights;
    } catch (error) {
      console.error("AI Verification Error:", error);
      throw new Error("Failed to process verification with Groq.");
    }
  }
}

// Factory to get the configured provider
export function getVerificationProvider(): AIProvider {
  const providerType = process.env.AI_PROVIDER || 'groq';
  
  if (providerType === 'groq') {
    return new GroqVerificationProvider();
  }
  
  throw new Error(`Unsupported AI_PROVIDER: ${providerType}`);
}
