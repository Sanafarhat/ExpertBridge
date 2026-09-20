import Groq from "groq-sdk";

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

export interface AIProvider {
  analyzeRequirementText(text: string): Promise<StructuredRequirement>;
}

export class GroqRequirementProvider implements AIProvider {
  private groq: Groq;
  private modelName: string;

  constructor() {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      console.warn("GROQ_API_KEY is missing. AI requirement analysis will fail if invoked.");
    }
    // We instantiate even without key so the constructor doesn't throw instantly, but runtime calls will fail.
    this.groq = new Groq({ apiKey: apiKey || "dummy_key" });
    this.modelName = process.env.GROQ_REQUIREMENT_MODEL || "llama-3.1-8b-instant";
  }

  async analyzeRequirementText(text: string): Promise<StructuredRequirement> {
    if (!process.env.GROQ_API_KEY) {
      throw new Error("GROQ_API_KEY is not configured in the environment variables.");
    }

    const prompt = `
You are an expert requirement analyst for an educational institution platform.
Extract the structured requirement details from the provided document text.
If information is missing, use null or an empty array. Do not hallucinate missing information.

You must reply with ONLY a strictly formatted JSON object that matches this exact schema structure:
{
  "programType": "string (e.g. Workshop, Guest Lecture)",
  "domain": "string (Primary domain)",
  "subDomains": ["string", "string"],
  "audience": "string or null",
  "requiredExperienceYears": 5, // number or null
  "mode": "string or null",
  "location": "string or null",
  "duration": "string or null",
  "specialRequirements": ["string"]
}

--- DOCUMENT TEXT ---
${text}
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
      if (!parsed.programType || !parsed.domain || !Array.isArray(parsed.subDomains) || !Array.isArray(parsed.specialRequirements)) {
        throw new Error("Invalid JSON structure returned by Groq.");
      }
      
      return parsed as StructuredRequirement;
    } catch (error) {
      console.error("AI Requirement Analysis Error:", error);
      throw new Error("Failed to analyze requirement document with Groq.");
    }
  }
}

// Factory to get the configured provider
export function getRequirementProvider(): AIProvider {
  const providerType = process.env.AI_PROVIDER || 'groq';
  
  if (providerType === 'groq') {
    return new GroqRequirementProvider();
  }
  
  throw new Error(`Unsupported AI_PROVIDER: ${providerType}`);
}

export const requirementService = getRequirementProvider();
