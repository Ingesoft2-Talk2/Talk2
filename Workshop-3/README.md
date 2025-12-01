## 3. Database Implementation

Our project integrates **three independent databases**, each serving a different purpose inside the app.  
The application connects them through **REST APIs and service SDKs**.

Below is a high-level description of each database and its internal tables.

---

## 3.1 Stream Database (Chat, Calls & Real-Time Features)

**Purpose:**  
Stream powers all **real-time functionality** of the platform, including chat, user presence, moderation, teams, and video calls.

**Main Tables:**

| Table               | Purpose                                                             |
|--------------------|----------------------------------------------------------------------|
| **apps**           | Stores Stream application metadata and configuration settings.       |
| **stream_users**   | Represents users within Stream (roles, online status, mutes, etc.). |
| **user_teams**     | Teams or groups that a user belongs to.                              |
| **blocked_users**  | Users who have blocked each other.                                   |
| **user_mutes**     | User-level chat mutes.                                               |
| **user_channel_mutes** | Channel-level mutes for users.                                 |
| **calls**          | Metadata for video/audio calls.                                      |
| **recordings**     | Stores call recording information.                                   |

---

## 3.2 Clerk Database (Authentication & Identity)

**Purpose:**  
Clerk manages **authentication**, **identity**, and user session data for the platform.

**Main Tables:**

| Table            | Purpose                                             |
|------------------|-----------------------------------------------------|
| **clerk_users**  | Main identity table for users registered via Clerk. |
| **email_addresses** | Email addresses linked to Clerk users.          |


---

## 3.3 PostgreSQL — Friend Request System

**Purpose:**  
Stores the **Friend Request** functionality implemented by our team using Prisma and PostgreSQL.

**Main Table:**

| Table            | Purpose                                                                   |
|------------------|---------------------------------------------------------------------------|
| **FriendRequest** | Stores friend requests with sender, receiver, status, and timestamps.      |



