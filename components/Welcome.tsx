import React, { useState } from 'react';
import type { UserData } from '../types';

interface WelcomeProps {
  onStart: (userData: UserData) => void;
}

export const Welcome: React.FC<WelcomeProps> = ({ onStart }) => {
  const [age, setAge] = useState<string>('');
  const [gender, setGender] = useState<UserData['gender'] | ''>('');
  const [consent, setConsent] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ageNum = parseInt(age, 10);
    if (!ageNum || ageNum <= 0 || ageNum > 120) {
      setError('Bitte geben Sie ein gültiges Alter ein.');
      return;
    }
    if (!gender) {
      setError('Bitte wählen Sie ein Geschlecht aus.');
      return;
    }
    if (!consent) {
      setError('Bitte stimmen Sie der Datenverarbeitung zu, um fortzufahren.');
      return;
    }
    setError('');
    onStart({ age: ageNum, gender });
  };

  return (
    <div className="w-full max-w-lg mx-auto bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
      <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">Willkommen beim Allergie-Check</h1>
      <p className="text-center text-gray-600 mb-8">
        Beantworten Sie einige Fragen, um eine KI-basierte Voreinschätzung zu erhalten.
      </p>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">Alter</label>
          <input
            id="age"
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
            placeholder="z.B. 34"
          />
        </div>
        <div>
          <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">Geschlecht</label>
          <select
            id="gender"
            value={gender}
            onChange={(e) => setGender(e.target.value as UserData['gender'])}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition bg-white text-gray-800"
          >
            <option value="" disabled>Bitte auswählen</option>
            <option value="Männlich">Männlich</option>
            <option value="Weiblich">Weiblich</option>
            <option value="Divers">Divers</option>
          </select>
        </div>

        <div className="space-y-4 pt-4 border-t border-gray-200">
            <div className="text-xs text-gray-600 bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-2">
                 <p className="font-semibold text-gray-800">Einwilligung in die Verarbeitung meiner personenbezogenen Daten.</p>
                 <p>Ich willige ausdrücklich ein, dass meine angegebenen Daten (einschließlich Gesundheitsdaten) zur Durchführung des Allergie-Checks verarbeitet werden. Die Auswertung erfolgt automatisiert durch eine künstliche Intelligenz und dient ausschließlich zu Informationszwecken. Es erfolgt keine ärztliche Prüfung oder Diagnose. Meine Daten werden nur temporär verarbeitet und werden ausschließlich zur Bereitstellung der Auswertung verwendet und sofern technisch möglich nicht dauerhaft gespeichert, oder an Dritte weitergegeben. Ich kann die Nutzung jederzeit abbrechen. Eine Identifikation meiner Person ist nicht möglich!</p>
            </div>
            <div className="flex items-start space-x-3 pt-2">
                <input
                    id="consent-checkbox"
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    className="h-4 w-4 text-sky-600 focus:ring-sky-500 border-gray-300 rounded mt-1 flex-shrink-0"
                />
                <label htmlFor="consent-checkbox" className="text-sm text-gray-700">
                   Ich habe die <a href="https://www.hautarzt-schaetz-krems.at/datenschutz/" target="_blank" rel="noopener noreferrer" className="text-sky-600 hover:underline">Datenschutzerklärung</a> gelesen und stimme der anonymen Verarbeitung meiner Daten zu.
                </label>
            </div>
        </div>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        <button
          type="submit"
          disabled={!consent}
          className="w-full bg-sky-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-transform transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none"
        >
          Anamnese starten
        </button>
      </form>
       <p className="text-xs text-gray-500 mt-6 text-center">
        Dieser Check ersetzt keine ärztliche Beratung.
      </p>
    </div>
  );
};