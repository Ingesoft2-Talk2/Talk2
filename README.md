## **Group Repository - Software Engineering 2 - 2025-2**  
This repository contains the information, assignments, documentation, and development of the **Software Engineering 2** course. It is structured to facilitate the organization, collaboration, and tracking of content and deliverables throughout the semester. 

---

## **Members**
* Alejandro Argüello Muñoz
* Juan Sebastián Umaña Camacho
* Juan Luis Vergara Novoa
* Tomás Felipe Garzón Gómez
* Tomás Sebastián Vallejo Fonseca
* Juan Diego Velasquez Pinzon

---

## **Project: Talk2**
A web-based video conferencing platform that enables users to create, join, and manage meetings with real-time audio, video, chat, and screen sharing, while ensuring secure communication, intuitive usability, and role-based controls for hosts, participants, and administrators.

---

## **Technologies used**
* **Framework fullstack:** Next.js
* **Frontend:** React, TypeScript, Tailwind
* **Backend:** Node.js, Prisma ORM
* **Database:** PostgreSQL
* **Authentication:** OAuth2 (Google)
* **Testing:** Cypress
* **Deployment:** Vercel

---

## **Repository Structure**

```plaintext
.
├── README.md                          # Main repository documentation
│
├── Workshop-1/                        # User Story Mapping & Requirements
│   ├── Workshop-1.pdf
│   └── User Story Mapping.pdf
└── Final-Project
    └── ... (Nextjs file structure)
│
├── Workshop-2/                        # Architecture & Design
│   ├── Workshop-2.pdf
│   ├── Architecture Diagram.pdf
│   ├── Business Model Processes.jpg
│   ├── CRC cards.png
│   ├── Mockups.pdf
│   ├── Relational Database Model.pdf
│   └── UML Class Diagram.png
│
├── Workshop-3/                        # Database Implementation
│   ├── Workshop No. 3.pdf
│   ├── README.md                      # Database schema documentation
│   └── DBmodel.pdf
│
└── Final-Project/                     # Main Application (Next.js)
    ├── src/
    │   ├── app/                       # Next.js App Router
    │   │   ├── (clerk)/              # Clerk authentication pages
    │   │   ├── (root)/               # Main application pages
    │   │   ├── api/                  # API routes
    │   │   │   ├── call/            # Call management endpoints
    │   │   │   ├── friend-request/  # Friend request CRUD
    │   │   │   ├── friends/         # Friends list endpoints
    │   │   │   ├── recording/       # Recording management
    │   │   │   └── users/           # User search & management
    │   │   ├── layout.tsx
    │   │   ├── page.tsx
    │   │   └── globals.css
    │   │
    │   ├── components/               # React components
    │   │   ├── dashboard/           # Dashboard UI components
    │   │   ├── friends/             # Friend management components
    │   │   ├── landing-page/        # Landing page components
    │   │   ├── meeting/             # Video meeting components
    │   │   ├── notifications/       # Notification components
    │   │   └── shared/              # Reusable shared components
    │   │
    │   ├── hooks/                   # Custom React hooks
    │   ├── lib/                     # Libraries & configurations
    │   ├── providers/               # React context providers
    │   ├── types/                   # TypeScript type definitions
    │   ├── utils/                   # Utility functions
    │   └── middleware.ts            # Next.js middleware
    │
    ├── actions/                     # Server actions
    ├── prisma/                      # Database ORM
    │   ├── schema.prisma           # Database schema (Friend Requests)
    │   ├── migrations/             # Database migrations
    │   └── seed.ts                 # Database seeding script
    │
    ├── cypress/                     # E2E Testing
    │   ├── e2e/
    │   │   └── backend/
    │   │       └── friend-request/ # Friend request API tests
    │   ├── fixtures/
    │   ├── support/
    │   └── utils/
    │
    ├── package.json
    ├── next.config.ts
    ├── tailwind.config.ts
    ├── tsconfig.json
    ├── cypress.config.ts
    └── .env                        # Environment variables
```
---


## **Deployment on Docker**

This project is fully containerized using Docker and Docker Compose. It consists of two main services:
* **Web:** A Next.js application that includes both the frontend and backend, , integrating **Stream** and **ClerK**.
* **DB:** A PostgreSQL database managed through Prisma.



Prerequisites

Docker Desktop installed and running.

How to Run

Build and Start the Stack
Run the following command in the project root:

docker-compose up --build



Access the Application

Frontend: Open http://localhost:3000


Database Migrations
When running for the first time, the database inside the container will be empty. You need to push your schema:

Open a new terminal and run:

# Run the migration inside the 'web' container
docker-compose exec web npx prisma migrate deploy

# (Optional) Seed the database
docker-compose exec web npx tsx prisma/seed.ts

* **To stop it**
Run the following command

docker-compose down

* **To clean the container**
Run the following command

docker system prune -f



Environment Configuration

The docker-compose.yml file handles the environment connection between the app and the database automatically using the service name db.



## **Setup and Usage**

This section provides step-by-step instructions to set up and run the **Talk2** application locally.

### **Prerequisites**

Before you begin, ensure you have the following installed:

* **Node.js** (v18 or higher)
* **npm** or **yarn** package manager
* **PostgreSQL** database (for Friend Requests)
* **Git** for version control

### **Installation**

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd Talk2/Final-Project
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```
---

## **Database**

The database architecture for Talk2 integrates three main components: **Stream**, **Clerk**, and the project's own PostgreSQL schema. Stream provides all structures related to real-time communication, including users, channels, mutes, blocked relationships, calls, and recordings—enabling features such as messaging, presence, and audio/video conferencing.

Clerk supplies the authentication layer, storing user identities, profile information, and email addresses. Finally, the custom PostgreSQL tables (such as `FriendRequest`) manage application-specific logic and interactions between users. Together, these systems form a unified data model where authentication (Clerk), communication (Stream), and internal application data (PostgreSQL) work cohesively to support the full functionality of the platform.

---

### **Database Setup**

The application uses **three independent databases**:

1. **Stream Database** - Managed by Stream.io (chat, calls, real-time features)
2. **Clerk Database** - Managed by Clerk (authentication & identity)
3. **PostgreSQL Database** - Self-hosted (Friend Request system)

For the PostgreSQL database, run the following commands:

```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate deploy

# (Optional) Seed the database with test data
npm run prisma:seed
```

> **Database Schema Documentation:** See [Workshop-3/README.md](./Workshop-3/README.md) for detailed database schema documentation.

### **Running the Application**

#### **Development Mode**

Start the development server with hot-reload:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

#### **Production Build**

Build and run the production version:

```bash
npm run build
npm start
```

### **Testing**

The project includes **Cypress** end-to-end tests for the Friend Request API.

#### **Run Cypress Tests**

```bash
# Open Cypress Test Runner (interactive mode)
npx cypress open

# Run tests in headless mode
npx cypress run
```

**Test Coverage:**
- Friend Request CRUD operations (Create, Read, Update, Delete)
- Full integration tests for the Friend Request workflow

### **Code Quality**

The project uses **Biome** for linting and formatting:

```bash
# Check code quality
npm run lint

# Auto-fix issues
npm run lint:fix

# Format code
npm run format
```

### **Project Features**

#### **1. Authentication**
- OAuth2 authentication via Google (powered by Clerk)
- Secure session management
- Protected routes and API endpoints

#### **2. Video Conferencing**
- Create and join video meetings
- Real-time audio/video streaming
- Screen sharing capabilities
- In-meeting chat
- Call recordings

#### **3. Friend System**
- Send/receive friend requests
- Accept/reject friend requests
- View friends list
- Search for users

#### **4. Dashboard**
- View upcoming meetings
- Access previous meetings
- Manage recordings
- Quick meeting creation

### **Deployment**

The application is configured for deployment on **Vercel**:

1. Push your code to a Git repository (GitHub, GitLab, Bitbucket)
2. Import the project in Vercel
3. Configure environment variables in Vercel dashboard
4. Deploy

> **Important:** Ensure your PostgreSQL database is accessible from your deployment environment. Consider using managed PostgreSQL services like:
> - Vercel Postgres
> - Supabase
> - Railway
> - Neon

### **Troubleshooting**

#### **Common Issues**

1. **Database connection errors:**
   - Verify your `PRISMA_DATABASE_URL` is correct
   - Ensure PostgreSQL is running
   - Check database credentials

2. **Authentication issues:**
   - Verify Clerk API keys are correct
   - Check that redirect URLs are properly configured in Clerk dashboard

3. **Video call issues:**
   - Verify Stream API keys are correct
   - Check browser permissions for camera/microphone
   - Ensure HTTPS is enabled (required for WebRTC)


