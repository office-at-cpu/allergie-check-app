import React, { useState, useCallback, useEffect } from 'react';
import type { AppStep, UserData, Question, Answer } from './types';
import { generateQuestions, evaluateAnswers } from './services/geminiService';
import { Welcome } from './components/Welcome';
import { Questionnaire } from './components/Questionnaire';
import { EmailForm } from './components/EmailForm';
import { Results } from './components/Results';
import LoadingSpinner from './components/LoadingSpinner';

const App: React.FC = () => {
  const [step, setStep] = useState<AppStep>('welcome');
  const [userData, setUserData] = useState<UserData | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [email, setEmail] = useState<string>('');
  const [evaluation, setEvaluation] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleStart = useCallback(async (data: UserData) => {
    setUserData(data);
    setStep('evaluating'); // Use evaluating as a generic loading step
    setError(null);
    try {
      const fetchedQuestions = await generateQuestions(data);
      if (fetchedQuestions && fetchedQuestions.length > 0) {
        setQuestions(fetchedQuestions);
        setStep('questionnaire');
      } else {
        throw new Error("Keine Fragen erhalten.");
      }
    } catch (e) {
      const err = e as Error;
      setError(err.message);
      setStep('error');
    }
  }, []);

  const handleQuestionnaireComplete = useCallback((completedAnswers: Answer[]) => {
    setAnswers(completedAnswers);
    setStep('email');
  }, []);

  const handleEmailSubmit = useCallback(async (userEmail: string) => {
    if (!userData || answers.length === 0) {
        setError("Benutzerdaten oder Antworten fehlen.");
        setStep('error');
        return;
    }
    setEmail(userEmail);
    setStep('evaluating');
    setError(null);
    try {
      const result = await evaluateAnswers(userData, answers);
      setEvaluation(result);

      // Send a copy of the user's email to the business email address.
      // In a real-world application, this would be a secure API call to a backend
      // service that handles sending emails.
      try {
        // This is a placeholder for the actual API endpoint.
        await fetch('https://dermashop.at/api/collect-lead', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: userEmail,
            source: 'Allergie-Check Anamnese',
          }),
        });
      } catch (leadError) {
        // This is an internal process, so it should not block the user experience.
        // Log the error for monitoring purposes.
        console.warn("Failed to submit lead to internal address:", leadError);
      }

      setStep('results');
    } catch (e) {
       const err = e as Error;
       setError(err.message);
       setStep('error');
    }
  }, [userData, answers]);

  const handleRestart = () => {
    setStep('welcome');
    setUserData(null);
    setQuestions([]);
    setAnswers([]);
    setEmail('');
    setEvaluation('');
    setError(null);
  };

  const renderContent = () => {
    switch (step) {
      case 'welcome':
        return <Welcome onStart={handleStart} />;
      case 'questionnaire':
        return <Questionnaire questions={questions} onComplete={handleQuestionnaireComplete} />;
      case 'email':
        return <EmailForm onSubmit={handleEmailSubmit} />;
      case 'evaluating':
        const loadingText = questions.length === 0 ? "Generiere Fragen..." : "Erstelle Auswertung...";
        return <div className="w-full max-w-lg mx-auto bg-white p-8 rounded-2xl shadow-lg border border-gray-200"><LoadingSpinner text={loadingText} /></div>;
      case 'results':
        return <Results evaluation={evaluation} email={email} onRestart={handleRestart} />;
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
