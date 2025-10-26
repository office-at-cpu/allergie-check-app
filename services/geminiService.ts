
import { GoogleGenAI, Type } from "@google/genai";
import type { UserData, Question, Answer } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: AIzaSyBW4FONM6YDzJa2to-2RRmXRjPl2Vr1iyw });

const questionGenerationSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      questionText: {
        type: Type.STRING,
        description: 'Die Frage an den Benutzer.'
      },
      options: {
        type: Type.ARRAY,
        items: {
          type: Type.STRING
        },
        description: 'Eine Liste von 3-5 Antwortmöglichkeiten.'
      },
    },
    required: ['questionText', 'options'],
  },
};

export async function generateQuestions(userData: UserData): Promise<Question[]> {
  const prompt = `
    Bitte agiere als erfahrener Dermatologe, spezialisiert auf Allergologie. 
    Erstelle eine Liste von 20 Multiple-Choice-Fragen für eine vorläufige Allergie-Anamnese für eine Person mit folgenden Daten:
    - Alter: ${userData.age}
    - Geschlecht: ${userData.gender}

    Die Fragen sollten die folgenden Bereiche abdecken:
    - Art der Symptome (Haut, Atemwege, Verdauungstrakt)
    - Zeitlicher Verlauf und Häufigkeit der Symptome
    - Mögliche Auslöser (Nahrungsmittel, Pollen, Tiere, Medikamente, etc.)
    - Familiäre Vorbelastung (Allergien in der Familie)
    - Lebensstil und Umweltfaktoren (Beruf, Hobbys, Wohnsituation)

    Das Ziel ist es, umfassende Informationen zu sammeln, um die Wahrscheinlichkeit einer allergischen Erkrankung einschätzen zu können. 
    Die Fragen sollten klar, verständlich und einfühlsam formuliert sein.
    Stelle sicher, dass die Antwortmöglichkeiten prägnant sind und typische Szenarien abdecken.
    Gib das Ergebnis als JSON-Array zurück, das dem bereitgestellten Schema entspricht.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: questionGenerationSchema,
      },
    });

    const jsonString = response.text.trim();
    const questions = JSON.parse(jsonString);
    return questions as Question[];
  } catch (error) {
    console.error("Fehler bei der Generierung der Fragen:", error);
    throw new Error("Die Fragen konnten nicht geladen werden. Bitte versuchen Sie es später erneut.");
  }
}

export async function evaluateAnswers(userData: UserData, answers: Answer[]): Promise<string> {
  const formattedAnswers = answers.map(a => `F: ${a.question}\nA: ${a.answer}`).join('\n\n');

  const prompt = `
    Agiere als erfahrener Dermatologe und Allergologe. Du erhältst die vorläufigen Daten und die Antworten aus einem Anamnesebogen.
    Basierend auf diesen Informationen, erstelle eine kurze, vorläufige Auswertung über die Wahrscheinlichkeit einer allergischen Erkrankung.

    Patientendaten:
    - Alter: ${userData.age}
    - Geschlecht: ${userData.gender}

    Fragen und Antworten:
    ${formattedAnswers}

    Strukturiere deine Antwort bitte in Markdown mit den folgenden Abschnitten:
    - **Zusammenfassung:** Eine kurze Zusammenfassung der Symptome und möglichen Hinweise.
    - **Mögliche Hinweise auf eine Allergie:** Bewerte die Wahrscheinlichkeit und nenne die Hauptgründe basierend auf den Antworten.
    - **Empfehlungen:** Gib Ratschläge für die nächsten Schritte (z.B. Führen eines Symptomtagebuchs, mögliche Tests, die ein Arzt durchführen könnte).
    - **Wichtiger Hinweis:** Füge einen unmissverständlichen Disclaimer hinzu.

    Der Disclaimer am Ende MUSS exakt wie folgt lauten und den letzten Teil der Antwort bilden:
    "**WICHTIGER HINWEIS:** Diese Auswertung wurde von einer künstlichen Intelligenz erstellt und dient nur zu Informationszwecken. Sie stellt keine medizinische Diagnose dar und ersetzt keinesfalls die Beratung, Diagnose oder Behandlung durch einen qualifizierten Arzt oder Allergologen. Bei gesundheitlichen Beschwerden wenden Sie sich bitte umgehend an einen Arzt."
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Fehler bei der Auswertung der Antworten:", error);
    throw new Error("Die Auswertung konnte nicht erstellt werden. Bitte versuchen Sie es später erneut.");
  }
}
