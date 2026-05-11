# 🔧 Vercel Frontend Deployment Fix

## ❌ Current Issue
Frontend deployed on Vercel → 404 errors → Not fetching from Railway backend

## ✅ Solution Steps

### Step 1: Get Your Railway Backend URL
1. Go to [Railway.app Dashboard](https://railway.app)
2. Select your **backend service** (taskmanager-api or similar)
3. Click on **Deployments** tab
4. Click the latest deployment
5. Copy the **Public URL** (looks like: `https://web-production-1044e.up.railway.app`)
6. Keep this URL handy

### Step 2: Update Vercel Environment Variables
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your **frontend project**
3. Go to **Settings** → **Environment Variables**
4. Add new variable:
   - **Name:** `VITE_API_URL`
   - **Value:** `https://your-railway-backend-url/api` (from Step 1)
   - **Environments:** Select `Production`, `Preview`, and `Development`
5. Click **Save**

**Example:**
```
VITE_API_URL=https://web-production-1044e.up.railway.app/api
```

### Step 3: Redeploy Frontend on Vercel
1. In Vercel dashboard
2. Go to **Deployments**
3. Click the three dots (•••) on latest deployment
4. Click **Redeploy**
5. Wait for build to complete

### Step 4: Update Backend CORS (if needed)
Your Vercel frontend URL will be like: `https://your-project-name.vercel.app`

Update `server/index.js` to include your Vercel URL:

```javascript
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "https://web-production-1044e.up.railway.app",      // Backend URL
  "https://team-manager-cyan-five.vercel.app",         // Your Vercel frontend URL
  "https://your-new-project.vercel.app",               // Add your actual Vercel URL
];
```

Then redeploy backend on Railway to apply changes.

### Step 5: Test API Connection

**In browser DevTools (F12 → Network tab):**
1. Go to your Vercel frontend
2. Try logging in or loading data
3. Check Network tab → XHR requests
4. Should see requests to: `https://your-railway-backend-url/api/...`
5. Response should be `200` not `404`

---

## 🐛 Troubleshooting

### Still Getting 404?
**Check:**
- ✅ Verify `VITE_API_URL` is set in Vercel Settings
- ✅ Verify it's exactly: `https://your-backend-url/api` (with `/api`)
- ✅ Verify backend Railway service is running (check Railway dashboard)
- ✅ Clear browser cache (Ctrl+Shift+Delete) and refresh

### Still Can't Connect?
**Test the backend directly:**
```bash
# In Postman or Terminal
GET https://your-backend-url/api

# Should return: { "ok": true }
```

If not working, backend might not be deployed properly.

### CORS Error in Console?
**In browser DevTools Console, you might see:**
```
Access to XMLHttpRequest has been blocked by CORS policy
```

**Fix:**
1. Update `server/index.js` with your Vercel URL
2. Redeploy backend on Railway
3. Wait 2 minutes for Railway to fully redeploy
4. Refresh browser

---

## 📋 Quick Checklist

- [ ] Backend URL copied from Railway
- [ ] `VITE_API_URL` set in Vercel Environment Variables
- [ ] Vercel frontend redeployed
- [ ] Backend CORS updated (if needed)
- [ ] Vercel backend URL added to CORS whitelist
- [ ] Clear browser cache and refresh
- [ ] Test API call in Network tab

---

## Example URLs
```
Backend Railway:  https://web-production-1044e.up.railway.app
Backend API:      https://web-production-1044e.up.railway.app/api
Frontend Vercel:  https://team-manager-cyan-five.vercel.app
Login Endpoint:   https://web-production-1044e.up.railway.app/api/user/login
```

---

**Need help? Check these files:**
- Frontend config: `client/src/redux/slices/apiSlice.js`
- Backend config: `server/index.js` (CORS section)
- Vercel config: `vercel.json`
