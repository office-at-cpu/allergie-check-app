import React, { useState } from 'react';

interface EmailFormProps {
  onSubmit: (email: string) => void;
}

export const EmailForm: React.FC<EmailFormProps> = ({ onSubmit }) => {
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState('');

  const validateEmail = (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setError('Bitte geben Sie eine gültige E-Mail-Adresse ein.');
      return;
    }
     if (!consent) {
      setError('Bitte stimmen Sie der Datenverarbeitung zu.');
      return;
    }
    setError('');
    onSubmit(email);
  };

  return (
    <div className="w-full max-w-lg mx-auto bg-white p-8 rounded-2xl shadow-lg border border-gray-200 text-center">
      <h2 className="text-3xl font-bold text-gray-800 mb-4">Fast geschafft!</h2>
      <p className="text-gray-600 mb-8">
        Geben Sie Ihre E-Mail-Adresse ein, um Ihre persönliche, KI-basierte Auswertung zu erhalten.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="sr-only">E-Mail Adresse</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition text-center"
            placeholder="ihre.email@beispiel.com"
          />
        </div>

        <div className="pt-2 text-left">
           <div className="flex items-start space-x-3">
             <input
                id="consent"
                name="consent"
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="h-4 w-4 text-sky-600 focus:ring-sky-500 border-gray-300 rounded mt-1 flex-shrink-0"
              />
              <label htmlFor="consent" className="text-xs text-gray-600">
                Ich stimme der Verarbeitung meiner E-Mail-Adresse und meiner Antworten zur Erstellung und Zusendung der Auswertung zu. Ich nehme zur Kenntnis, dass eine Kopie zur internen Bearbeitung an <span className="font-semibold">member@dermashop.at</span> gesendet wird. Ich habe die <a href="#" className="text-sky-600 hover:underline">Datenschutzerklärung</a> gelesen und akzeptiere sie.
              </label>
           </div>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={!consent}
          className="w-full bg-sky-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-transform transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none"
        >
          Auswertung anfordern
        </button>
      </form>
    </div>
  );
};