import React from 'react';

interface ResultsProps {
  evaluation: string;
  onRestart: () => void;
}

// A simple markdown-to-HTML renderer
const SimpleMarkdown: React.FC<{ text: string }> = ({ text }) => {
  const lines = text.split('\n');
  const elements = lines.map((line, index) => {
    if (line.startsWith('**') && line.endsWith('**')) {
      return <h3 key={index} className="text-xl font-bold text-gray-800 mt-6 mb-2">{line.slice(2, -2)}</h3>;
    }
    if (line.startsWith('* ')) {
      return <li key={index} className="ml-5 list-disc text-gray-700">{line.slice(2)}</li>;
    }
    if (line.startsWith('- ')) {
      return <li key={index} className="ml-5 list-disc text-gray-700">{line.slice(2)}</li>;
    }
    if (line.trim() === '') {
      return <br key={index} />;
    }
    return <p key={index} className="text-gray-700 mb-2 leading-relaxed">{line}</p>;
  });

  return <>{elements}</>;
};

export const Results: React.FC<ResultsProps> = ({ evaluation, onRestart }) => {
  return (
    <div className="w-full max-w-3xl mx-auto bg-white p-8 sm:p-10 rounded-2xl shadow-lg border border-gray-200">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Ihre persönliche Auswertung</h2>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
        <SimpleMarkdown text={evaluation} />
      </div>

      <div className="mt-8 text-center">
        <button
          onClick={onRestart}
          className="bg-gray-700 text-white font-bold py-3 px-6 rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-transform transform hover:scale-105"
        >
          Erneut starten
        </button>
      </div>
    </div>
  );
};