import { GoogleGenAI, Type } from "@google/genai";
import { PortfolioData } from "../types.ts";

// This function lazily initializes the GoogleGenAI client.
// It prevents the app from crashing on startup if the API_KEY is not available.
const getAIClient = () => {
  const API_KEY = process.env.API_KEY;
  if (!API_KEY) {
    throw new Error("API Key not found. Please ensure it is configured in your environment.");
  }
  return new GoogleGenAI({ apiKey: API_KEY });
};

export const refineTextWithAI = async (text: string, type: 'summary' | 'description'): Promise<string> => {
  try {
    const ai = getAIClient();
    let prompt = '';
    if (type === 'summary') {
      prompt = `You are an expert career coach and copywriter specializing in tech portfolios. Rewrite the following professional summary to be more concise, impactful, and professional for a high-end portfolio website. The tone should be confident and highlight key skills and achievements. Keep it to 2-3 eloquent sentences.
      
      Original Summary:
      "${text}"
      
      Refined Summary:`;
    } else {
      prompt = `You are an expert technical writer for software engineering portfolios. Rewrite the following project description to be more compelling for a high-end portfolio. Focus on the problem, the solution, the technologies used, and the impact or results. Use active voice and strong verbs. Keep it concise and professional.
      
      Original Description:
      "${text}"
      
      Refined Description:`;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text.trim();
  } catch (error: any) {
    console.error("Error refining text with AI:", error);
    return `An error occurred while refining the text: ${error.message}`;
  }
};

export const generateProjectDetailsFromImage = async (imageBase64: string, mimeType: string): Promise<{ title: string; description: string; tags: string[] }> => {
  try {
    const ai = getAIClient();
    
    const imagePart = {
      inlineData: {
        mimeType: mimeType,
        data: imageBase64,
      },
    };
  
    const textPart = {
      text: `You are an expert technical writer for software engineering portfolios. Analyze the provided image, which is likely a screenshot of a web application, mobile app, or design mockup. Based on the visual content, generate a plausible and professional project title, a concise, compelling project description, and a list of 3-4 relevant technology tags (e.g., 'React', 'UI/UX Design', 'Data Visualization'). Format the output as a JSON object that strictly adheres to the provided schema.`,
    };
  
    const schema = {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING, description: 'A short, professional title for the project.' },
        description: { type: Type.STRING, description: 'A concise description (2-3 sentences) of the project.' },
        tags: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'A list of 3-4 relevant technology tags.' },
      },
      required: ['title', 'description', 'tags']
    };
  
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [textPart, imagePart] },
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
      },
    });
  
    const jsonString = response.text.trim();
    const parsedData = JSON.parse(jsonString);
    return parsedData;

  } catch (error) {
    console.error("Error generating project details from image:", error);
    // Return generic details on failure to prevent app crash
    return {
      title: 'New Project from Image',
      description: 'A new project was created from your uploaded image. You can edit this text.',
      tags: ['New', 'Editable']
    };
  }
};


export const parsePdfWithAI = async (pdfBase64: string): Promise<Partial<PortfolioData>> => {
  // getAIClient() is called here. If it throws an error because the key is missing,
  // the error will be caught by the try...catch block in the App.tsx component,
  // which will then show an alert to the user.
  const ai = getAIClient();

  const filePart = {
    inlineData: {
      mimeType: 'application/pdf',
      data: pdfBase64,
    },
  };

  const textPart = {
    text: `Analyze the provided resume PDF and extract the user's portfolio information. Format the output as a JSON object that strictly adheres to the provided schema. Extract as much information as possible.
    - Personal Details: Extract key personal details like birthday, school, major, etc., as a list of label-value pairs.
    - Summary: A professional summary or objective statement.
    - Work Experience: Identify distinct jobs or internships. For each, provide the role/title, the organization, the dates of employment, and a detailed description of responsibilities and achievements.
    - Research Experience: Similar to work experience, but for research positions.
    - Awards and Honors: List any awards or honors mentioned.
    - Skills: Extract skills and estimate proficiency from 0-100.
    - Projects: Extract distinct projects with titles, descriptions, and technologies used.`,
  };

  const schema = {
    type: Type.OBJECT,
    properties: {
        name: { type: Type.STRING },
        title: { type: Type.STRING },
        about: {
            type: Type.OBJECT,
            properties: {
                summary: { type: Type.STRING },
                details: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            label: { type: Type.STRING },
                            value: { type: Type.STRING },
                        },
                        required: ['label', 'value']
                    }
                },
                workExperience: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            role: { type: Type.STRING },
                            organization: { type: Type.STRING },
                            date: { type: Type.STRING },
                            description: { type: Type.STRING },
                        },
                        required: ['role', 'organization', 'date', 'description']
                    }
                },
                researchExperience: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            role: { type: Type.STRING },
                            organization: { type: Type.STRING },
                            date: { type: Type.STRING },
                            description: { type: Type.STRING },
                        },
                    }
                },
                awards: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            name: { type: Type.STRING },
                            issuer: { type: Type.STRING },
                            date: { type: Type.STRING },
                        },
                        required: ['name', 'issuer', 'date']
                    }
                },
            }
        },
        contact: {
            type: Type.OBJECT,
            properties: {
                email: { type: Type.STRING },
            },
        },
        projects: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING },
                    description: { type: Type.STRING },
                    tags: { type: Type.ARRAY, items: { type: Type.STRING } },
                },
                required: ['title', 'description']
            }
        },
        skills: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING },
                    level: { type: Type.INTEGER, description: 'Proficiency level from 0 to 100' },
                },
                required: ['name', 'level']
            }
        }
    },
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [textPart, filePart] },
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
      },
    });

    const jsonString = response.text.trim();
    const parsedData = JSON.parse(jsonString);

    if (typeof parsedData !== 'object' || parsedData === null) {
        throw new Error("Parsed data is not a valid object.");
    }
    
    return parsedData as Partial<PortfolioData>;

  } catch (error) {
    console.error("Error parsing PDF with AI:", error);
    // Re-throwing the error to be caught by the UI component
    throw new Error(`An error occurred while analyzing the PDF. Please check the API response or your PDF file.`);
  }
};