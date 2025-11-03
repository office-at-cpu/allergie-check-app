import React, { useState, useCallback } from 'react';
import type { AppStep, UserData, Question, Answer } from './types';
import { generateQuestions, evaluateAnswers } from './services/geminiService';
import { Welcome } from './components/Welcome';
import { Questionnaire } from './components/Questionnaire';
import { Results } from './components/Results';
import LoadingSpinner from './components/LoadingSpinner';
import GeneratingQuestions from './components/GeneratingQuestions';

const App: React.FC = () => {
  const [step, setStep] = useState<AppStep>('welcome');
  const [userData, setUserData] = useState<UserData | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [evaluation, setEvaluation] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleStart = useCallback(async (data: UserData) => {
    setUserData(data);
    setStep('evaluating'); // Zeigt den "Generiere Fragen"-Bildschirm
    setError(null);
    try {
      const fetchedQuestions = await generateQuestions(data);
      if (fetchedQuestions && fetchedQuestions.length > 0) {
        setQuestions(fetchedQuestions);
        setStep('questionnaire');
      } else {
        throw new Error("Keine Fragen vom Server erhalten. Versuchen Sie es bitte erneut.");
      }
    } catch (e) {
      const err = e as Error;
      setError(err.message);
      setStep('error');
    }
  }, []);

  const handleQuestionnaireComplete = useCallback(async (completedAnswers: Answer[]) => {
    if (!userData) {
        setError("Benutzerdaten fehlen für die Auswertung.");
        setStep('error');
        return;
    }
    setStep('evaluating'); // Zeigt den "Erstelle Auswertung"-Spinner
    setError(null);
    try {
      const result = await evaluateAnswers(userData, completedAnswers);
      setEvaluation(result);
      setStep('results');
    } catch (e) {
       const err = e as Error;
       setError(err.message);
       setStep('error');
    }
  }, [userData]);
  
  const handleRestart = () => {
    setStep('welcome');
    setUserData(null);
    setQuestions([]);
    setEvaluation('');
    setError(null);
  };

  const renderContent = () => {
    switch (step) {
      case 'welcome':
        return <Welcome onStart={handleStart} />;
      case 'questionnaire':
        // Wir stellen sicher, dass questions existiert, bevor wir die Komponente rendern
        return questions.length > 0 ? <Questionnaire questions={questions} onComplete={handleQuestionnaireComplete} /> : null;
      case 'evaluating':
        // Wenn noch keine Fragen geladen wurden, zeigen wir den "Fragen generieren"-Screen
        // Ansonsten den Ladespinner für die Auswertung
        return questions.length === 0 ? <GeneratingQuestions /> : (
          <div className="w-full max-w-lg mx-auto bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
            <LoadingSpinner text="Erstelle Auswertung..." />
          </div>
        );
      case 'results':
        return <Results evaluation={evaluation} onRestart={handleRestart} />;
      case 'error':
        return (
          <div className="w-full max-w-lg mx-auto bg-white p-8 rounded-2xl shadow-lg border border-red-300 text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Ein Fehler ist aufgetreten</h2>
            <p className="text-gray-700 mb-6">{error || "Ein unbekannter Fehler ist aufgetreten."}</p>
            <button
              onClick={handleRestart}
              className="bg-red-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-red-700"
            >
              Erneut versuchen
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-sky-50 flex flex-col items-center justify-center p-4 font-sans">
        <main className="w-full transition-all duration-300">
            {renderContent()}
        </main>
    </div>
  );
};

export default App;