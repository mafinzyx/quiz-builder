import express, { Request, Response } from 'express';
import cors from 'cors';
import 'dotenv/config';
import { PrismaClient, QuestionType } from '@prisma/client';


const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (_req: Request, res: Response) => {
  res.json({ ok: true });
});

// Root
app.get('/', (_req: Request, res: Response) => {
  res.json({
    message: 'Quiz Builder API',
    endpoints: ['/health', '/quizzes', '/quizzes/:id'],
  });
});

// Create a new quiz
app.post('/quizzes', async (req: Request, res: Response) => {
  try {
    const { title, questions } = req.body as {
      title: string;
      questions: Array<{
        type: QuestionType | 'BOOLEAN' | 'INPUT' | 'CHECKBOX';
        prompt: string;
        options?: Array<{ text: string; isCorrect: boolean }>;
      }>;
    };

    if (!title || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ error: 'Title and at least one question are required.' });
    }

    const created = await prisma.quiz.create({
      data: {
        title,
        questions: {
          create: questions.map((q) => ({
            type: q.type as QuestionType,
            prompt: q.prompt,
            options: q.options && q.options.length > 0 ? { create: q.options } : undefined,
          })),
        },
      },
      include: { questions: { include: { options: true } } },
    });

    res.status(201).json(created);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create quiz' });
  }
});

// List all quizzes (title and number of questions)
app.get('/quizzes', async (_req: Request, res: Response) => {
  try {
    const quizzes = await prisma.quiz.findMany({
      include: { _count: { select: { questions: true } } },
      orderBy: { createdAt: 'desc' },
    });

    const result = quizzes.map((q) => ({ id: q.id, title: q.title, questionCount: (q as any)._count.questions }));
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch quizzes' });
  }
});

// Get quiz by id with all questions
app.get('/quizzes/:id', async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) return res.status(400).json({ error: 'Invalid id' });

    const quiz = await prisma.quiz.findUnique({
      where: { id },
      include: { questions: { include: { options: true } } },
    });
    if (!quiz) return res.status(404).json({ error: 'Not found' });

    res.json(quiz);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch quiz' });
  }
});

// Delete quiz by id
app.delete('/quizzes/:id', async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) return res.status(400).json({ error: 'Invalid id' });

    await prisma.quiz.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete quiz' });
  }
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
});


