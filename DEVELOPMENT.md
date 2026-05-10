# Task Manager Development Notes

## Setup Instructions

### Quick Start

1. **Clone & Install**
```bash
git clone <repo>
cd taskmanager
cd server && npm install && cd ../client && npm install
```

2. **Environment Setup**
```bash
# Server
cd server
cp .env.example .env
# Edit .env with your credentials

# Client
cd ../client
echo "VITE_API_URL=http://localhost:5000/api" > .env
```

3. **Run Development Servers**
```bash
# Terminal 1: Backend
cd server
npm run dev

# Terminal 2: Frontend
cd client
npm run dev
```

4. **Access Application**
- Frontend: http://localhost:5173
- Backend: http://localhost:5000
- API: http://localhost:5000/api

## Features Implemented

### Authentication & Authorization
- ✅ User Registration with validation
- ✅ User Login with JWT
- ✅ Password strength indicator
- ✅ Role-based access (Admin/Member)
- ✅ Protected routes

### Project Management
- ✅ Create Projects
- ✅ Add/Remove Members
- ✅ Project Details View
- ✅ Admin Controls
- ✅ Team Collaboration

### Task Management
- ✅ Create Tasks
- ✅ Assign to Team Members
- ✅ Status Tracking (TODO, In Progress, Completed)
- ✅ Priority Levels
- ✅ Activity Logs
- ✅ Subtasks

### Dashboard & Reporting
- ✅ Task Overview
- ✅ Status Distribution
- ✅ Overdue Tasks
- ✅ Team Statistics

### UI/UX
- ✅ Responsive Design
- ✅ Dark Mode Compatible
- ✅ Loading States
- ✅ Error Handling
- ✅ Toast Notifications

## Key Files

### Backend
- `server/models/` - Database schemas
- `server/controllers/` - Business logic
- `server/routes/` - API endpoints
- `server/middlewares/` - Auth & error handling
- `server/utils/` - Helpers & validation

### Frontend
- `client/src/pages/` - Page components
- `client/src/components/` - Reusable components
- `client/src/redux/` - State management
- `client/src/utils/` - Utilities & validation
- `client/src/assets/` - Static files

## Deployment

See main README.md for Railway deployment guide.

## Contributing

1. Create feature branch
2. Make changes
3. Test thoroughly
4. Submit PR

## Common Issues

### Port Already in Use
```bash
# Kill process on port 5000/5173
npx kill-port 5000 5173
```

### MongoDB Connection
- Check connection string format
- Verify IP whitelist
- Test with MongoDB Compass

### CORS Issues
- Update server CORS config
- Check frontend API URL

## Performance Tips

- Use lazy loading for routes
- Implement pagination for lists
- Cache API responses
- Optimize bundle size
- Use CDN for assets
