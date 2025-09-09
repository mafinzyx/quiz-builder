"use client";
import useSWR from 'swr';
import api from '@/services/api';
import { useParams } from 'next/navigation';

type Option = { id: number; text: string; isCorrect: boolean };
type Question = { id: number; type: 'BOOLEAN' | 'INPUT' | 'CHECKBOX'; prompt: string; options: Option[] };
type Quiz = { id: number; title: string; questions: Question[] };

export default function QuizDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const { data, error, isLoading } = useSWR(id ? `/quizzes/${id}` : null, async (url: string) => {
    const res = await api.get<Quiz>(url);
    return res.data;
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Failed to load, make sure that backend is working</p>;
  if (!data) return null;

  return (
    <div>
      <h1>{data.title}</h1>
      <div style={{ display: 'grid', gap: 12 }}>
        {data.questions.map((q) => (
          <div key={q.id} style={{ border: '1px solid #eee', padding: 12, borderRadius: 8 }}>
            <strong>{q.type}</strong>
            <p>{q.prompt}</p>
            <div>
              {q.type === 'BOOLEAN' && (
                <div style={{ display: 'flex', gap: 8 }}>
                  {q.options.map((o) => (
                    <label key={o.id} style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                      <input type="radio" disabled /> {o.text} {o.isCorrect ? '✓' : ''}
                    </label>
                  ))}
                </div>
              )}
              {q.type === 'INPUT' && <input disabled placeholder="Short answer" />}
              {q.type === 'CHECKBOX' && (
                <div style={{ display: 'grid', gap: 6 }}>
                  {q.options.map((o) => (
                    <label key={o.id} style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                      <input type="checkbox" disabled /> {o.text} {o.isCorrect ? '✓' : ''}
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


