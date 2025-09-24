# JobConnect - C2C Job Marketplace

A modern, modular web library for connecting people with local job opportunities. Built with React, Node.js, and MongoDB.

## 🚀 Quick Start

### Prerequisites

Before running this project, make sure you have the following installed:

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Git** - [Download here](https://git-scm.com/)
- **MongoDB** (optional - see setup options below)

### 📋 Step-by-Step Setup

#### 1. Clone the Repository
```bash
git clone <your-repository-url>
cd JobOffers
```

#### 2. Install Backend Dependencies
```bash
cd backend
npm install
```

#### 3. Install Frontend Dependencies
```bash
cd ../frontend
npm install
```

#### 4. Set Up Environment Variables

Create a `.env` file in the `backend` directory:
```bash
cd ../backend
cp .env.example .env
```

Edit the `.env` file with your configuration:
```env
PORT=4000
MONGODB_URI=mongodb://localhost:27017/jobconnect
JWT_SECRET=your-super-secret-jwt-key-here
```

#### 5. Start MongoDB (Choose one option)

**Option A: Using Docker (Recommended)**
```bash
# From the project root directory
docker-compose up -d
```

**Option B: Local MongoDB Installation**
- Install MongoDB locally
- Start MongoDB service
- The app will connect to `mongodb://localhost:27017/jobconnect`

**Option C: MongoDB Atlas (Cloud)**
- Create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
- Create a cluster and get your connection string
- Update `MONGODB_URI` in `.env` with your Atlas connection string

#### 6. Start the Backend Server
```bash
cd backend
npm run dev
```
The backend will start on `http://localhost:4000`

#### 7. Start the Frontend Development Server
```bash
# Open a new terminal window
cd frontend
npm run dev
```
The frontend will start on `http://localhost:5173`

#### 8. Open the Application
Visit `http://localhost:5173` in your browser to see the application!

## 🏗️ Project Structure

```
JobOffers/
├── backend/                 # Node.js/Express API
│   ├── src/
│   │   ├── domain/         # Database models
│   │   ├── server/         # Server configuration
│   │   └── web/           # API routes and controllers
│   ├── package.json
│   └── .env               # Environment variables
├── frontend/              # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/        # Page components
│   │   └── App.tsx       # Main app component
│   └── package.json
├── docker-compose.yml     # MongoDB Docker setup
└── README.md
```

## 🛠️ Available Scripts

### Backend Scripts
```bash
cd backend
npm run dev      # Start development server with hot reload
npm run build    # Build for production
npm run start    # Start production server
```

### Frontend Scripts
```bash
cd frontend
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Backend server port | `4000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/jobconnect` |
| `JWT_SECRET` | Secret key for JWT tokens | Required |

### MongoDB Setup Options

1. **Docker (Easiest)**: Run `docker-compose up -d`
2. **Local Installation**: Install MongoDB locally
3. **MongoDB Atlas**: Use cloud MongoDB service

## 🚨 Troubleshooting

### Common Issues

**1. Port Already in Use**
```bash
# Kill processes using ports 4000 or 5173
lsof -ti:4000 | xargs kill -9
lsof -ti:5173 | xargs kill -9
```

**2. MongoDB Connection Issues**
- Make sure MongoDB is running
- Check your `MONGODB_URI` in `.env`
- For Docker: `docker-compose logs mongodb`

**3. Node Modules Issues**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**4. Frontend Not Loading**
- Check if backend is running on port 4000
- Check browser console for errors
- Verify Vite proxy configuration

### Getting Help

If you encounter issues:
1. Check the console logs for error messages
2. Ensure all dependencies are installed
3. Verify environment variables are set correctly
4. Make sure MongoDB is running and accessible

## 🎯 Features

- ✅ **Modern UI**: Glassmorphism design with smooth animations
- ✅ **Interactive Map**: Leaflet map with job location markers
- ✅ **Job Listings**: Search and filter job opportunities
- ✅ **Responsive Design**: Works on desktop and mobile
- ✅ **Real-time Data**: Live job data from API
- ✅ **Modular Architecture**: Easy to extend and customize

## 🔮 Next Steps

- [ ] User authentication system
- [ ] User profiles and dashboards
- [ ] Admin panel for job management
- [ ] Payment integration
- [ ] Mobile app
- [ ] WordPress widget

## 📝 License

This project is licensed under the MIT License.

---

**Need help?** Check the troubleshooting section above or create an issue in the repository.