# 🔍 Deployment Authentication Debugging Guide

## Issue
Client not receiving 401 errors on protected APIs in production (deployed)
- **Local:** Working correctly ✅
- **Deployed:** Not returning 401 errors ❌

## Root Cause Analysis

### Most Likely Causes:
1. ❌ **Cookies not sent in cross-origin requests** - sameSite/secure mismatch
2. ❌ **NODE_ENV not set to 'production'** - forcing strict sameSite in production
3. ❌ **CORS misconfiguration** - origin not in whitelist
4. ❌ **HTTPS not properly configured** - secure flag requires HTTPS

---

## ✅ Fixes Applied

### 1. Backend Cookie Configuration (`server/utils/index.js`)
```javascript
// BEFORE: ❌
secure: process.env.NODE_ENV !== "development"
// Result: If NODE_ENV="test", secure=true but sameSite=strict (WRONG!)

// AFTER: ✅
secure: isProduction // Only true for "production"
sameSite: isProduction ? "none" : "strict"
path: "/" // Ensure cookie sent for all paths
```

### 2. Auth Middleware Debugging (`server/middlewares/authMiddlewave.js`)
- Added debug logs to show:
  - Whether token is present
  - What cookies are received
  - Origin of request
  - Auth error details

### 3. CORS Configuration (`server/index.js`)
- Added origin debug logging
- Allows requests with no origin (for Postman/mobile testing)
- Proper headers configuration

### 4. Frontend Error Handling (`client/src/redux/slices/apiSlice.js`)
- Better error logging for all statuses
- Shows 401 vs 403 vs other errors
- Logs to console for debugging

---

## 🧪 Deployment Debugging Steps

### Step 1: Verify Environment Variables

**Check backend logs:**
```bash
# Should show exactly:
NODE_ENV=production
JWT_SECRET=<value>
MONGODB_URI=<value>
PORT=5000
```

**On Railway dashboard:**
1. Go to your backend service
2. Settings → Environment → Check variables
3. Verify `NODE_ENV=production` is set

### Step 2: Check Backend Logs

**Look for:**
```
✅ [JWT] Token created - sameSite: none, secure: true
✅ DB connection established
✅ Server listening on PORT
```

**Bad signs:**
```
❌ [JWT] Token created - sameSite: strict, secure: true
❌ No logs about DB connection
❌ [AUTH] No token found
```

### Step 3: Test Cookie Setting

**In browser DevTools:**
1. Open Network tab
2. Call login endpoint: `POST /api/user/login`
3. Check Response Headers:
   ```
   ✅ set-cookie: token=<value>; Path=/; HttpOnly; Secure; SameSite=None
   ```

**If you see:**
   ```
   ❌ set-cookie: token=<value>; Path=/; HttpOnly; SameSite=Strict
   ```
   → Node_ENV is NOT set to "production"

### Step 4: Test Cookie Sending

**In browser DevTools:**
1. Login successfully
2. Open Application → Cookies
3. Find "token" cookie
4. Check values:
   ```
   ✅ Domain: .railway.app or your domain
   ✅ Path: /
   ✅ Secure: Checked
   ✅ HttpOnly: Checked
   ✅ SameSite: None
   ```

5. Make a protected API call (e.g., `/api/task/dashboard`)
6. In Network tab, check Request Headers:
   ```
   ✅ Cookie: token=<value>
   ```

**If Cookie header is missing:**
   - SameSite issue
   - Frontend not sending credentials
   - CORS misconfiguration

### Step 5: Test CORS

**Check Response Headers on any protected route:**
```
✅ access-control-allow-credentials: true
✅ access-control-allow-origin: https://your-frontend.com
✅ access-control-allow-methods: GET, POST, PUT, DELETE
```

**If you see:**
```
❌ access-control-allow-origin: *
```
→ CORS allowing wildcards (security risk, won't work with credentials)

---

## 🛠️ Manual Testing Commands

### Test 1: Register User (Check cookie setting)
```bash
curl -v -X POST https://your-api.railway.app/api/user/register \
  -H "Content-Type: application/json" \
  -d '{
    "name":"Test User",
    "email":"test@example.com",
    "password":"Password123",
    "title":"Dev",
    "role":"user"
  }'
```

**Expected Response Headers:**
```
< HTTP/2 201
< set-cookie: token=...; Path=/; HttpOnly; Secure; SameSite=None
```

### Test 2: Call Protected Route Without Cookie
```bash
curl -X GET https://your-api.railway.app/api/task/dashboard
```

**Expected:**
```
{"status":false,"message":"Not authorized. Try login again."}
```

**If you get data instead:**
→ Auth middleware not working

### Test 3: Call Protected Route With Cookie
```bash
# After getting token from test 1
curl -X GET https://your-api.railway.app/api/task/dashboard \
  -H "Cookie: token=<your-token-here>"
```

**Expected:**
```
{"status":true,"totalTasks":...}
```

---

## 🔧 Configuration Checklist

### Backend (.env)
- [ ] `NODE_ENV=production` (not "prod", not "deploy")
- [ ] `JWT_SECRET=<32+ char random string>`
- [ ] `MONGODB_URI=<valid connection>`
- [ ] `PORT=5000`

### Frontend (.env)
- [ ] `VITE_API_URL=https://your-api.railway.app/api`

### Deployment (Railway)
- [ ] Backend service has `NODE_ENV=production` in environment
- [ ] Frontend service has `VITE_API_URL=https://...`
- [ ] Both services using HTTPS

### Frontend Code
- [ ] `credentials: "include"` in API configuration
- [ ] VITE config correct

---

## 📊 Expected Behavior

### Local (Development):
```
Register → Set token cookie (SameSite=strict)
          → Protected routes work
          → 401 when no token

Deploy → Set token cookie (SameSite=none, Secure=true)
      → Cookie sent in cross-origin requests
      → Protected routes work
      → 401 when no token
```

### Common Issue Scenarios

**Scenario 1: Getting data without auth**
- Middleware not checking token
- Token verification passing with bad JWT
- Debug: Check backend logs for "[AUTH] Token present"

**Scenario 2: Cookie not being sent**
- SameSite=strict in production
- Frontend not sending credentials
- Domain mismatch
- Debug: Check Network tab → Request Headers → Cookie

**Scenario 3: CORS error**
- Origin not in whitelist
- Credentials not allowed
- Debug: Check Response Headers → access-control-allow-origin

---

## 📝 Quick Fixes

### Fix 1: Ensure NODE_ENV=production
```bash
# On Railway, add to environment:
NODE_ENV=production
```

### Fix 2: Check HTTPS
```bash
# Verify deployed URL is HTTPS
https://your-backend.railway.app
```

### Fix 3: Clear Browser Cache
```
DevTools → Application → Clear Site Data
```

### Fix 4: Test with curl (rules out frontend issues)
```bash
curl -i -X GET https://your-api/api/task/dashboard
# Should return 401, not data
```

---

## When All Else Fails

1. **Check Railway backend logs:**
   - Click service → Logs tab
   - Look for error messages
   - Check if NODE_ENV is being used correctly

2. **Compare local vs production:**
   ```bash
   # Local
   npm run dev
   # Check: NODE_ENV in logs
   
   # Production
   # Check Railway dashboard
   ```

3. **Enable verbose logging:**
   ```javascript
   // In server/index.js (temporary)
   app.use((req, res, next) => {
     console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
     console.log("Cookies:", req.cookies);
     console.log("Origin:", req.headers.origin);
     next();
   });
   ```

4. **Test with Postman:**
   - Create login request
   - Save cookie from response
   - Use cookie in protected route request
   - Should work if backend is correct

---

## Summary of Changes

| File | Change | Impact |
|------|--------|--------|
| `server/utils/index.js` | Added `path: "/"` to cookie | Ensures cookie sent for all endpoints |
| `server/utils/index.js` | Fixed NODE_ENV check | Correct sameSite/secure in production |
| `server/middlewares/authMiddlewave.js` | Added debug logging | Easy to troubleshoot auth issues |
| `server/index.js` | Added origin logging | See which origins are rejected |
| `client/apiSlice.js` | Better error logging | More detailed error messages |

---

After applying these fixes, if still no 401:
1. Check Railway environment variables
2. Verify NODE_ENV=production
3. Check browser DevTools → Network → Cookies
4. Check backend logs for [AUTH] messages
