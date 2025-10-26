
import React, { useState } from 'react';
import type { Question, Answer } from '../types';

interface QuestionnaireProps {
  questions: Question[];
  onComplete: (answers: Answer[]) => void;
}

export const Questionnaire: React.FC<QuestionnaireProps> = ({ questions, onComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleAnswer = (answer: string) => {
    setSelectedOption(answer);
    const newAnswer: Answer = {
      question: questions[currentQuestionIndex].questionText,
      answer: answer,
    };
    
    setTimeout(() => {
        const updatedAnswers = [...answers, newAnswer];
        setAnswers(updatedAnswers);
        setSelectedOption(null);
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            onComplete(updatedAnswers);
        }
    }, 300); // Short delay for visual feedback
  };

  const progress = ((currentQuestionIndex) / questions.length) * 100;
  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="w-full max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
      <div className="mb-6">
        <p className="text-sky-600 font-semibold text-sm mb-2">Frage {currentQuestionIndex + 1} von {questions.length}</p>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div className="bg-sky-500 h-2.5 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
        </div>
      </div>

      <h2 className="text-2xl font-semibold text-gray-800 mb-8 min-h-[6rem]">{currentQuestion.questionText}</h2>

      <div className="space-y-4">
        {currentQuestion.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleAnswer(option)}
            className={`w-full text-left p-4 border-2 rounded-lg text-gray-700 font-medium transition-all duration-200
              ${selectedOption === option 
                ? 'bg-sky-500 border-sky-500 text-white transform scale-105 shadow-md' 
                : 'bg-white border-gray-300 hover:bg-sky-50 hover:border-sky-400'}
            `}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};
