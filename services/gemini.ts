
import { GoogleGenAI, Type } from "@google/genai";
import { BibleStudyCategory } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const categorizeBibleStudyVideo = async (title: string, description: string): Promise<BibleStudyCategory> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Categorize this Bible study video titled "${title}" with description "${description}". 
      Pick exactly one from these categories: Theology, Evangelism, Youth, Family, Worship, Prophecy, General.
      Return ONLY the category name.`,
      config: {
        temperature: 0.1,
      },
    });

    const category = response.text?.trim() as BibleStudyCategory;
    const validCategories: BibleStudyCategory[] = ['Theology', 'Evangelism', 'Youth', 'Family', 'Worship', 'Prophecy', 'General'];
    
    return validCategories.includes(category) ? category : 'General';
  } catch (error) {
    console.error("Gemini categorization failed:", error);
    return 'General';
  }
};

export interface SEOAnalysis {
  metaTitle: string;
  metaDescription: string;
  aeoSnippet: string;
  keywords: string[];
  readabilityScore: number;
  entities: string[];
  schemaJsonLd: string;
  suggestions: string[];
}

export const analyzeSEOContent = async (content: string, title: string): Promise<SEOAnalysis> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `Perform a master-level SEO and AEO (Answer Engine Optimization) audit on the following content for a church website.
      
      TITLE: ${title}
      CONTENT: ${content}
      
      Tasks:
      1. Create a CTR-optimized Meta Title (max 60 chars).
      2. Create a compelling Meta Description (max 155 chars).
      3. Create an "AEO Featured Snippet" - a 50-word direct answer paragraph that summarizes the core truth/answer of this content for AI search engines.
      4. Extract 5-10 semantic entities (key topics/people/places).
      5. Generate a valid JSON-LD Schema.org object (type: Article or FAQ if appropriate).
      6. Provide 3 specific suggestions to improve search authority.
      7. Provide a readability score 0-100.

      Return the result in JSON format.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            metaTitle: { type: Type.STRING },
            metaDescription: { type: Type.STRING },
            aeoSnippet: { type: Type.STRING },
            keywords: { type: Type.ARRAY, items: { type: Type.STRING } },
            readabilityScore: { type: Type.NUMBER },
            entities: { type: Type.ARRAY, items: { type: Type.STRING } },
            schemaJsonLd: { type: Type.STRING },
            suggestions: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["metaTitle", "metaDescription", "aeoSnippet", "schemaJsonLd"]
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("SEO Audit failed:", error);
    throw error;
  }
};
