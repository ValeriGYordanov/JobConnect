# C2C Job Offerings Library

A modular web library for displaying consumer-to-consumer daily job offerings, similar to Airbnb but for temporary jobs.

## Features

- **Offering Management**: Create and display job offerings with location, payment, and time details
- **Map Integration**: Leaflet-based map view with OpenStreetMap
- **Search & Filter**: Filter by location, payment range, and keywords
- **User System**: User profiles with ratings (placeholder)
- **Admin Dashboard**: Moderation tools (placeholder)
- **Modular Design**: Abstract "Offering" model supports future expansion (rentals, courses, etc.)

## Quick Start

### Prerequisites

- Node.js (LTS version)
- MongoDB (local or Atlas)

### Installation

1. **Clone and install dependencies:**
   ```bash
   git clone <your-repo>
   cd JobOffers
   
   # Backend
   cd backend
   npm install
   
   # Frontend  
   cd ../frontend
   npm install
   ```

2. **Set up environment:**
   ```bash
   # Copy backend environment template
   cp backend/.env.example backend/.env
   # Edit backend/.env with your MongoDB URI
   ```

3. **Start development servers:**
   ```bash
   # Terminal 1 - Backend API
   cd backend
   npm run dev
   
   # Terminal 2 - Frontend
   cd frontend  
   npm run dev
   ```

4. **Access the application:**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:4000

### Database Setup

**Option 1: Local MongoDB with Docker**
```bash
docker compose up -d mongo
```

**Option 2: MongoDB Atlas (Cloud)**
1. Create free account at https://cloud.mongodb.com
2. Create cluster and get connection string
3. Update `MONGODB_URI` in `backend/.env`

**Option 3: Local MongoDB Installation**
```bash
# macOS with Homebrew
brew install mongodb-community
brew services start mongodb-community
```

## Project Structure

```
JobOffers/
├── backend/                 # Express.js API server
│   ├── src/
│   │   ├── domain/         # Data models (User, Offering, Application, Rating)
│   │   ├── server/         # App setup and MongoDB connection
│   │   └── web/            # API routes and controllers
│   └── package.json
├── frontend/               # React + Vite application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   └── App.tsx         # Main app with routing
│   └── package.json
└── docker-compose.yml      # MongoDB container
```

## API Endpoints

- `GET /api/health` - Health check
- `GET /api/offerings` - List offerings (with query params for filtering)
- `POST /api/offerings` - Create new offering
- `GET /api/offerings/:id` - Get specific offering

## Technology Stack

- **Frontend**: React 19, TypeScript, Vite, TailwindCSS, Leaflet
- **Backend**: Node.js, Express, TypeScript, MongoDB, Mongoose
- **Maps**: Leaflet with OpenStreetMap (free)
- **UI**: TailwindCSS for responsive design

## Development

### Backend Development
```bash
cd backend
npm run dev    # Start with nodemon
npm run build  # Compile TypeScript
npm start      # Run compiled JS
```

### Frontend Development  
```bash
cd frontend
npm run dev    # Start Vite dev server
npm run build  # Build for production
npm run preview # Preview production build
```

## Next Steps

1. **Add MongoDB**: Set up database connection
2. **Seed Data**: Add sample offerings for testing
3. **Authentication**: Implement user login/registration
4. **Widget Mode**: Build embeddable JavaScript widget
5. **Payments**: Add Stripe/PayPal integration placeholders
6. **WordPress Plugin**: Create WordPress integration

## Environment Variables

Create `backend/.env`:
```
PORT=4000
MONGODB_URI=mongodb://localhost:27017/joboffers
JWT_SECRET=your-secret-key
```

## Contributing

This is a modular library designed for easy integration into other websites. The abstract "Offering" model allows for future expansion to other types of C2C services.

## License

MIT
