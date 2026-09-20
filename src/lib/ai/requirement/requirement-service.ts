import { GoogleGenerativeAI, Schema, SchemaType } from "@google/generative-ai";

export interface StructuredRequirement {
  programType: string;
  domain: string;
  subDomains: string[];
  audience: string | null;
  requiredExperienceYears: number | null;
  mode: string | null;
  location: string | null;
  duration: string | null;
  specialRequirements: string[];
}

export class GeminiRequirementProvider {
  private genAI: GoogleGenerativeAI;
  private modelName: string;

  constructor() {
    const apiKey = process.env.AI_API_KEY;
    if (!apiKey) {
      console.warn("AI_API_KEY is missing. Requirement analysis will fail if invoked.");
    }
    this.genAI = new GoogleGenerativeAI(apiKey || "dummy_key");
    this.modelName = process.env.AI_MODEL || "gemini-2.5-flash";
  }

  async analyzeRequirementText(text: string): Promise<StructuredRequirement> {
    if (!process.env.AI_API_KEY) {
      throw new Error("AI_API_KEY is not configured.");
    }

    const requirementSchema: Schema = {
      type: SchemaType.OBJECT,
      properties: {
        programType: { type: SchemaType.STRING, description: "Type of program (e.g. Workshop, Guest Lecture, Panel Discussion)" },
        domain: { type: SchemaType.STRING, description: "Primary domain or topic of the requirement" },
        subDomains: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING }, description: "Specific sub-domains or topics" },
        audience: { type: SchemaType.STRING, nullable: true, description: "Target audience (e.g., Final Year Students, Faculty)" },
        requiredExperienceYears: { type: SchemaType.INTEGER, nullable: true, description: "Minimum years of experience required" },
        mode: { type: SchemaType.STRING, nullable: true, description: "Delivery mode (e.g., Online, Offline, Both)" },
        location: { type: SchemaType.STRING, nullable: true, description: "Location of the engagement, if offline" },
        duration: { type: SchemaType.STRING, nullable: true, description: "Expected duration (e.g., 2 hours, 1 day)" },
        specialRequirements: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING }, description: "Any other special requirements or constraints" }
      },
      required: ["programType", "domain", "subDomains", "specialRequirements"]
    };

    const model = this.genAI.getGenerativeModel({
      model: this.modelName,
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: requirementSchema,
        temperature: 0.1,
      }
    });

    const prompt = `
You are an expert requirement analyst for an educational institution platform.
Extract the structured requirement details from the provided document text.
If information is missing, use null or empty array. Do not hallucinate missing information.

--- DOCUMENT TEXT ---
${text}
`;

    try {
      const result = await model.generateContent(prompt);
      const responseText = result.response.text();
      return JSON.parse(responseText) as StructuredRequirement;
    } catch (error) {
      console.error("AI Requirement Analysis Error:", error);
      throw new Error("Failed to analyze requirement document.");
    }
  }
}

export const requirementService = new GeminiRequirementProvider();
