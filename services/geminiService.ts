
import type { UserData, Question, Answer } from '../types';

/**
 * Ruft die Vercel Function auf, um Fragen basierend auf den Benutzerdaten zu generieren.
 */
export async function generateQuestions(userData: UserData): Promise<Question[]> {
  try {
    const response = await fetch('/api/generate-questions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Fehler beim Laden der Fragen.');
    }

    return await response.json();
  } catch (error) {
    console.error("Frontend Service Error (generateQuestions):", error);
    throw error;
  }
}

/**
 * Ruft die Vercel Function auf, um die Antworten des Benutzers zu evaluieren.
 */
export async function evaluateAnswers(userData: UserData, answers: Answer[]): Promise<string> {
  try {
    const response = await fetch('/api/evaluate-answers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userData, answers }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Fehler bei der Auswertung.');
    }

    const data = await response.json();
    return data.evaluation;
  } catch (error) {
    console.error("Frontend Service Error (evaluateAnswers):", error);
    throw error;
  }
}
