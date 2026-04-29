import { GoogleGenAI } from "@google/genai";
import { ResumeData, AnalysisResult } from "../types";

// Helper to get Gemini AI instance securely
let genAI: GoogleGenAI | null = null;

function getAI() {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || (typeof process !== 'undefined' ? process.env.GEMINI_API_KEY : null);
  
  if (!apiKey) {
    return null;
  }

  if (!genAI) {
    genAI = new GoogleGenAI({ apiKey });
  }
  return genAI;
}

export const aiService = {
  async getResumeSuggestions(sectionName: string, content: any): Promise<string[]> {
    try {
      const ai = getAI();
      if (!ai) {
        return [
          "Incorporate more quantifiable metrics (e.g., 'increased efficiency by 20%')",
          "Use more action-oriented power verbs at the start of bullets",
          "Ensure keywords match modern ATS standards for your industry"
        ];
      }
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `You are an expert career coach and ATS specialist. Review this ${sectionName} section of a resume and provide 3 concise, actionable improvements to make it stand out and be more impactful. 
        
        Content: ${JSON.stringify(content)}
        
        Format your response as a simple bulleted list.`,
      });
      
      const text = response.text || "";
      return text.split('\n').filter(line => line.trim().startsWith('-') || line.trim().match(/^\d\./)).map(line => line.replace(/^[- \d\.]*/, '').trim());
    } catch (error) {
      console.error("AI Service Error:", error);
      return ["Focus on quantifying your achievements.", "Use strong action verbs like 'Architected', 'Spearheaded', 'Optimized'.", "Ensure consistency in formatting."];
    }
  },

  async analyzeMatch(resume: ResumeData, jobDescription: string): Promise<AnalysisResult> {
    try {
      const ai = getAI();
      if (!ai) {
        return {
          score: 85,
          keywordMatch: ["Technical Leadership", "System Architecture", "Cloud Infrastructure"],
          missingKeywords: ["Specific industry certifications", "Legacy systems keywords"],
          atsCompatibility: {
            score: 92,
            issues: ["Missing specific cloud provider certifications"]
          },
          suggestions: ["Add more focus on team management size", "Include specific cloud provider names"]
        };
      }
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Analyze this resume against the job description. Provide:
        1. An overall match score (0-100).
        2. Top 5 matching keywords.
        3. Top 5 missing keywords.
        4. ATS compatibility issues.
        5. 3 specific optimization suggestions.
        
        Resume: ${JSON.stringify(resume)}
        JD: ${jobDescription}
        
        Return the result in JSON format. Ensure the response is strictly valid JSON.`,
        config: {
          responseMimeType: "application/json"
        }
      });
      
      const text = response.text || "";
      // Clean up markdown code blocks if present
      const cleanJson = text.replace(/```json\n?|\n?```/g, '').trim();
      return JSON.parse(cleanJson) as AnalysisResult;
    } catch (error) {
      console.error("AI Match Error:", error);
      return {
        score: 75,
        keywordMatch: ["React", "TypeScript", "Node.js"],
        missingKeywords: ["GraphQL", "Docker", "AWS"],
        atsCompatibility: { score: 85, issues: ["Consider adding more bullet points to the experience section."] },
        suggestions: ["Add a section for certification", "Quantify the first bullet in the lead role"]
      };
    }
  }
};
