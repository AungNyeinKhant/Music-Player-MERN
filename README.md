# Music Player Application

A full-stack music player application built with modern web technologies,
featuring real-time updates, user authentication, and a responsive design.

## 🚀 Tech Stack

### Frontend

- **Framework:** React 18 with TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **State Management:** React Context
- **Form Handling:** Formik with Yup validation
- **Data Visualization:** Chart.js with react-chartjs-2
- **HTTP Client:** Axios
- **Real-time Communication:** Socket.IO Client
- **Routing:** React Router DOM
- **Security:** crypto-js, jwt-decode

### Backend

- **Runtime:** Node.js with TypeScript
- **Framework:** Express.js
- **Database ORM:** Prisma
- **Authentication:** Passport.js with JWT
- **Real-time Server:** Socket.IO
- **File Upload:** Multer
- **Validation:** Zod
- **Logging:** Winston with daily rotate file
- **Security:** Helmet, bcrypt
- **API Documentation:** Available in the `/docs` directory

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Mongodb (for Prisma)

## 🛠️ Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd MusicPlayer
   ```

2. **Backend Setup**

   ```bash
   cd backend
   npm install

   # Configure environment variables
   cp .env.example .env
   # Edit .env with your database credentials and JWT secret

   # Setup database
   npx prisma generate
   npx prisma migrate dev

   # Start development server
   npm run dev
   ```

3. **Frontend Setup**

   ```bash
   cd frontend
   npm install

   # Configure environment variables
   cp .env.example .env
   # Edit .env with your backend API URL

   # Start development server
   npm run dev
   ```

## 🚦 Available Scripts

### Backend

- `npm run dev` - Start development server with hot-reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm test` - Run tests

### Frontend

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 📁 Project Structure

```
MusicPlayer/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── types/
│   │   └── utils/
│   └── public/
└── backend/
    ├── src/
    │   ├── controllers/
    │   ├── services/
    │   ├── routes/
    │   ├── middleware/
    │   ├── socket/
    │   ├── types/
    │   └── utils/
    └── prisma/
```

## 🔐 Environment Variables

### Backend (.env)

```
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
JWT_SECRET="your-jwt-secret"
PORT=3000
```

### Frontend (.env)

```
VITE_API_URL="http://localhost:3000"
VITE_WS_URL="ws://localhost:3000"
```

## 🌟 Features

- User authentication and authorization
- Real-time music playback synchronization
- Playlist management
- User profile customization
- Music upload and management
- Real-time chat
- Analytics and statistics
- Responsive design for all devices

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file
for details.

## 👥 Authors

- Your Name - Initial work

## 🙏 Acknowledgments

- Hat tip to anyone whose code was used
- Inspiration
- etc

# Docker Build the image

docker build -t music-player-backend .

# Docker Run the container

docker run -p 3000:3000 -d music-player-backend
