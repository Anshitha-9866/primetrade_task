# Full-Stack Web Application with Authentication & Dashboard

This repository contains a complete full-stack web application built with the MERN stack (MongoDB, Express, React, Node.js) and designed for scalability and security. The application features JWT-based authentication, protected routes, and full CRUD functionality for a sample "Task" entity.

## Features

### Core Features
- **Frontend (React + Vite):** A modern, fast, and responsive user interface.
- **Backend (Node.js + Express):** A robust and scalable RESTful API.
- **Database (MongoDB):** Flexible NoSQL database for storing user and task data.
- **Authentication:** Secure user registration and login using JSON Web Tokens (JWT).
- **Protected Routes:** Dashboard and API endpoints are protected and accessible only to authenticated users.
- **CRUD Operations:** Full Create, Read, Update, and Delete functionality for tasks.
- **Responsive Design:** The UI is fully responsive and built with Tailwind CSS.

### Technical Details
- **Password Hashing:** User passwords are securely hashed using `bcryptjs`.
- **Environment Variables:** Secure management of configuration and secrets using `.env` files.
- **Centralized Error Handling:** Consistent error responses across the backend API.
- **API Interceptors:** Axios interceptors on the frontend to automatically manage JWT tokens and handle authentication errors.
- **State Management:** Global authentication state is managed on the frontend using React's Context API.

---

## Project Structure

The project is organized into two main directories: `frontend` and `backend`.

### Backend Structure
```
backend/
├── src/
│   ├── config/
│   │   ├── database.js      # MongoDB connection
│   │   └── jwt.js           # JWT configuration
│   ├── controllers/
│   │   ├── authController.js # Signup and login logic
│   │   ├── userController.js # User profile logic
│   │   └── taskController.js # Task CRUD logic
│   ├── middleware/
│   │   ├── auth.js          # JWT verification middleware
│   │   └── errorHandler.js  # Centralized error handler
│   ├── models/
│   │   ├── User.js          # User database schema
│   │   └── Task.js          # Task database schema
│   ├── routes/
│   │   ├── authRoutes.js    # /api/auth routes
│   │   ├── userRoutes.js    # /api/user routes
│   │   └── taskRoutes.js    # /api/tasks routes
│   └── utils/
│       └── tokenUtils.js    # JWT generation utility
├── .env.example             # Example environment variables
├── package.json
└── server.js                # Application entry point
```

### Frontend Structure
```
frontend/
├── src/
│   ├── components/          # Reusable UI components (optional)
│   ├── context/
│   │   └── AuthContext.jsx  # Global authentication state
│   ├── hooks/
│   │   └── useAuth.js       # Custom hook for using AuthContext
│   ├── pages/
│   │   ├── Dashboard.jsx
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Signup.jsx
│   │   └── NotFound.jsx
│   ├── routes/
│   │   ├── AppRoutes.jsx    # Main application router
│   │   └── ProtectedRoute.jsx # Wrapper for protected routes
│   ├── services/
│   │   ├── api.js           # Axios instance with interceptors
│   │   ├── authService.js   # Authentication API calls
│   │   └── taskService.js   # Task API calls
│   ├── styles/
│   │   └── index.css        # Global styles and Tailwind imports
│   ├── App.jsx              # Root component
│   └── main.jsx             # Application entry point
├── .env.example             # Example environment variables
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
└── vite.config.js
```
---

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine.

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or later)
- [npm](https://www.npmjs.com/)
- [MongoDB](https://www.mongodb.com/try/download/community) (or a MongoDB Atlas account)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd <repository-folder>
    ```

2.  **Set up the Backend:**
    - Navigate to the `backend` directory:
      ```bash
      cd backend
      ```
    - Install dependencies:
      ```bash
      npm install
      ```
    - Create a `.env` file by copying the example:
      ```bash
      cp .env.example .env
      ```
    - Edit the `.env` file and provide your own values:
      ```
      NODE_ENV=development
      PORT=5000
      MONGODB_URI=<your_mongodb_connection_string>
      JWT_SECRET=<your_super_secret_key_of_at_least_32_characters>
      JWT_EXPIRE=7d
      ```

3.  **Set up the Frontend:**
    - Navigate to the `frontend` directory:
      ```bash
      cd ../frontend
      ```
    - Install dependencies:
      ```bash
      npm install
      ```
    - Create a `.env` file by copying the example:
      ```bash
      cp .env.example .env
      ```
    - The `VITE_API_URL` should already be configured to `http://localhost:5000/api`, which is correct for local development.

### Running the Application

1.  **Start the Backend Server:**
    - From the `backend` directory, run:
      ```bash
      npm run dev
      ```
    - The backend server will start on `http://localhost:5000`.

2.  **Start the Frontend Development Server:**
    - In a separate terminal, from the `frontend` directory, run:
      ```bash
      npm run dev
      ```
    - The frontend application will be available at `http://localhost:5173` (or another port if 5173 is in use).

You can now open your browser and navigate to the frontend URL to use the application.

---

## API Documentation

The backend exposes the following RESTful API endpoints.

#### Auth Routes
- `POST /api/auth/signup`: Register a new user.
- `POST /api/auth/login`: Log in a user and receive a JWT.

#### User Routes (Protected)
- `GET /api/user/profile`: Get the profile of the currently authenticated user.
- `PUT /api/user/profile`: Update the profile of the currently authenticated user.

#### Task Routes (Protected)
- `GET /api/tasks`: Get all tasks for the authenticated user.
- `POST /api/tasks`: Create a new task.
- `GET /api/tasks/:id`: Get a single task by its ID.
- `PUT /api/tasks/:id`: Update a task by its ID.
- `DELETE /api/tasks/:id`: Delete a task by its ID.

---

## Scaling Notes

This application is built with scalability in mind. Here are some ways it could be scaled for a production environment:

- **Horizontal Scaling:** The backend is stateless (due to JWT), so it can be scaled horizontally by deploying multiple instances behind a load balancer.
- **Database Optimization:**
    - **Read Replicas:** For read-heavy workloads, MongoDB read replicas can be used to distribute read operations.
    - **Indexing:** Proper indexing on `User` and `Task` models would be crucial to ensure fast query performance as data grows.
- **Caching:** A caching layer like Redis could be introduced to cache frequently accessed data, such as user sessions or popular tasks, reducing database load.
- **Microservices:** For very large applications, the backend could be split into microservices (e.g., an `auth-service`, a `user-service`, and a `task-service`), each with its own dedicated database and deployment pipeline.
- **Frontend Performance:**
    - **Code Splitting:** Lazy load routes and components to reduce the initial bundle size.
    - **CDN:** Serve static assets (images, CSS, JS) from a Content Delivery Network (CDN) to reduce latency for users worldwide.
- **Security Enhancements:**
    - **Refresh Tokens:** Implement a refresh token strategy for a more secure and seamless long-term user session.
    - **Rate Limiting:** Implement stricter rate limiting to prevent abuse of the API.
