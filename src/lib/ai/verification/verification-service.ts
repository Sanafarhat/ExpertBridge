import { GoogleGenerativeAI, Schema, SchemaType } from "@google/generative-ai";
import { VerificationInsights, AIProvider } from "./types";

export class GeminiVerificationProvider implements AIProvider {
  private genAI: GoogleGenerativeAI;
  private modelName: string;

  constructor() {
    const apiKey = process.env.AI_API_KEY;
    if (!apiKey) {
      console.warn("AI_API_KEY is missing. AI verification will fail if invoked.");
    }
    this.genAI = new GoogleGenerativeAI(apiKey || "dummy_key");
    this.modelName = process.env.AI_MODEL || "gemini-2.5-flash";
  }

  async verifyExpertSubmission(
    expertProfile: unknown,
    documents: unknown[],
    engagements: unknown[]
  ): Promise<VerificationInsights> {
    if (!process.env.AI_API_KEY) {
      throw new Error("AI_API_KEY is not configured in the environment variables.");
    }

    // Define the schema for structured JSON output
    const documentFindingSchema: Schema = {
      type: SchemaType.OBJECT,
      properties: {
        document: { type: SchemaType.STRING, description: "Name or type of the document" },
        status: { 
          type: SchemaType.STRING, 
          description: "Status of finding. Must be CONSISTENT, INCONSISTENT, or UNVERIFIABLE" 
        },
        finding: { type: SchemaType.STRING, description: "Detailed explanation of the finding" }
      },
      required: ["document", "status", "finding"]
    };

    const verificationInsightsSchema: Schema = {
      type: SchemaType.OBJECT,
      properties: {
        summary: { type: SchemaType.STRING, description: "Overall short verification summary" },
        consistent: { type: SchemaType.BOOLEAN, description: "Whether the overall evidence is mostly consistent with the profile" },
        confidence: { type: SchemaType.INTEGER, description: "AI Assessment Confidence from 0 to 100" },
        missingInformation: { 
          type: SchemaType.ARRAY, 
          items: { type: SchemaType.STRING },
          description: "List of information missing from documents that would be needed to fully verify" 
        },
        inconsistencies: { 
          type: SchemaType.ARRAY, 
          items: { type: SchemaType.STRING },
          description: "List of inconsistencies found between documents and profile" 
        },
        documentFindings: { 
          type: SchemaType.ARRAY, 
          items: documentFindingSchema,
          description: "Detailed findings per submitted document" 
        },
        requiresAdminReview: { 
          type: SchemaType.BOOLEAN, 
          description: "Set to true if there are inconsistencies or missing information requiring manual admin review" 
        }
      },
      required: ["summary", "consistent", "confidence", "missingInformation", "inconsistencies", "documentFindings", "requiresAdminReview"]
    };

    const model = this.genAI.getGenerativeModel({
      model: this.modelName,
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: verificationInsightsSchema,
        temperature: 0.1,
      }
    });

    const prompt = `
You are an expert credential verification assistant. Your task is to analyze an expert's submitted profile, their documents, and engagement history to generate verification insights for a human administrator. 

IMPORTANT RULES:
1. You assist the human admin. Do not make a final VERIFIED/REJECTED decision.
2. Compare the Extracted Document Evidence against the Expert Profile.
3. Identify inconsistencies (e.g. name mismatch, dates mismatch).
4. Identify missing evidence (e.g. missing degrees, unverified claims).
5. Output ONLY the requested structured JSON format.

--- EXPERT PROFILE ---
${JSON.stringify(expertProfile, null, 2)}

--- EXTRACTED DOCUMENT EVIDENCE ---
${JSON.stringify(documents, null, 2)}

--- ENGAGEMENT HISTORY ---
${JSON.stringify(engagements, null, 2)}
`;

    try {
      const result = await model.generateContent(prompt);
      const responseText = result.response.text();
      
      const insights = JSON.parse(responseText) as VerificationInsights;
      return insights;
    } catch (error) {
      console.error("AI Verification Error:", error);
      throw new Error("Failed to process verification with AI provider.");
    }
  }
}

// Factory to get the configured provider
export function getVerificationProvider(): AIProvider {
  const providerType = process.env.AI_VERIFICATION_PROVIDER || 'gemini';
  
  if (providerType === 'gemini') {
    return new GeminiVerificationProvider();
  }
  
  throw new Error(`Unsupported AI_VERIFICATION_PROVIDER: ${providerType}`);
}
