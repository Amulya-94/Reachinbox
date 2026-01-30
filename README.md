# ReachInbox Email Scheduler

A production-grade email scheduler service built with Express, BullMQ, Redis, PostgreSQL, Next.js, and TypeScript.

## 🚀 Features

- **Reliable Scheduling**: Uses BullMQ + Redis for persistent job scheduling (No Cron).
- **Concurrency & Rate Limiting**: Handles high throughput with configurable workers and rate limits (e.g., 50 emails/hour).
- **Persistence**: Survives server restarts without losing jobs.
- **Modern Frontend**: Next.js + Tailwind CSS dashboard matching Figma designs.
- **Ethereal Email**: Integration for testing email delivery.
- **Google OAuth**: Passport.js authentication flow.

## 🛠 Tech Stack

- **Backend**: Node.js, Express, TypeScript, BullMQ, Redis, PostgreSQL (Prisma).
- **Frontend**: Next.js (App Router), TypeScript, Tailwind CSS, Lucide Icons.
- **DevOps**: Docker Compose for Redis and PostgreSQL.

## 📦 Prerequisites

- Node.js (v18+)
- Docker & Docker Compose
- Google OAuth Credentials (for Login)

## 🏃‍♂️ Getting Started

### 1. Database & Redis Setup

Start the infrastructure using Docker:

```bash
docker-compose up -d
```

This starts:
- Redis on port `6380`
- PostgreSQL on port `5433`

### 2. Backend Setup

 Navigate to `apps/server`:

```bash
cd apps/server
npm install
```

Create a `.env` file (or use the one provided):

```env
DATABASE_URL="postgresql://postgres:password@localhost:5433/reachbox?schema=public"
REDIS_HOST="localhost"
REDIS_PORT=6380
PORT=3001
GOOGLE_CLIENT_ID="your_client_id"
GOOGLE_CLIENT_SECRET="your_client_secret"
SESSION_SECRET="supersecret"
ETHEREAL_USER=""
ETHEREAL_PASS=""
```

Initialize Database:

```bash
npx prisma db push
npx prisma generate
```

Start Development Server:

```bash
npm run dev
```

### 3. Frontend Setup

Navigate to `apps/web`:

```bash
cd apps/web
npm install
npm run dev
```

Visit `http://localhost:3000` to access the application.

## 📐 Architecture

- **Scheduling**: When a user schedules an email, the backend calculates the delay and adds a job to the `email-queue` in BullMQ.
- **Persistence**: Redis persists the job data. If the server crashes, BullMQ picks up where it left off upon restart.
- **Rate Limiting**: The Worker is configured with a `limiter` (e.g., 50 per hour). Jobs exceeding this are automatically delayed by BullMQ.
- **Concurrency**: The worker processes jobs in parallel up to the defined concurrency limit.

## 🧪 Testing

1. **Login**: Use the "Sign in with Google" button (requires valid creds or mock logic).
2. **Compose**: Upload a `.txt` file with emails or type them in. Set a time.
3. **Verify**: Check the "Scheduled" tab. Wait for the time (or send immediately).
4. **Result**: Check "Sent" tab and console logs for Ethereal URL.

## 📝 Assignments Completed

- [x] Backend: Express + TS + BullMQ
- [x] Database: PostgreSQL + Prisma
- [x] Scheduler: Redis Delayed Jobs (No Cron)
- [x] Rate Limiting: Configurable per hour
- [x] Frontend: Next.js + Tailwind (Figma Match)
- [x] Login: Google OAuth Support

## ⚖️ Trade-offs & Assumptions

- **Rich Text Editor**: Used a standard text area instead of a full WYSIWYG editor to focus on backend robustness and scheduling logic within the time limit.
- **Email Input**: Implemented file upload (`.txt`/`.csv`) handling for bulk recipients as per requirements, rather than a manual "chip" input system, for better performance with large lists.
- **Ethereal Auth**: Implemented auto-generation of test credentials to ensure the app works immediately upon cloning without manual env setup.

## ✅ Requirements Checklist

| Requirement | Status | Implementation Details |
|-------------|--------|------------------------|
| **No Cron Jobs** | ✅ | Used BullMQ delayed jobs mechanism. |
| **Persistence** | ✅ | Redis stores job state; survives restarts. |
| **Concurrency** | ✅ | Worker configured with `concurrency: 5`. |
| **Rate Limiting** | ✅ | Implemented `hourlyLimit` logic in backend to stagger jobs. |
| **Google Login** | ✅ | Passport.js + Mock Fallback for easy testing. |
| **Bulk Schedule**| ✅ | Parses input files and schedules individual jobs. |
