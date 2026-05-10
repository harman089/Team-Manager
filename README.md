# Fullstack Task Manager (MERN) - Team Task Management Platform

A comprehensive team task management platform built with **MERN stack** (MongoDB, Express, React, Node.js) featuring role-based access control, project management, and real-time task tracking.

## 🎯 Overview

The Cloud-Based Task Manager is a web application designed to streamline team task management and collaboration. It provides a centralized platform for task assignment, tracking, and team coordination with an intuitive interface for both administrators and team members.

## 🚀 Key Features

### ✅ Authentication & Authorization
- User registration with email validation
- Secure login with JWT tokens
- Password strength indicator
- Role-based access control (Admin/Member)
- Secure password hashing with Bcryptjs

### ✅ Project Management
- Create and manage projects
- Add/remove team members to projects  
- Project-based task organization
- Admin controls for project settings
- Team collaboration on projects

### ✅ Task Management (Admin Features)
- Create tasks with detailed properties
- Assign tasks to single or multiple users
- Set priority levels (High, Medium, Normal, Low)
- Track status (To Do, In Progress, Completed)
- Add and manage subtasks
- Upload task assets/attachments
- Activity logging for all task changes
- Trash/restore/permanently delete tasks

### ✅ Task Management (User Features)
- View assigned tasks
- Update task status
- Add comments and activity notes
- View detailed task information
- Track task progress

### ✅ Team Management
- Add and manage team members
- Activate/deactivate user accounts
- View team profiles
- Manage user roles
- User account control

### ✅ Dashboard & Analytics
- Overview of all tasks
- Task statistics and distribution
- Status tracking (Completed, In Progress, To Do)
- Overdue task identification
- Visual task charts

### ✅ Notifications & Activity
- Real-time task notifications
- Activity tracking for all changes
- Task assignment alerts
- Comment notifications

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **Redux Toolkit** - State management
- **React Router** - Client-side routing
- **React Hook Form** - Form handling & validation
- **Tailwind CSS** - Styling
- **Vite** - Build tool
- **RTK Query** - API data fetching & caching
- **Recharts** - Data visualization
- **Sonner** - Toast notifications

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Bcryptjs** - Password hashing (10 salt rounds)
- **CORS** - Cross-origin support
- **Morgan** - HTTP logging
- **Dotenv** - Environment configuration

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local or MongoDB Atlas cloud)
- Git

## 🏃 Getting Started Locally

### 1. Clone Repository
```bash
git clone <repository-url>
cd taskmanager
```

### 2. Server Setup

```bash
cd server

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env with your configuration:
# - MONGODB_URI: MongoDB connection string
# - JWT_SECRET: Strong secret key for JWT
# - PORT: Server port (default: 5000)
# - NODE_ENV: development or production

# Start development server
npm run dev

# For production
npm start
```

### 3. Client Setup

```bash
cd ../client

# Install dependencies
npm install

# Create environment file
cat > .env << EOF
VITE_API_URL=http://localhost:5000/api
EOF

# Start development server
npm run dev

# Build for production
npm run build
```

### . Access Application
- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- API: http://localhost:5000/api

## 🚀 Deployment on Railway

### Architecture
```
┌─────────────────┐
│   Frontend      │ ──> Railway (Static + SSR)
│   (React App)   │
└─────────────────┘
         ↓ API Calls
┌─────────────────┐
│   Backend       │ ──> Railway (Node.js App)
│   (Express)     │
└─────────────────┘
         ↓ Database
┌─────────────────┐
│   MongoDB       │ ──> MongoDB Atlas Cloud
│   (Database)    │
└─────────────────┘
```

## 📊 Database Schema

### User Model
```javascript
{
  name: String (required),
  title: String (required),
  role: String (required),
  email: String (unique, required),
  password: String (hashed, required),
  isAdmin: Boolean (default: false),
  tasks: [ObjectId refs to Task],
  isActive: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

### Project Model
```javascript
{
  name: String (required),
  description: String,
  admin: ObjectId ref to User,
  members: [ObjectId refs to User],
  tasks: [ObjectId refs to Task],
  isActive: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

### Task Model
```javascript
{
  title: String (required),
  date: Date,
  priority: String (high/medium/normal/low),
  stage: String (todo/in progress/completed),
  project: ObjectId ref to Project,
  team: [ObjectId refs to User],
  subTasks: [{title, date, tag}],
  assets: [String URLs],
  activities: [{type, activity, date, by}],
  isTrashed: Boolean (default: false),
  createdAt: Date,
  updatedAt: Date
}
```

## 🔐 Security Features

- **Password Security**: Hashed with bcryptjs (10 salt rounds)
- **JWT Authentication**: Secure token-based auth with HTTPOnly cookies
- **Input Validation**: Both client-side and server-side validation
- **XSS Prevention**: Input sanitization
- **CORS Protection**: Configurable CORS headers
- **Role-Based Access**: Middleware enforced access control
- **Secure Cookies**: HTTPOnly, Secure, SameSite flags

## 🧪 API Endpoints

### Authentication
```
POST   /api/user/register          - Register new user
POST   /api/user/login             - User login
POST   /api/user/logout            - User logout
```

### Projects
```
POST   /api/project/create         - Create new project
GET    /api/project/               - Get user's projects
GET    /api/project/:id            - Get project details
PUT    /api/project/:id            - Update project
DELETE /api/project/:id            - Delete project
POST   /api/project/:id/add-member    - Add team member
POST   /api/project/:id/remove-member - Remove team member
```

### Tasks
```
POST   /api/task/create            - Create task
GET    /api/task/                  - Get all tasks
GET    /api/task/:id               - Get task details
PUT    /api/task/:id               - Update task
DELETE /api/task/:id               - Delete task
```

### Users
```
GET    /api/user/get-team          - Get team members
GET    /api/user/notifications     - Get notifications
PUT    /api/user/profile           - Update profile
PUT    /api/user/change-password   - Change password
PUT    /api/user/read-noti         - Mark notification read
```

## 👥 User Roles

### Admin
- Create and manage projects
- Add/remove team members
- Create and assign tasks
- Manage users (activate/deactivate)
- Delete tasks permanently
- View analytics

### Member
- View assigned tasks
- Update task status
- Add comments
- View projects
- Collaborate with team

## 🎮 Usage Guide

### Creating a Project
1. Navigate to Projects page
2. Click "+ New Project"
3. Enter project name and description
4. Click "Create"

### Adding Team Members to Project
1. Open project
2. Click "+ Add Member"
3. Select team members
4. Click "Add Members"

### Creating a Task
1. Go to Tasks page
2. Click "Add Task"
3. Fill in:
   - Task title (required)
   - Priority level
   - Due date
   - Assign to team member
   - Add to project
4. Click "Create Task"

### Tracking Progress
1. View Dashboard for overview
2. Check task statuses
3. View activity logs
4. Monitor overdue tasks



## 📱 Responsive Design

- Mobile-first approach
- Breakpoints: xs, sm, md, lg, xl
- Sidebar collapses on mobile
- Touch-friendly buttons
- Optimized for all screen sizes

## ⚡ Performance Optimization

- Code splitting with React.lazy()
- Image optimization
- API response caching with RTK Query
- Lazy loading of routes
- Minified CSS/JS in production
- Compression with gzip

## 📦 Project Structure

```
taskmanager/
├── server/
│   ├── controllers/          # Business logic
│   ├── models/              # Database schemas
│   ├── routes/              # API endpoints
│   ├── middlewares/         # Auth, error handling
│   ├── utils/               # Helpers, validation
│   ├── index.js             # Server entry
│   ├── package.json
│   └── .env.example
├── client/
│   ├── src/
│   │   ├── pages/           # Page components
│   │   ├── components/      # Reusable components
│   │   ├── redux/           # State management
│   │   ├── utils/           # Utilities
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
├── README.md
├── DEVELOPMENT.md
├── Procfile
└── .gitignore
```



## **General Features:**
1. **Authentication and Authorization:**
    - User login with secure authentication.
    - Role-based access control.

2. **Profile Management:**
    - Update user profiles.

3. **Password Management:**
    - Change passwords securely.

4. **Dashboard:**
    - Provide a summary of user activities.
    - Filter tasks into todo, in progress, or completed.




## **Technologies Used:**
- **Frontend:**
    - React (Vite)
    - Redux Toolkit for State Management
    - Headless UI
    - Tailwind CSS


- **Backend:**
    - Node.js with Express.js
    
- **Database:**
    - MongoDB for efficient and scalable data storage.


The Cloud-Based Task Manager is an innovative solution that brings efficiency and organization to task management within teams. By harnessing the power of the MERN stack and modern frontend technologies, the platform provides a seamless experience for both administrators and users, fostering collaboration and productivity.

&nbsp;

## SETUP INSTRUCTIONS


# Server Setup

## Environment variables
First, create the environment variables file `.env` in the server folder. The `.env` file contains the following environment variables:

- MONGODB_URI = `your MongoDB URL`
- JWT_SECRET = `any secret key - must be secured`
- PORT = `8800` or any port number
- NODE_ENV = `development`


&nbsp;


