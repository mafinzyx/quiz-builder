import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000',
});

export default api;

export type QuestionType = 'BOOLEAN' | 'INPUT' | 'CHECKBOX';

export interface CreateQuizPayload {
  title: string;
  questions: Array<{
    type: QuestionType;
    prompt: string;
    options?: Array<{ text: string; isCorrect: boolean }>;
  }>;
}

