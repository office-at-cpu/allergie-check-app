import React, { useState, useEffect } from 'react';

const TOTAL_QUESTIONS = 20;
const SIMULATION_DURATION_MS = 8000; // 8 seconds for the whole simulation

const GeneratingQuestions: React.FC = () => {
  const [progressCount, setProgressCount] = useState(0);

  useEffect(() => {
    setProgressCount(1); // Start immediately at 1
    const interval = setInterval(() => {
      setProgressCount(prevCount => {
        if (prevCount < TOTAL_QUESTIONS) {
          return prevCount + 1;
        }
        clearInterval(interval);
        return prevCount;
      });
    }, SIMULATION_DURATION_MS / TOTAL_QUESTIONS);

    return () => clearInterval(interval);
  }, []);

  const progressPercentage = (progressCount / TOTAL_QUESTIONS) * 100;

  return (
    <div className="w-full max-w-lg mx-auto bg-white p-8 rounded-2xl shadow-lg border border-gray-200 text-center">
      <h2 className="text-2xl font-bold text-gray-800 mb-3">Generiere Fragen...</h2>
      <p className="text-sky-600 font-medium mb-6">
        Die KI ist aktiviert. Ihre Fragen werden individuell erstellt. Nach der Erstellung der Fragen benötige ich zirka 15 Sekunden für die grafische Aufbereitung! Einen Moment bitte, ich arbeite, ... !
      </p>
      
      <div className="relative pt-1">
        <div className="flex mb-2 items-center justify-between">
          <div>
            <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-sky-600 bg-sky-200">
              Fortschritt
            </span>
          </div>
          <div className="text-right">
            <span className="text-xs font-semibold inline-block text-sky-600">
              {progressCount}/{TOTAL_QUESTIONS}
            </span>
          </div>
        </div>
        <div className="overflow-hidden h-4 mb-4 text-xs flex rounded bg-sky-100">
          <div style={{ width: `${progressPercentage}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-sky-500 transition-all duration-300"></div>
        </div>
      </div>

      <p className="text-gray-500 text-sm mt-4">
        Frage {progressCount} von {TOTAL_QUESTIONS} wird erstellt...
      </p>

      <div className="flex justify-center items-center space-x-2 mt-6">
        <span className="sr-only">Laden...</span>
        <div className="h-3 w-3 bg-sky-500 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
        <div className="h-3 w-3 bg-sky-500 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
        <div className="h-3 w-3 bg-sky-500 rounded-full animate-pulse"></div>
      </div>
    </div>
  );
};

export default GeneratingQuestions;