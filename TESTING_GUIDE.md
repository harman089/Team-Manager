# API Testing & Deployment Guide

## ✅ Fixes Applied

### Backend (Server)

#### 1. **User Authentication (userController.js)**
- ✅ Fixed: Non-admin users now receive JWT token on registration
- ✅ Enhanced: Added password validation in `changeUserPassword`
- ✅ Added: Old password verification for security
- ✅ Status Code: Changed from 201 to 200 for logout

#### 2. **CORS Configuration (index.js)**
- ✅ Fixed: Replaced `origin: true` with whitelist validation
- ✅ Added: Support for `FRONTEND_URL` environment variable
- ✅ Supports: Localhost for dev, production URL for deployment
- ✅ Credentials: Properly configured for cookie transmission

#### 3. **Task Controller (taskController.js)**
- ✅ Added: MongoDB ObjectId format validation for all endpoints
- ✅ Added: User permission checks (non-admins see only their tasks)
- ✅ Added: Input validation for all create/update operations
- ✅ Added: 404 checks before operations
- ✅ Added: Proper HTTP status codes (201 for create, 200 for get)
- ✅ Search: Added search functionality with regex

#### 4. **Project Controller (projectController.js)**
- ✅ Added: ID format validation for all endpoints
- ✅ Added: Input validation (non-empty project names)
- ✅ Added: User permission checks throughout
- ✅ Improved: Error messages and status codes

### Frontend (Client)

#### 1. **API Slice Configuration (apiSlice.js)**
- ✅ Added: Global error handler for 401 responses
- ✅ Added: Credentials configuration in headers
- ✅ Improved: Error handling for authentication failures

---

## 🧪 Testing Checklist

### Phase 1: Local Testing

```bash
# 1. Start MongoDB (if local)
mongod

# 2. Start Backend
cd server
npm install
# Update .env with your config
npm start

# 3. Start Frontend
cd client
npm install
npm run dev
```

### Phase 2: Registration & Authentication Flow

**Test Case 1: Register New Non-Admin User**
```
URL: http://localhost:5000/api/user/register
Method: POST
Body: {
  "name": "Test User",
  "email": "test@example.com",
  "password": "SecurePass123",
  "title": "Developer",
  "role": "user"
}

Expected:
✅ Status: 201
✅ Response contains user data
✅ Cookie "token" is set (check in Network tab)
✅ message: "User registered successfully"
```

**Test Case 2: Login Registered User**
```
URL: http://localhost:5000/api/user/login
Method: POST
Body: {
  "email": "test@example.com",
  "password": "SecurePass123"
}

Expected:
✅ Status: 200
✅ Response contains user data
✅ JWT cookie is set
✅ Can navigate to dashboard
```

### Phase 3: Protected Routes Testing

**Test Case 3: Get Dashboard Stats**
```
URL: http://localhost:5000/api/task/dashboard
Method: GET
Headers: Cookie must include "token"

Expected:
✅ Status: 200
✅ Returns: { status: true, totalTasks, last10Task, tasks, graphData, ... }
❌ 401: Token missing or expired
```

**Test Case 4: Get Notifications**
```
URL: http://localhost:5000/api/user/notifications
Method: GET

Expected:
✅ Status: 200 (or 201)
✅ Returns array of notifications
✅ Each notification has: _id, team, text, task, isRead
```

**Test Case 5: Get All Tasks**
```
URL: http://localhost:5000/api/task?stage=&isTrashed=false&search=
Method: GET

Expected:
✅ Status: 200
✅ Non-admins: See only their assigned tasks
✅ Admins: See all tasks
```

### Phase 4: CORS Testing

**Test Case 6: Frontend API Call Success**
```
Browser Network Tab should show:
✅ Response Header: Access-Control-Allow-Credentials: true
✅ Response Header: Access-Control-Allow-Origin: (your frontend URL)
✅ Cookies sent in request
✅ No CORS errors
```

### Phase 5: Error Scenarios

**Test Case 7: Invalid Credentials**
```
Login with wrong password:
Expected: Status 401, message: "Invalid email or password"
```

**Test Case 8: Invalid Task ID**
```
GET /api/task/123 (invalid format)
Expected: Status 400, message: "Invalid task ID format"
```

**Test Case 9: Unauthorized Access**
```
Non-admin tries to delete task:
Expected: Status 401, message: "Not authorized as admin"
```

**Test Case 10: Resource Not Found**
```
GET /api/task/507f1f77bcf86cd799439011 (valid format, not exists)
Expected: Status 404, message: "Task not found"
```

---

## 🚀 Production Deployment

### Backend Deployment

1. **Update Environment Variables**
   ```
   PORT=5000
   MONGODB_URI=<your-production-db-uri>
   JWT_SECRET=<long-secure-random-string>
   NODE_ENV=production
   FRONTEND_URL=https://your-frontend-domain.com
   ```

2. **Deploy to Railway/Vercel/etc**
   ```bash
   git push origin main
   ```

3. **Verify Logs**
   - Check: "Server listening on PORT"
   - Check: "DB connection established"

### Frontend Deployment

1. **Update .env**
   ```
   VITE_API_URL=https://your-api-domain.com/api
   ```

2. **Build**
   ```bash
   npm run build
   ```

3. **Deploy**
   - Vercel: `vercel deploy`
   - Or manual upload to hosting

### Verification

**Check Backend Health**
```bash
curl https://your-api-domain.com/
# Should return: { ok: true }
```

**Check API Endpoints**
```bash
curl https://your-api-domain.com/api/user/login -X POST
# Should handle request (may return auth error, but not CORS/connection error)
```

---

## 🔐 Security Checklist

- [x] JWT token only sent via HttpOnly cookies
- [x] CORS limited to specific origins (not wildcard)
- [x] Password validation (min 6 chars)
- [x] Old password verification before change
- [x] Input sanitization in registration
- [x] User permission checks on protected routes
- [x] Admin-only route protection
- [x] Credentials: true for cross-origin requests

---

## 📊 Expected HTTP Status Codes

| Scenario | Status | Response |
|----------|--------|----------|
| Success | 200/201 | `{ status: true, data... }` |
| Bad Request | 400 | `{ status: false, message: "..." }` |
| Unauthorized | 401 | `{ status: false, message: "Not authorized..." }` |
| Forbidden | 403 | `{ status: false, message: "Not authorized as admin..." }` |
| Not Found | 404 | `{ status: false, message: "Not found" }` |
| Server Error | 500 | `{ status: false, message: error }` |

---

## 🐛 Troubleshooting

### Issue: 401 on Protected Routes
- [ ] Check if JWT cookie is being set on registration/login
- [ ] Verify FRONTEND_URL environment variable is set
- [ ] Check browser cookies (DevTools > Application > Cookies)
- [ ] Ensure `credentials: "include"` in fetch/axios

### Issue: CORS Errors
- [ ] Verify origin in allowed list
- [ ] Check `NODE_ENV` (sameSite: "none" requires secure: true)
- [ ] Ensure `credentials: true` in CORS config

### Issue: 400 on Task Operations
- [ ] Verify task ID is valid MongoDB ObjectId format
- [ ] Check required fields in request body
- [ ] Review error message for specifics

---

## 📝 Next Steps

1. Run through all test cases above
2. Fix any failing scenarios
3. Deploy to production
4. Monitor logs for errors
5. Test production deployment with same test cases
