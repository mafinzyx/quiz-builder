Quiz Builder

Stack
- Backend: Express + TypeScript + Prisma + SQLite
- Frontend: Next.js + TypeScript

Setup
1) Backend (API)
- cd backend
- Create `.env` with:
  - `DATABASE_URL="file:./dev.db"`
- npm install
- npx prisma generate
- npm run prisma:migrate
- Optional: seed sample data (to check already existed database with some examples)
  - `npx ts-node --transpile-only prisma/seed.ts`
- Start API
  - `npm run dev` → http://localhost:4000

2) Frontend (Next.js)
- cd frontend
- npm install
- npm run dev → http://localhost:3000

Database
- Provider: SQLite (file `backend/prisma/dev.db`)
- Prisma schema: `backend/prisma/schema.prisma`
- Migrations: `backend/prisma/migrations/*`
- Seed script: `backend/prisma/seed.ts` (adds 2 example quizzes)

Create a sample quiz
  - Open http://localhost:3000/create
  - Enter title, add questions (Boolean/Input/Checkbox), submit

Frontend pages
- `/create` – Quiz creation form
- `/quizzes` – List of quizzes
- `/quizzes/[id]` – Quiz detail

Endpoints
- POST /quizzes
- GET /quizzes
- GET /quizzes/:id
- DELETE /quizzes/:id