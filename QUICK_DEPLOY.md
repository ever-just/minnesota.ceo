# 🚀 MINNESOTA.CEO Quick Deploy Guide

## ✅ What's Been Completed

1. **Full Next.js Application** - Complete with all features
2. **Landing Page** - Interactive with countdown timer
3. **App Preview** (app.minnesota.ceo) - Video platform preview
4. **Admin Dashboard** (admin.minnesota.ceo) - Password: `weldon`
5. **API Endpoints** - Waitlist, nominations, analytics
6. **Database Schema** - Ready for PostgreSQL
7. **Email Templates** - SendGrid integration ready
8. **Mobile Optimization** - PWA-ready
9. **Security** - Environment variables, SSL-ready
10. **Privacy & Terms Pages** - Complete

## 🔧 Quick Setup Steps

### Step 1: Create GitHub Repository (2 minutes)

1. Go to https://github.com/new
2. Repository name: `minnesota-ceo`
3. Description: "Video interviews with Minnesota's most influential leaders"
4. Set to **Public**
5. Click "Create repository"
6. Run these commands in terminal:

```bash
cd "/Users/cloudaistudio/Documents/EVERJUST PROJECTS/MINNESOTA.CEO"
git remote add origin https://github.com/YOUR-USERNAME/minnesota-ceo.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy on DigitalOcean (10 minutes)

1. **Go to DigitalOcean App Platform:**
   https://cloud.digitalocean.com/apps

2. **Click "Create App"**

3. **Choose GitHub** as source

4. **Select your repository:** `minnesota-ceo`

5. **App Settings:**
   - Name: `minnesota-ceo`
   - Region: New York (NYC)
   - Branch: main

6. **Resource Settings:**
   - Plan: Basic ($5/month)
   - Container Size: 512 MB RAM | 1 vCPU

7. **Environment Variables (IMPORTANT!):**
   Click "Edit" and add these:
   ```
   NODE_ENV=production
   NEXT_PUBLIC_APP_URL=https://minnesota.ceo
   ADMIN_PASSWORD=weldon
   SENDGRID_API_KEY=(your SendGrid API key if you have one)
   SENDGRID_FROM_EMAIL=notifications@minnesota.ceo
   SENDGRID_FROM_NAME=MINNESOTA.CEO
   ```

8. **Info:**
   - Build Command: `npm install && npm run build`
   - Run Command: `npm start`
   - HTTP Port: 3000
   - HTTP Request Routes: `/`

9. **Click "Next" → "Create Resources"**

10. **Wait for deployment** (5-10 minutes)

### Step 3: Get Your App URL (1 minute)

After deployment:
1. Go to your app's dashboard
2. Copy the app URL (e.g., `minnesota-ceo-xxxxx.ondigitalocean.app`)
3. Note the IP address from the "Settings" tab

### Step 4: Configure Custom Domain (5 minutes)

1. **In DigitalOcean App Platform:**
   - Go to Settings → Domains
   - Add domain: `minnesota.ceo`
   - Add domain: `www.minnesota.ceo`
   - Add domain: `app.minnesota.ceo`
   - Add domain: `admin.minnesota.ceo`

2. **Update DNS at GoDaddy:**
   
   Run this command to update DNS automatically:
   ```bash
   cd "/Users/cloudaistudio/Documents/EVERJUST PROJECTS/MINNESOTA.CEO"
   # First, update the targetIP in .godaddy-config.json with your DigitalOcean IP
   node scripts/update-godaddy-dns.js
   ```

   **OR manually at GoDaddy.com:**
   - Login to GoDaddy
   - Go to DNS Management for minnesota.ceo
   - Update/Add these records:
     - Type: A, Name: @, Value: [Your DigitalOcean IP]
     - Type: CNAME, Name: www, Value: [Your DigitalOcean app URL]
     - Type: CNAME, Name: app, Value: [Your DigitalOcean app URL]
     - Type: CNAME, Name: admin, Value: [Your DigitalOcean app URL]

### Step 5: Add PostgreSQL Database (Optional - for production)

1. **In DigitalOcean:**
   - Go to Databases
   - Create new PostgreSQL cluster
   - Name: `minnesota-ceo-db`
   - Size: Basic ($15/month)
   - Region: NYC

2. **Connect to database and run:**
   ```sql
   CREATE TABLE IF NOT EXISTS waitlist (
     id SERIAL PRIMARY KEY,
     email VARCHAR(255) UNIQUE NOT NULL,
     source VARCHAR(50) DEFAULT 'main',
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );

   CREATE TABLE IF NOT EXISTS nominations (
     id SERIAL PRIMARY KEY,
     nominee_name VARCHAR(255) NOT NULL,
     nominee_title VARCHAR(255),
     nominee_organization VARCHAR(255),
     category VARCHAR(100),
     reason TEXT,
     nominator_name VARCHAR(255),
     nominator_email VARCHAR(255),
     nominator_phone VARCHAR(20),
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );

   CREATE TABLE IF NOT EXISTS analytics (
     id SERIAL PRIMARY KEY,
     event_type VARCHAR(50) NOT NULL,
     page_path VARCHAR(255),
     user_agent TEXT,
     ip_address VARCHAR(45),
     referrer TEXT,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );

   CREATE TABLE IF NOT EXISTS admin_sessions (
     id SERIAL PRIMARY KEY,
     session_token VARCHAR(255) UNIQUE NOT NULL,
     ip_address VARCHAR(45),
     user_agent TEXT,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     expires_at TIMESTAMP NOT NULL
   );
   ```

3. **Update app environment variable:**
   - Add `DATABASE_URL` with your PostgreSQL connection string

### Step 6: Configure SendGrid (Optional - for emails)

If you have SendGrid:
1. Login to SendGrid
2. Create API Key (Settings → API Keys)
3. Add to DigitalOcean environment variables
4. Verify sender email: `notifications@minnesota.ceo`

## 🎉 That's It!

Your site will be live at:
- https://minnesota.ceo - Main site
- https://app.minnesota.ceo - Video platform preview  
- https://admin.minnesota.ceo - Admin dashboard (password: weldon)

## 📝 Test Checklist

- [ ] Visit main site and see countdown
- [ ] Test email waitlist signup
- [ ] Submit a leader nomination
- [ ] Check admin dashboard (password: weldon)
- [ ] Verify mobile responsiveness
- [ ] Check SSL certificate (green padlock)

## 🔧 Troubleshooting

**Site not loading?**
- Wait 5-10 minutes for deployment
- Check DigitalOcean build logs

**Domain not working?**
- DNS can take up to 48 hours to propagate
- Use DigitalOcean URL temporarily

**Forms not saving?**
- Database not configured (works with mock data)
- Add DATABASE_URL environment variable

**Emails not sending?**
- SendGrid not configured (optional)
- Add SENDGRID_API_KEY

## 💰 Total Monthly Cost

- DigitalOcean App: $5/month
- PostgreSQL Database: $15/month (optional)
- Domain: Already owned
- **Total: $5-20/month**

## 📞 Need Help?

- EVERJUST COMPANY: company@everjust.org
- Project files are all in: `/Users/cloudaistudio/Documents/EVERJUST PROJECTS/MINNESOTA.CEO`

---

**Ready to deploy! The entire process should take about 20 minutes.**
