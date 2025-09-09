"use client";
import useSWR from 'swr';
import api from '@/services/api';

type QuizListItem = { id: number; title: string; questionCount: number };

const fetcher = async (url: string) => {
  const res = await api.get<QuizListItem[]>(url);
  return res.data;
};

export default function QuizzesPage() {
  const { data, error, mutate, isLoading } = useSWR('/quizzes', fetcher);

  const remove = async (id: number) => {
    await api.delete(`/quizzes/${id}`);
    mutate();
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Failed to load</p>;

  return (
    <div>
      <h1>Quizzes</h1>
      <ul style={{ display: 'grid', gap: 8, padding: 0, listStyle: 'none' }}>
        {(data || []).map((q) => (
          <li key={q.id} style={{ border: '1px solid #ddd', padding: 12, borderRadius: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <a href={`/quizzes/${q.id}`}>{q.title} ({q.questionCount})</a>
            <button onClick={() => remove(q.id)} aria-label={`Delete ${q.title}`}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}


