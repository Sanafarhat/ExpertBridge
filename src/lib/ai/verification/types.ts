export interface DocumentFinding {
  document: string;
  status: "CONSISTENT" | "INCONSISTENT" | "UNVERIFIABLE";
  finding: string;
}

export interface VerificationInsights {
  summary: string;
  consistent: boolean;
  confidence: number;
  missingInformation: string[];
  inconsistencies: string[];
  documentFindings: DocumentFinding[];
  requiresAdminReview: boolean;
}

export interface AIProvider {
  verifyExpertSubmission(
    expertProfile: unknown,
    documents: unknown[],
    engagements: unknown[]
  ): Promise<VerificationInsights>;
}
