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
├── README.md
├── Workshop-1
│   ├── Workshop-1.pdf
│   └── User Story Mapping.pdf
└── Final-Project
    └── ... (Nextjs file structure)

---

## **Database**

The database architecture for Talk2 integrates three main components: **Stream**, **Clerk**, and the project's own PostgreSQL schema. Stream provides all structures related to real-time communication, including users, channels, mutes, blocked relationships, calls, and recordings—enabling features such as messaging, presence, and audio/video conferencing.

Clerk supplies the authentication layer, storing user identities, profile information, and email addresses. Finally, the custom PostgreSQL tables (such as `FriendRequest`) manage application-specific logic and interactions between users. Together, these systems form a unified data model where authentication (Clerk), communication (Stream), and internal application data (PostgreSQL) work cohesively to support the full functionality of the platform.

---

## **Deployment on Docker**

This project is fully containerized using Docker and Docker Compose. It consists of two main services:
* **Web:** A Next.js application that includes both the frontend and backend, , integrating **Stream** and **ClearK**.
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

