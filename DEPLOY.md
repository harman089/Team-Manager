# 🚀 Quick Deployment Guide - Railway

## Prerequisites
- GitHub account with repository
- MongoDB Atlas account (free tier)
- Railway.app account (free tier)

## 5-Minute Setup

### Step 1: MongoDB Atlas Setup (2 min)
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create free account
3. Click "Build a Database" → M0 (Free)
4. Create cluster → Connect
5. Create Database User → Copy connection string
   ```
   mongodb+srv://username:password@cluster.mongodb.net/taskmanager
   ```

### Step 2: Deploy Backend (2 min)
1. Go to [Railway.app](https://railway.app)
2. Click "Create" → "Deploy from GitHub"
3. Select your repository
4. Set Root Directory: `server`
5. Add Environment Variables:
   ```
   PORT=5000
   MONGODB_URI=[paste from step 1]
   JWT_SECRET=[generate strong random string]
   NODE_ENV=production
   ```
6. Deploy!
7. Copy public URL (e.g., https://taskmanager-api.railway.app)

### Step 3: Deploy Frontend (1 min)
1. New Railway Project → Deploy from GitHub
2. Select same repository
3. Set Root Directory: `client`
4. Add Environment Variable:
   ```
   VITE_API_URL=https://your-backend-url.railway.app/api
   ```
5. Deploy!
6. Get public URL

### Step 4: Update CORS (Optional but recommended)
In `server/index.js`, update CORS:
```javascript
origin: [
  "https://your-frontend-railway-url.railway.app"
]
```

## ✅ Your App is Live!

- **Frontend**: https://your-frontend.railway.app
- **Backend**: https://your-backend.railway.app
- **API**: https://your-backend.railway.app/api

## Default Admin Account

First user to register becomes admin. Or use email from database to set isAdmin: true.

## Troubleshooting

**CORS Error**: Update backend CORS with frontend Railway URL
**DB Connection**: Verify MongoDB Atlas connection string and IP whitelist
**Auth Issues**: Clear cookies and re-login
**Build Fails**: Check Node version matches (v14+)

## Next Steps
- Add custom domain
- Set up error monitoring
- Configure backups
- Add CI/CD pipeline
- Monitor performance

**Congratulations! Your Task Manager is live! 🎉**
