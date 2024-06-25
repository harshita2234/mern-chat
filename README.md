# marn-chat app

This is a chat application built using the MERN stack (MongoDB, Express, React, Node.js). The backend API connects to MongoDB and the frontend is developed with React. 

The project is deployed locally using `nodemon` for the backend and `yarn dev` for the frontend folder.

## Technologies Used

### Backend
- **Node.js**: JavaScript runtime environment that executes JavaScript code outside a web browser.
- **Express**: Fast, unopinionated, minimalist web framework for Node.js, used for building the API.
- **MongoDB**: NoSQL database for storing user data and messages.
- **Mongoose**: Elegant MongoDB object modeling for Node.js.
- **JWT (jsonwebtoken)**: For user authentication and securing API routes.
- **bcryptjs**: Library to hash passwords.
- **ws**: A simple WebSocket library for real-time communication.
- **dotenv**: Loads environment variables from a `.env`.
- **cors**: Middleware for enabling CORS (Cross-Origin Resource Sharing).
- **cookie-parser**: Middleware to parse cookies.

### Frontend
- **React**: JavaScript library for building user interfaces.
- **Vite**: Next-generation frontend tooling for building modern web applications.
- **Axios**: Promise-based HTTP client for the browser and Node.js.
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development.
- **Lodash**: Utility library providing many useful functions for common programming tasks.

## Prerequisites

Make sure you have the following installed:

- Node.js
- Yarn
- MongoDB

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/mern-chat-app.git
   cd mern-chat-app
   ```

2. **Install dependencies for the API:**

   ```bash
   cd api
   yarn install
   ```

3. **Install dependencies for the client:**

   ```bash
   cd ../client
   yarn install
   ```
## Dependencies

### Backend (api)

```json
{
  "bcryptjs": "^2.4.3",
  "cookie-parser": "^1.4.6",
  "cors": "^2.8.5",
  "dotenv": "^16.4.5",
  "express": "^4.19.2",
  "jsonwebtoken": "^9.0.2",
  "mongoose": "^8.4.3",
  "ws": "^8.17.1"
}
```

### Frontend (client)

```json
{
  "autoprefixer": "^10.4.19",
  "axios": "^1.7.2",
  "lodash": "^4.17.21",
  "postcss": "^8.4.38",
  "react": "^18.3.1",
  "react-dom": "^18.3.1",
  "tailwind": "^4.0.0",
  "tailwindcss": "^3.4.4"
}
```
## Environment Variables

Create a `.env` file in the `api` directory with the following content:

```env
MONGO_URL="your_mongo_url"
JWT_SECRET="your_jwt_secret"
CLIENT_URL="http://localhost:____"
```

Replace `your_mongo_url` and `your_jwt_secret` with your actual MongoDB connection string and JWT secret key.

## Running the Application

1. **Start the backend server:**

   Navigate to the `api` directory and run:

   ```bash
   nodemon index.js
   ```

2. **Start the frontend server:**

   Navigate to the `client` directory and run:

   ```bash
   yarn dev
   ```

The application should now be running on `http://localhost:____`.

## License

This project is licensed under the MIT License.
