import { PrismaClient, QuestionType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
	await prisma.option.deleteMany();
	await prisma.question.deleteMany();
	await prisma.quiz.deleteMany();

	await prisma.quiz.create({
		data: {
			title: 'General Knowledge',
			questions: {
				create: [
					{
						type: QuestionType.BOOLEAN,
						prompt: 'Is the Earth round?',
						options: { create: [{ text: 'True', isCorrect: true }, { text: 'False', isCorrect: false }] },
					},
					{
						type: QuestionType.INPUT,
						prompt: 'What is the capital of France?',
					},
					{
						type: QuestionType.CHECKBOX,
						prompt: 'What is the capital of Great Britain?',
						options: {
							create: [
								{ text: 'London', isCorrect: true },
								{ text: 'New York', isCorrect: false },
								{ text: 'Paris', isCorrect: false },
								{ text: 'Manchester', isCorrect: false },
							],
						},
					},
				],
			},
		},
	});

	await prisma.quiz.create({
		data: {
			title: 'Tech Basics',
			questions: {
				create: [
					{
						type: QuestionType.BOOLEAN,
						prompt: 'JavaScript runs in the browser',
						options: { create: [{ text: 'True', isCorrect: true }, { text: 'False', isCorrect: false }] },
					},
					{
						type: QuestionType.INPUT,
						prompt: 'What does CSS stand for?',
					},
				],
			},
		},
	});

	console.log('Seed completed');
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});

