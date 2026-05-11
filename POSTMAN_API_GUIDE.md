# Task Manager API - Postman Testing Guide

## Base URL
```
http://localhost:5000/api
```

## Authentication
Most endpoints require a JWT token in the header:
```
Authorization: Bearer <token>
```

---

## 1. USER ROUTES (`/api/user`)

### 1.1 Register User
**POST** `/user/register`
- **Auth**: Not required
- **Description**: Create a new user account

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "title": "Software Engineer",
  "role": "developer"
}
```

**Success Response (200):**
```json
{
  "status": true,
  "message": "User registered successfully",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "title": "Software Engineer",
    "role": "developer",
    "isAdmin": false,
    "isActive": true,
    "tasks": [],
    "createdAt": "2025-05-11T10:30:00.000Z",
    "updatedAt": "2025-05-11T10:30:00.000Z"
  }
}
```

---

### 1.2 Login User
**POST** `/user/login`
- **Auth**: Not required
- **Description**: Authenticate and get JWT token

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Success Response (200):**
```json
{
  "status": true,
  "message": "Login successful",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "title": "Software Engineer",
    "role": "developer",
    "isAdmin": false,
    "isActive": true,
    "tasks": []
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjUwN2YxZjc3YmNmODZjZDc5OTQzOTAxMSIsImlhdCI6MTYyMzQ1NjAwMH0.abcdefg"
}
```

---

### 1.3 Logout User
**POST** `/user/logout`
- **Auth**: Required (Bearer Token)
- **Description**: Logout user and invalidate token

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:** (empty)
```json
{}
```

**Success Response (200):**
```json
{
  "status": true,
  "message": "Logout successful"
}
```

---

### 1.4 Get Team List
**GET** `/user/get-team`
- **Auth**: Required (Bearer Token)
- **Description**: Get list of all team members

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "status": true,
  "message": "Team retrieved successfully",
  "team": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "title": "Software Engineer",
      "role": "developer",
      "isAdmin": false,
      "isActive": true
    },
    {
      "_id": "507f1f77bcf86cd799439012",
      "name": "Jane Smith",
      "email": "jane@example.com",
      "title": "Project Manager",
      "role": "manager",
      "isAdmin": true,
      "isActive": true
    }
  ]
}
```

---

### 1.5 Get Notifications List
**GET** `/user/notifications`
- **Auth**: Required (Bearer Token)
- **Description**: Get all notifications for the logged-in user

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "status": true,
  "message": "Notifications retrieved successfully",
  "notifications": [
    {
      "_id": "607f1f77bcf86cd799439050",
      "task": "607f1f77bcf86cd799439011",
      "team": [
        "507f1f77bcf86cd799439011",
        "507f1f77bcf86cd799439012"
      ],
      "text": "Task has been assigned to you",
      "task_activity": {
        "type": "assigned",
        "activity": "You have been assigned to a new task"
      },
      "isRead": false,
      "createdAt": "2025-05-11T10:30:00.000Z"
    }
  ]
}
```

---

### 1.6 Update User Profile
**PUT** `/user/profile`
- **Auth**: Required (Bearer Token)
- **Description**: Update user's profile information

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "John Updated",
  "title": "Senior Software Engineer",
  "role": "senior developer"
}
```

**Success Response (200):**
```json
{
  "status": true,
  "message": "User profile updated successfully",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Updated",
    "email": "john@example.com",
    "title": "Senior Software Engineer",
    "role": "senior developer",
    "isAdmin": false,
    "isActive": true,
    "updatedAt": "2025-05-11T10:35:00.000Z"
  }
}
```

---

### 1.7 Change Password
**PUT** `/user/change-password`
- **Auth**: Required (Bearer Token)
- **Description**: Change user password

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "password": "CurrentPassword123!",
  "newPassword": "NewPassword123!"
}
```

**Success Response (200):**
```json
{
  "status": true,
  "message": "Password changed successfully"
}
```

---

### 1.8 Mark Notification as Read
**PUT** `/user/read-noti`
- **Auth**: Required (Bearer Token)
- **Description**: Mark notification(s) as read

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "id": "607f1f77bcf86cd799439050"
}
```

**Success Response (200):**
```json
{
  "status": true,
  "message": "Notification marked as read"
}
```

---

### 1.9 Activate User Profile (Admin Only)
**PUT** `/user/:id`
- **Auth**: Required (Bearer Token + Admin Role)
- **Description**: Activate/Deactivate a user account

**Headers:**
```
Authorization: Bearer <token>
```

**URL Parameters:**
```
:id = 507f1f77bcf86cd799439011
```

**Request Body:**
```json
{
  "isActive": true
}
```

**Success Response (200):**
```json
{
  "status": true,
  "message": "User account updated successfully",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "isActive": true
  }
}
```

---

### 1.10 Delete User Profile (Admin Only)
**DELETE** `/user/:id`
- **Auth**: Required (Bearer Token + Admin Role)
- **Description**: Delete a user account

**Headers:**
```
Authorization: Bearer <token>
```

**URL Parameters:**
```
:id = 507f1f77bcf86cd799439011
```

**Request Body:** (empty)
```json
{}
```

**Success Response (200):**
```json
{
  "status": true,
  "message": "User deleted successfully"
}
```

---

## 2. PROJECT ROUTES (`/api/project`)

### 2.1 Create Project
**POST** `/project/create`
- **Auth**: Required (Bearer Token)
- **Description**: Create a new project

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "E-Commerce Platform",
  "description": "Build a complete e-commerce platform with React and Node.js"
}
```

**Success Response (201):**
```json
{
  "status": true,
  "message": "Project created successfully",
  "project": {
    "_id": "507f1f77bcf86cd799439021",
    "name": "E-Commerce Platform",
    "description": "Build a complete e-commerce platform with React and Node.js",
    "admin": "507f1f77bcf86cd799439011",
    "members": ["507f1f77bcf86cd799439011"],
    "tasks": [],
    "isActive": true,
    "createdAt": "2025-05-11T10:30:00.000Z",
    "updatedAt": "2025-05-11T10:30:00.000Z"
  }
}
```

---

### 2.2 Get All User Projects
**GET** `/project/`
- **Auth**: Required (Bearer Token)
- **Description**: Get all projects for the logged-in user

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "status": true,
  "message": "Projects retrieved successfully",
  "projects": [
    {
      "_id": "507f1f77bcf86cd799439021",
      "name": "E-Commerce Platform",
      "description": "Build a complete e-commerce platform with React and Node.js",
      "admin": {
        "_id": "507f1f77bcf86cd799439011",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "members": [
        {
          "_id": "507f1f77bcf86cd799439011",
          "name": "John Doe",
          "email": "john@example.com",
          "title": "Software Engineer"
        },
        {
          "_id": "507f1f77bcf86cd799439012",
          "name": "Jane Smith",
          "email": "jane@example.com",
          "title": "Project Manager"
        }
      ],
      "tasks": ["607f1f77bcf86cd799439031", "607f1f77bcf86cd799439032"],
      "isActive": true,
      "createdAt": "2025-05-11T10:30:00.000Z"
    }
  ]
}
```

---

### 2.3 Get Project by ID
**GET** `/project/:id`
- **Auth**: Required (Bearer Token)
- **Description**: Get detailed information of a specific project

**Headers:**
```
Authorization: Bearer <token>
```

**URL Parameters:**
```
:id = 507f1f77bcf86cd799439021
```

**Success Response (200):**
```json
{
  "status": true,
  "message": "Project retrieved successfully",
  "project": {
    "_id": "507f1f77bcf86cd799439021",
    "name": "E-Commerce Platform",
    "description": "Build a complete e-commerce platform with React and Node.js",
    "admin": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "title": "Software Engineer"
    },
    "members": [
      {
        "_id": "507f1f77bcf86cd799439011",
        "name": "John Doe",
        "email": "john@example.com"
      },
      {
        "_id": "507f1f77bcf86cd799439012",
        "name": "Jane Smith",
        "email": "jane@example.com"
      }
    ],
    "tasks": [
      {
        "_id": "607f1f77bcf86cd799439031",
        "title": "Setup Database",
        "stage": "in progress",
        "priority": "high"
      }
    ],
    "isActive": true,
    "createdAt": "2025-05-11T10:30:00.000Z"
  }
}
```

---

### 2.4 Update Project
**PUT** `/project/:id`
- **Auth**: Required (Bearer Token)
- **Description**: Update project details

**Headers:**
```
Authorization: Bearer <token>
```

**URL Parameters:**
```
:id = 507f1f77bcf86cd799439021
```

**Request Body:**
```json
{
  "name": "E-Commerce Platform v2",
  "description": "Updated: Build a complete e-commerce platform with React, Node.js and MongoDB"
}
```

**Success Response (200):**
```json
{
  "status": true,
  "message": "Project updated successfully",
  "project": {
    "_id": "507f1f77bcf86cd799439021",
    "name": "E-Commerce Platform v2",
    "description": "Updated: Build a complete e-commerce platform with React, Node.js and MongoDB",
    "admin": "507f1f77bcf86cd799439011",
    "isActive": true,
    "updatedAt": "2025-05-11T10:45:00.000Z"
  }
}
```

---

### 2.5 Add Project Member
**POST** `/project/:id/add-member`
- **Auth**: Required (Bearer Token)
- **Description**: Add a team member to the project

**Headers:**
```
Authorization: Bearer <token>
```

**URL Parameters:**
```
:id = 507f1f77bcf86cd799439021
```

**Request Body:**
```json
{
  "members": ["507f1f77bcf86cd799439012"]
}
```

**Success Response (200):**
```json
{
  "status": true,
  "message": "Member added to project successfully",
  "project": {
    "_id": "507f1f77bcf86cd799439021",
    "name": "E-Commerce Platform",
    "members": [
      "507f1f77bcf86cd799439011",
      "507f1f77bcf86cd799439012",
      "507f1f77bcf86cd799439013"
    ]
  }
}
```

---

### 2.6 Remove Project Member
**POST** `/project/:id/remove-member`
- **Auth**: Required (Bearer Token)
- **Description**: Remove a team member from the project

**Headers:**
```
Authorization: Bearer <token>
```

**URL Parameters:**
```
:id = 507f1f77bcf86cd799439021
```

**Request Body:**
```json
{
  "members": ["507f1f77bcf86cd799439012"]
}
```

**Success Response (200):**
```json
{
  "status": true,
  "message": "Member removed from project successfully",
  "project": {
    "_id": "507f1f77bcf86cd799439021",
    "name": "E-Commerce Platform",
    "members": ["507f1f77bcf86cd799439011"]
  }
}
```

---

### 2.7 Delete Project
**DELETE** `/project/:id`
- **Auth**: Required (Bearer Token)
- **Description**: Delete a project (soft or hard delete)

**Headers:**
```
Authorization: Bearer <token>
```

**URL Parameters:**
```
:id = 507f1f77bcf86cd799439021
```

**Request Body:** (empty)
```json
{}
```

**Success Response (200):**
```json
{
  "status": true,
  "message": "Project deleted successfully"
}
```

---

## 3. TASK ROUTES (`/api/task`)

### 3.1 Create Task (Admin Only)
**POST** `/task/create`
- **Auth**: Required (Bearer Token + Admin Role)
- **Description**: Create a new task in a project

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "Setup Database Schema",
  "date": "2025-05-20T10:00:00Z",
  "priority": "high",
  "stage": "todo",
  "project": "507f1f77bcf86cd799439021",
  "team": ["507f1f77bcf86cd799439011", "507f1f77bcf86cd799439012"],
  "assets": []
}
```

**Success Response (201):**
```json
{
  "status": true,
  "message": "Task created successfully",
  "task": {
    "_id": "607f1f77bcf86cd799439031",
    "title": "Setup Database Schema",
    "date": "2025-05-20T10:00:00Z",
    "priority": "high",
    "stage": "todo",
    "project": "507f1f77bcf86cd799439021",
    "team": [
      {
        "_id": "507f1f77bcf86cd799439011",
        "name": "John Doe"
      },
      {
        "_id": "507f1f77bcf86cd799439012",
        "name": "Jane Smith"
      }
    ],
    "activities": [],
    "subTasks": [],
    "assets": [],
    "isTrashed": false,
    "createdAt": "2025-05-11T10:30:00.000Z"
  }
}
```

---

### 3.2 Get Dashboard Statistics
**GET** `/task/dashboard`
- **Auth**: Required (Bearer Token)
- **Description**: Get dashboard statistics (task counts, etc.)

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "status": true,
  "message": "Dashboard statistics retrieved successfully",
  "tasks": {
    "total": 25,
    "completed": 10,
    "inProgress": 8,
    "todo": 7,
    "high": 5,
    "medium": 10,
    "normal": 7,
    "low": 3
  }
}
```

---

### 3.3 Get All Tasks
**GET** `/task/`
- **Auth**: Required (Bearer Token)
- **Description**: Get all tasks (with optional filters)

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters (optional):**
```
?stage=in progress&priority=high
```

**Success Response (200):**
```json
{
  "status": true,
  "message": "Tasks retrieved successfully",
  "tasks": [
    {
      "_id": "607f1f77bcf86cd799439031",
      "title": "Setup Database Schema",
      "date": "2025-05-20T10:00:00Z",
      "priority": "high",
      "stage": "in progress",
      "project": {
        "_id": "507f1f77bcf86cd799439021",
        "name": "E-Commerce Platform"
      },
      "team": [
        {
          "_id": "507f1f77bcf86cd799439011",
          "name": "John Doe"
        }
      ],
      "activities": [],
      "subTasks": [],
      "isTrashed": false,
      "createdAt": "2025-05-11T10:30:00.000Z"
    }
  ]
}
```

---

### 3.4 Get Task by ID
**GET** `/task/:id`
- **Auth**: Required (Bearer Token)
- **Description**: Get detailed information of a specific task

**Headers:**
```
Authorization: Bearer <token>
```

**URL Parameters:**
```
:id = 607f1f77bcf86cd799439031
```

**Success Response (200):**
```json
{
  "status": true,
  "message": "Task retrieved successfully",
  "task": {
    "_id": "607f1f77bcf86cd799439031",
    "title": "Setup Database Schema",
    "date": "2025-05-20T10:00:00Z",
    "priority": "high",
    "stage": "in progress",
    "project": {
      "_id": "507f1f77bcf86cd799439021",
      "name": "E-Commerce Platform"
    },
    "team": [
      {
        "_id": "507f1f77bcf86cd799439011",
        "name": "John Doe",
        "email": "john@example.com",
        "title": "Software Engineer"
      }
    ],
    "activities": [
      {
        "_id": "708f1f77bcf86cd799439040",
        "type": "assigned",
        "activity": "Task assigned to John Doe",
        "date": "2025-05-11T10:30:00.000Z",
        "by": "507f1f77bcf86cd799439012"
      }
    ],
    "subTasks": [
      {
        "_id": "709f1f77bcf86cd799439041",
        "title": "Create users table",
        "date": "2025-05-15T10:00:00Z",
        "tag": "backend"
      }
    ],
    "assets": ["https://example.com/image1.jpg"],
    "isTrashed": false,
    "createdAt": "2025-05-11T10:30:00.000Z"
  }
}
```

---

### 3.5 Update Task (Admin Only)
**PUT** `/task/update/:id`
- **Auth**: Required (Bearer Token + Admin Role)
- **Description**: Update task details

**Headers:**
```
Authorization: Bearer <token>
```

**URL Parameters:**
```
:id = 607f1f77bcf86cd799439031
```

**Request Body:**
```json
{
  "title": "Setup Database Schema and Migrations",
  "priority": "high",
  "stage": "in progress",
  "date": "2025-05-25T10:00:00Z",
  "team": ["507f1f77bcf86cd799439011", "507f1f77bcf86cd799439012"]
}
```

**Success Response (200):**
```json
{
  "status": true,
  "message": "Task updated successfully",
  "task": {
    "_id": "607f1f77bcf86cd799439031",
    "title": "Setup Database Schema and Migrations",
    "priority": "high",
    "stage": "in progress",
    "date": "2025-05-25T10:00:00Z",
    "team": [
      "507f1f77bcf86cd799439011",
      "507f1f77bcf86cd799439012"
    ],
    "updatedAt": "2025-05-11T10:45:00.000Z"
  }
}
```

---

### 3.6 Create Sub-Task (Admin Only)
**PUT** `/task/create-subtask/:id`
- **Auth**: Required (Bearer Token + Admin Role)
- **Description**: Add a sub-task to a task

**Headers:**
```
Authorization: Bearer <token>
```

**URL Parameters:**
```
:id = 607f1f77bcf86cd799439031
```

**Request Body:**
```json
{
  "title": "Create users table",
  "date": "2025-05-15T10:00:00Z",
  "tag": "backend"
}
```

**Success Response (200):**
```json
{
  "status": true,
  "message": "Subtask created successfully",
  "task": {
    "_id": "607f1f77bcf86cd799439031",
    "title": "Setup Database Schema",
    "subTasks": [
      {
        "_id": "709f1f77bcf86cd799439041",
        "title": "Create users table",
        "date": "2025-05-15T10:00:00Z",
        "tag": "backend"
      }
    ]
  }
}
```

---

### 3.7 Post Task Activity
**POST** `/task/activity/:id`
- **Auth**: Required (Bearer Token)
- **Description**: Add activity/comment to a task

**Headers:**
```
Authorization: Bearer <token>
```

**URL Parameters:**
```
:id = 607f1f77bcf86cd799439031
```

**Request Body:**
```json
{
  "type": "started",
  "activity": "I've started working on this task",
  "date": "2025-05-11T10:50:00Z"
}
```

**Success Response (200):**
```json
{
  "status": true,
  "message": "Activity added successfully",
  "activity": {
    "_id": "708f1f77bcf86cd799439042",
    "type": "started",
    "activity": "I've started working on this task",
    "date": "2025-05-11T10:50:00Z",
    "by": "507f1f77bcf86cd799439011"
  }
}
```

**Allowed Activity Types:**
- `assigned`
- `started`
- `in progress`
- `bug`
- `completed`
- `commented`

---

### 3.8 Duplicate Task (Admin Only)
**POST** `/task/duplicate/:id`
- **Auth**: Required (Bearer Token + Admin Role)
- **Description**: Create a duplicate of an existing task

**Headers:**
```
Authorization: Bearer <token>
```

**URL Parameters:**
```
:id = 607f1f77bcf86cd799439031
```

**Request Body:** (empty)
```json
{}
```

**Success Response (201):**
```json
{
  "status": true,
  "message": "Task duplicated successfully",
  "task": {
    "_id": "607f1f77bcf86cd799439035",
    "title": "Setup Database Schema (Copy)",
    "date": "2025-05-20T10:00:00Z",
    "priority": "high",
    "stage": "todo",
    "project": "507f1f77bcf86cd799439021",
    "team": [
      "507f1f77bcf86cd799439011"
    ],
    "subTasks": [],
    "activities": [],
    "isTrashed": false,
    "createdAt": "2025-05-11T10:50:00.000Z"
  }
}
```

---

### 3.9 Trash Task (Admin Only)
**PUT** `/task/:id`
- **Auth**: Required (Bearer Token + Admin Role)
- **Description**: Move task to trash (soft delete)

**Headers:**
```
Authorization: Bearer <token>
```

**URL Parameters:**
```
:id = 607f1f77bcf86cd799439031
```

**Request Body:** (empty)
```json
{}
```

**Success Response (200):**
```json
{
  "status": true,
  "message": "Task moved to trash successfully",
  "task": {
    "_id": "607f1f77bcf86cd799439031",
    "title": "Setup Database Schema",
    "isTrashed": true,
    "updatedAt": "2025-05-11T10:55:00.000Z"
  }
}
```

---

### 3.10 Delete/Restore Task (Admin Only)
**DELETE** `/task/delete-restore/:id?`
- **Auth**: Required (Bearer Token + Admin Role)
- **Description**: Permanently delete or restore a trashed task

**Headers:**
```
Authorization: Bearer <token>
```

**URL Parameters:**
```
:id = 607f1f77bcf86cd799439031 (optional)
```

**Query Parameters (optional):**
```
?action=restore
```

**Request Body:** (empty)
```json
{}
```

**Success Response (200):**
```json
{
  "status": true,
  "message": "Task deleted/restored successfully"
}
```

---

## Headers Summary

### For Protected Routes:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjUwN2YxZjc3YmNmODZjZDc5OTQzOTAxMSIsImlhdCI6MTYyMzQ1NjAwMH0.abcdefg
Content-Type: application/json
```

### For Admin Routes:
The user making the request must have `isAdmin: true` in their user document AND provide valid Bearer token.

---

## Quick Testing Checklist

### Step 1: Authentication
- [ ] Register new user (POST `/user/register`)
- [ ] Login with credentials (POST `/user/login`)
- [ ] Copy the token from response

### Step 2: User Operations
- [ ] Get team list (GET `/user/get-team`)
- [ ] Get notifications (GET `/user/notifications`)
- [ ] Update profile (PUT `/user/profile`)
- [ ] Change password (PUT `/user/change-password`)

### Step 3: Project Operations
- [ ] Create project (POST `/project/create`)
- [ ] Get all projects (GET `/project/`)
- [ ] Get project by ID (GET `/project/:id`)
- [ ] Add member to project (POST `/project/:id/add-member`)
- [ ] Update project (PUT `/project/:id`)

### Step 4: Task Operations
- [ ] Create task (POST `/task/create`) - **Admin only**
- [ ] Get dashboard stats (GET `/task/dashboard`)
- [ ] Get all tasks (GET `/task/`)
- [ ] Get task by ID (GET `/task/:id`)
- [ ] Update task (PUT `/task/update/:id`) - **Admin only**
- [ ] Add task activity (POST `/task/activity/:id`)
- [ ] Create sub-task (PUT `/task/create-subtask/:id`) - **Admin only**

---

## Error Responses

### 401 Unauthorized (Missing/Invalid Token)
```json
{
  "status": false,
  "message": "Not authorized to access this route"
}
```

### 403 Forbidden (Not Admin)
```json
{
  "status": false,
  "message": "Not authorized to access this resource"
}
```

### 404 Not Found
```json
{
  "status": false,
  "message": "Resource not found"
}
```

### 400 Bad Request
```json
{
  "status": false,
  "message": "Validation error: [error details]"
}
```

### 500 Server Error
```json
{
  "status": false,
  "message": "Server error occurred"
}
```

---

## Environment Variables Required
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/taskmanager
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
```

---

## Notes
- All timestamps are in ISO 8601 format (UTC)
- Dates should be sent as ISO strings: `2025-05-20T10:00:00Z`
- Admin operations require both `isAdmin: true` AND valid JWT token
- Soft deleted items (isTrashed: true) are typically excluded from GET requests
- The API uses pagination for some list endpoints (check actual implementation)
