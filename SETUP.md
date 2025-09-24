# 🚀 Quick Setup Guide for JobConnect

This guide will help your friend set up and run the JobConnect project on their machine.

## 📋 Prerequisites

Before starting, make sure you have these installed:

1. **Node.js** (v18 or higher)
   - Download from: https://nodejs.org/
   - Choose the LTS version
   - This includes npm (Node Package Manager)

2. **Git**
   - Download from: https://git-scm.com/
   - Used to clone the repository

3. **MongoDB** (Choose one option)
   - **Option A**: Docker (Recommended - easiest)
   - **Option B**: Local MongoDB installation
   - **Option C**: MongoDB Atlas (cloud - free tier available)

## 🔧 Step-by-Step Setup

### Step 1: Clone the Repository
```bash
git clone <your-repository-url>
cd JobOffers
```

### Step 2: Install Backend Dependencies
```bash
cd backend
npm install
```

### Step 3: Install Frontend Dependencies
```bash
cd ../frontend
npm install
```

### Step 4: Set Up Environment Variables
```bash
cd ../backend
cp env.example .env
```

Edit the `.env` file with a text editor:
```env
PORT=4000
MONGODB_URI=mongodb://localhost:27017/jobconnect
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

### Step 5: Start MongoDB

**Option A: Using Docker (Recommended)**
```bash
# From the project root directory
docker-compose up -d
```

**Option B: Local MongoDB**
- Install MongoDB from https://www.mongodb.com/try/download/community
- Start MongoDB service
- On Windows: Run "MongoDB Compass" or start the service
- On Mac: `brew services start mongodb-community`
- On Linux: `sudo systemctl start mongod`

**Option C: MongoDB Atlas (Cloud)**
- Go to https://www.mongodb.com/atlas
- Create a free account
- Create a new cluster
- Get your connection string
- Update `MONGODB_URI` in `.env` with your Atlas connection string

### Step 6: Start the Backend Server
```bash
cd backend
npm run dev
```
You should see: `API listening on http://localhost:4000`

### Step 7: Start the Frontend Server
Open a **new terminal window** and run:
```bash
cd frontend
npm run dev
```
You should see: `Local: http://localhost:5173/`

### Step 8: Open the Application
Open your browser and go to: **http://localhost:5173**

## 🎉 Success!

If everything is working correctly, you should see:
- A modern, professional-looking job marketplace
- A search bar at the top
- An interactive map showing job locations in Sofia
- A list of available jobs below the map
- Smooth animations and hover effects

## 🚨 Troubleshooting

### "Port already in use" Error
```bash
# Kill processes using ports 4000 or 5173
# On Mac/Linux:
lsof -ti:4000 | xargs kill -9
lsof -ti:5173 | xargs kill -9

# On Windows:
netstat -ano | findstr :4000
taskkill /PID <PID_NUMBER> /F
```

### "Cannot find module" Error
```bash
# Clear and reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### MongoDB Connection Issues
- Make sure MongoDB is running
- Check your `MONGODB_URI` in `.env`
- For Docker: `docker-compose logs mongodb`

### Frontend Not Loading
- Check if backend is running on port 4000
- Open browser developer tools (F12) and check for errors
- Make sure both servers are running

### "npm command not found"
- Make sure Node.js is installed
- Restart your terminal
- Try using `npx` instead of `npm`

## 📞 Need Help?

If you run into issues:
1. Check the console logs for error messages
2. Make sure all steps were followed correctly
3. Try restarting both servers
4. Check that all dependencies are installed
5. Verify MongoDB is running

## 🎯 What You Should See

The application should display:
- **Header**: "JobConnect" logo with Profile and Admin buttons
- **Hero Section**: "Find Your Next Gig" with description
- **Search Section**: Search bar with filters
- **Map Section**: Interactive map with job markers
- **Jobs List**: Cards showing available jobs with details

The design should look modern and professional with:
- Glassmorphism effects (frosted glass look)
- Gradient colors (blue to purple)
- Smooth animations
- Professional shadows and spacing
