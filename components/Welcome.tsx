import React, { useState } from 'react';
import type { UserData } from '../types';

interface WelcomeProps {
  onStart: (userData: UserData) => void;
}

export const Welcome: React.FC<WelcomeProps> = ({ onStart }) => {
  const [age, setAge] = useState<string>('');
  const [gender, setGender] = useState<UserData['gender'] | ''>('');
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
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        <button
          type="submit"
          className="w-full bg-sky-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-transform transform hover:scale-105"
        >
          Anamnese starten
        </button>
      </form>
       <p className="text-xs text-gray-500 mt-6 text-center">
        Dieser Check ersetzt keine ärztliche Beratung. Ihre Privatsphäre ist uns wichtig. Details finden Sie in unserer <a href="#" className="text-sky-600 hover:underline">Datenschutzerklärung</a>.
      </p>
    </div>
  );
};