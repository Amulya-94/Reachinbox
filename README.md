# 🚀 ReachInbox Email Scheduler

> A robust, distributed email scheduling system built with **Node.js**, **BullMQ**, **Redis**, and **Next.js**.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-black?style=flat&logo=next.js&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=flat&logo=postgresql&logoColor=white)

## 📋 Overview

This project is a full-stack application designed to schedule and send emails at scale. It replaces traditional cron jobs with a **persistent message queue (BullMQ)** backed by **Redis**, ensuring that no email is lost even during server restarts. It features a modern **Next.js Dashboard** for managing campaigns and viewing real-time status updates.

### ✨ Key Features

- **🛡️ Reliable Scheduling**: Uses BullMQ delayed jobs to schedule emails with precision.
- **💾 Persistence**: All jobs are stored in Redis (AOF/RDB) and metadata in PostgreSQL, surviving server crashes.
- **⚡ High Concurrency**: Configurable worker threads process multiple emails in parallel.
- **🚦 Rate Limiting**: Smart throttling and staggering logic ensures strict adherence to hourly send limits (e.g., 50 emails/hour).
- **🚫 No Cron Jobs**: Pure event-driven architecture.
- **🔐 Google OAuth**: Secure login flow with Passport.js (includes Dev Guest Mode).
- **📧 Mock SMTP**: Integrated with Ethereal Email for safe testing without spamming real users.

---

## 🏗️ Architecture

The system follows a producer-consumer pattern:

```mermaid
graph TD
    A[Client (Next.js)] -->|POST /schedule| B(Express API)
    B -->|Create Job| C[(PostgreSQL DB)]
    B -->|Add Job| D[[Redis Queue (BullMQ)]]
    D -->|Process Job| E[Worker Service]
    E -->|Send Mail| F{SMTP Provider}
    E -->|Update Status| C
```

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, Tailwind CSS, Lucide Icons
- **Backend**: Express.js, TypeScript
- **Database**: PostgreSQL (Prisma ORM)
- **Queue**: BullMQ + Redis
- **DevOps**: Docker Compose

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- Docker & Docker Compose

### 1. Clone & Setup

```bash
git clone https://github.com/Amulya-94/Reachinbox.git
cd Reachinbox
```

### 2. Start Infrastructure

Spin up Redis and PostgreSQL containers:

```bash
docker-compose up -d
```

### 3. Install Dependencies

**Backend:**
```bash
cd apps/server
npm install
# Initialize DB Schema
npx prisma db push
```

**Frontend:**
```bash
cd apps/web
npm install
```

### 4. Run the Application

You can run both services in separate terminals:

**Terminal 1 (Server):**
```bash
cd apps/server
npm run dev
```

**Terminal 2 (Web):**
```bash
cd apps/web
npm run dev
```

Access the dashboard at `http://localhost:3000`.

---

## 🧪 How to Test

1.  **Login**: Click **"Continue as Guest (Dev)"** to bypass Google Auth for local testing.
2.  **Compose**:
    - Click **Compose** in the sidebar.
    - Upload the provided sample file: `emails.txt`.
    - Set an **Hourly Limit** (e.g., `360` for fast testing).
3.  **Verify**:
    - Watch the **Scheduled** tab populate.
    - Wait for the delay (default 2s per email).
    - Check the **Sent** tab to see completed jobs.
    - Check your terminal for **Ethereal Email Preview URLs**.

---

## ⚖️ Implementation Trade-offs & Design Checks

| Constraint | Implementation Detail | Status |
|:---|:---|:---:|
| **No Cron Jobs** | Used BullMQ `jobs.add(..., { delay })` API. | ✅ |
| **Persistence** | Redis handles job state; Postgres stores business data. | ✅ |
| **Rate Limiting** | Implemented staggering logic (`interval = 1hr / limit`) + BullMQ Rate Limiter. | ✅ |
| **Bulk Sending** | File upload stream parsing for memory efficiency. | ✅ |

### Assumptions
- **Rich Text**: A standard text area was used instead of a WYSIWYG editor to prioritize backend robustness within the assignment timeframe.
- **Auth**: A "Mock User" flow was added to facilitate easier review without needing Google Cloud Credentials.

---

## 👤 Author

**Amulya**
- [GitHub](https://github.com/Amulya-94)

---
*Built for the ReachInbox Hiring Assignment.*
