import { GoogleGenAI, Type } from "@google/genai";
import type { Cut, StoryPart } from '../types';

const partDescriptions: Record<StoryPart, string> = {
    '기': 'Introduction: Introduce characters, setting, and initial conflict.',
    '승': 'Development: Escalate the conflict and develop the plot.',
    '전': 'Turn/Climax: The turning point or climax of the story.',
    '결': 'Conclusion: Resolve the conflict and conclude the story.'
};

const parseJsonErrorMessage = (value: string): string | null => {
  try {
    const jsonStart = value.indexOf("{");
    const jsonEnd = value.lastIndexOf("}");
    if (jsonStart === -1 || jsonEnd === -1) return null;
    const possibleJson = value.slice(jsonStart, jsonEnd + 1);
    const parsed = JSON.parse(possibleJson);
    if (parsed?.error?.message && typeof parsed.error.message === "string") {
      return parsed.error.message;
    }
  } catch {
    // Ignore JSON parsing failures; fallback message will be used.
  }
  return null;
};

const extractGeminiErrorMessage = (error: unknown): string | null => {
  if (!error) return null;
  if (typeof error === "string") {
    return parseJsonErrorMessage(error) ?? error;
  }
  if (error instanceof Error) {
    return parseJsonErrorMessage(error.message) ?? error.message;
  }
  if (typeof error === "object" && "message" in error && typeof (error as { message: unknown }).message === "string") {
    const message = (error as { message: string }).message;
    return parseJsonErrorMessage(message) ?? message;
  }
  return null;
};

export const analyzeNovel = async (
  text: string,
  partCuts: Record<StoryPart, number>,
  apiKey: string,
): Promise<Record<StoryPart, Cut[]>> => {
  const trimmedKey = apiKey?.trim();
  if (!trimmedKey) {
    throw new Error("Gemini API 키를 입력해주세요.");
  }

  const ai = new GoogleGenAI({ apiKey: trimmedKey });
  const cutSchema = {
    type: Type.OBJECT,
    properties: {
      place: {
        type: Type.STRING,
        description: 'The location where the scene takes place. (장소)',
      },
      characterCount: {
        type: Type.INTEGER,
        description: 'The count of characters present in the scene. (인물 수)',
      },
      characters: {
          type: Type.ARRAY,
          description: 'The names of the characters in the scene. IMPORTANT: Only list names if 4 or fewer characters. If 5 or more, return an empty array []. (등장인물)',
          items: {
              type: Type.STRING,
          },
      },
      dialogue: {
        type: Type.STRING,
        description: 'A key line of dialogue or a summary of the conversation. If no dialogue, state "없음". (대사)',
      },
      situation: {
        type: Type.STRING,
        description: 'A brief description of what is happening in the scene. (상황)',
      },
      shot: {
          type: Type.STRING,
          description: 'Suggest the most fitting camera shot for the scene (e.g., 클로즈업, 롱 샷, 오버 더 숄더 샷). (영화 컷)'
      }
    },
    required: ['place', 'characterCount', 'characters', 'dialogue', 'situation', 'shot'],
  };

  const schema = {
      type: Type.OBJECT,
      properties: {
        '기': { type: Type.ARRAY, description: 'Cuts for the Introduction part.', items: cutSchema },
        '승': { type: Type.ARRAY, description: 'Cuts for the Development part.', items: cutSchema },
        '전': { type: Type.ARRAY, description: 'Cuts for the Climax part.', items: cutSchema },
        '결': { type: Type.ARRAY, description: 'Cuts for the Conclusion part.', items: cutSchema },
      },
      required: ['기', '승', '전', '결'],
  };

  const prompt = `
    You are an expert film script analyst. Your task is to analyze the provided novel text and break it down into a 4-act structure (기-승-전-결).

    Generate sequential cuts for EACH of the four parts based on the counts I provide:
    - '기' Section (${partDescriptions['기']}): ${partCuts['기']} cuts.
    - '승' Section (${partDescriptions['승']}): ${partCuts['승']} cuts.
    - '전' Section (${partDescriptions['전']}): ${partCuts['전']} cuts.
    - '결' Section (${partDescriptions['결']}): ${partCuts['결']} cuts.

    Based on the full novel text provided below, create the scenes for each section.

    For each cut, you must extract the following information in Korean:
    1.  **place (장소):** The location where the scene takes place.
    2.  **characterCount (인물 수):** The total number of characters present in the scene.
    3.  **characters (등장인물):** The names of the characters. IMPORTANT: Only list names if there are 4 or fewer characters. If there are 5 or more, return an empty array [].
    4.  **dialogue (대사):** A key line of dialogue or a concise summary of the conversation. If there is no dialogue, you must write "대사 없음".
    5.  **situation (상황):** A brief description of the events and atmosphere of the scene.
    6.  **shot (영화 컷):** Suggest the most fitting camera shot for the scene (e.g., 클로즈업, 롱 샷, 오버 더 숄더 샷, 트래킹 샷).

    Provide the final output as a single, valid JSON object with four keys: "기", "승", "전", "결". Each key must contain an array of cut objects for that section, strictly adhering to the defined schema. Do not include any explanations or text outside of the JSON object.

    Novel Text:
    ---
    ${text}
    ---
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
      },
    });

    const jsonString = response.text.trim();
    const result = JSON.parse(jsonString);
    
    if (typeof result !== 'object' || result === null || Array.isArray(result)) {
        throw new Error("API did not return a valid object.");
    }

    return result as Record<StoryPart, Cut[]>;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    const parsedMessage = extractGeminiErrorMessage(error);
    const fallbackMessage = "Gemini API 호출에 실패했습니다. API 키를 확인한 뒤 다시 시도해주세요.";
    throw new Error(parsedMessage ?? fallbackMessage);
  }
};
