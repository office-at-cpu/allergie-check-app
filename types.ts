export type AppStep = 'welcome' | 'questionnaire' | 'evaluating' | 'results' | 'error';

export interface UserData {
  age: number;
  gender: 'Männlich' | 'Weiblich' | 'Divers';
}

export interface Question {
  questionText: string;
  options: string[];
}

export interface Answer {
  question: string;
  answer: string;
}