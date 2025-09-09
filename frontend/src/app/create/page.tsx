"use client";
import { useState } from 'react';
import api, { CreateQuizPayload, QuestionType } from '@/services/api';

type QuestionDraft = {
  type: QuestionType;
  prompt: string;
  options?: Array<{ text: string; isCorrect: boolean }>;
};

export default function CreateQuizPage() {
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState<QuestionDraft[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const addQuestion = () => {
    setQuestions((prev) => [...prev, { type: 'BOOLEAN', prompt: '', options: [{ text: 'True', isCorrect: true }, { text: 'False', isCorrect: false }] }]);
  };

  const updateQuestion = (index: number, updates: Partial<QuestionDraft>) => {
    setQuestions((prev) => prev.map((q, i) => (i === index ? { ...q, ...updates } : q)));
  };

  const removeQuestion = (index: number) => {
    setQuestions((prev) => prev.filter((_, i) => i !== index));
  };

  const onTypeChange = (index: number, type: QuestionType) => {
    if (type === 'BOOLEAN') {
      updateQuestion(index, { type, options: [{ text: 'True', isCorrect: true }, { text: 'False', isCorrect: false }] });
    } else if (type === 'INPUT') {
      updateQuestion(index, { type, options: [] });
    } else {
      updateQuestion(index, { type, options: [{ text: '', isCorrect: false }] });
    }
  };

  const addOption = (qIndex: number) => {
    setQuestions((prev) => prev.map((q, i) => (i === qIndex ? { ...q, options: [...(q.options || []), { text: '', isCorrect: false }] } : q)));
  };

  const updateOption = (qIndex: number, oIndex: number, text: string) => {
    setQuestions((prev) => prev.map((q, i) => {
      if (i !== qIndex) return q;
      const options = (q.options || []).map((o, j) => (j === oIndex ? { ...o, text } : o));
      return { ...q, options };
    }));
  };

  const toggleCorrect = (qIndex: number, oIndex: number, singleSelect = false) => {
    setQuestions((prev) => prev.map((q, i) => {
      if (i !== qIndex) return q;
      const options = (q.options || []).map((o, j) => {
        if (j !== oIndex) {
          return singleSelect ? { ...o, isCorrect: false } : o;
        }
        return { ...o, isCorrect: !o.isCorrect };
      });
      return { ...q, options };
    }));
  };

  const removeOption = (qIndex: number, oIndex: number) => {
    setQuestions((prev) => prev.map((q, i) => {
      if (i !== qIndex) return q;
      const options = (q.options || []).filter((_, j) => j !== oIndex);
      return { ...q, options };
    }));
  };

  const submit = async () => {
    setSubmitting(true);
    setMessage(null);
    try {
      const payload: CreateQuizPayload = { title, questions };
      const res = await api.post('/quizzes', payload);
      setMessage(`Created quiz #${res.data.id}`);
      setTitle('');
      setQuestions([]);
    } catch (e: any) {
      setMessage(e?.response?.data?.error || 'Failed to create quiz');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h1>Create Quiz</h1>
      {message && <p>{message}</p>}
      <div style={{ display: 'grid', gap: 8 }}>
        <label>
          Title
          <input value={title} onChange={(e) => setTitle(e.target.value)} style={{ display: 'block', width: '100%', padding: 8 }} />
        </label>
        <button onClick={addQuestion}>Add Question</button>
        {questions.map((q, idx) => (
          <div key={idx} style={{ border: '1px solid #ddd', padding: 12, borderRadius: 8 }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <select value={q.type} onChange={(e) => onTypeChange(idx, e.target.value as QuestionType)}>
                <option value="BOOLEAN">Boolean</option>
                <option value="INPUT">Input</option>
                <option value="CHECKBOX">Checkbox</option>
              </select>
              <input placeholder="Question prompt" value={q.prompt} onChange={(e) => updateQuestion(idx, { prompt: e.target.value })} style={{ flex: 1, padding: 8 }} />
              <button onClick={() => removeQuestion(idx)} aria-label="Remove question">Remove</button>
            </div>
            <div style={{ marginTop: 8 }}>
              {q.type === 'BOOLEAN' && (
                <div style={{ display: 'flex', gap: 8 }}>
                  {(q.options || []).map((o, j) => (
                    <label key={j} style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                      <input type="radio" checked={o.isCorrect} onChange={() => toggleCorrect(idx, j, true)} /> {o.text}
                    </label>
                  ))}
                </div>
              )}
              {q.type === 'INPUT' && (
                <p>Short text answer (no options)</p>
              )}
              {q.type === 'CHECKBOX' && (
                <div style={{ display: 'grid', gap: 6 }}>
                  {(q.options || []).map((o, j) => (
                    <div key={j} style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                      <input value={o.text} placeholder={`Option ${j + 1}`} onChange={(e) => updateOption(idx, j, e.target.value)} style={{ flex: 1, padding: 6 }} />
                      <label style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                        <input type="checkbox" checked={o.isCorrect} onChange={() => toggleCorrect(idx, j)} /> Correct
                      </label>
                      <button onClick={() => removeOption(idx, j)}>Remove</button>
                    </div>
                  ))}
                  <button onClick={() => addOption(idx)}>Add Option</button>
                </div>
              )}
            </div>
          </div>
        ))}
        <button onClick={submit} disabled={submitting || !title || questions.length === 0}>
          {submitting ? 'Submitting...' : 'Create Quiz'}
        </button>
      </div>
    </div>
  );
}


