
# Realtime Chat App

A full-stack realtime chat application built with Node.js, Express, MongoDB, and Socket.IO.

## Features

- User authentication (signup, login, logout, password reset)
- Realtime messaging with Socket.IO
- Profile image upload and management using Cloudinary
- Email notifications using Nodemailer
- RESTful API for user and message management
- Input validation and error handling
- Secure password hashing with bcrypt
- Role-based access control

## Project Structure

```
Backend/
├── Config/
│   ├── cloudinary.js         # Cloudinary configuration
│   └── dbConnection.js       # MongoDB connection setup
├── Controllers/
│   ├── auth.controller.js    # Authentication logic
│   ├── message.controller.js # Message handling logic
│   └── user.controller.js    # User management logic
├── Middleware/
│   ├── auth.middlewere.js    # Authentication middleware
│   ├── Error.Middlewere.js   # Global error handler
│   ├── upload-image.middleware.js # Image upload middleware
│   └── validators.Middlewere.js   # Input validation middleware
├── Models/
│   ├── message.model.js      # Message schema
│   └── user.model.js         # User schema
├── Routes/
│   ├── auth.route.js         # Authentication routes
│   ├── message.route.js      # Message routes
│   ├── server.js             # Route mounting
│   └── user.route.js         # User routes
├── Utils/
│   ├── ApiError.js           # Custom error class
│   ├── send-email.js         # Email sending utility
│   ├── socket.io.js          # Socket.IO setup
│   └── user.seeds.js         # User seeding script
├── .gitignore                # Ignored files and directories
├── package.json              # Project dependencies and scripts
└── server.js                 # Main server file
```

## Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/your-username/realtime-chat-app.git
   cd realtime-chat-app/Backend
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

3. Create a `.env` file in the `Backend` directory and add the following environment variables:
   ```
   DB_URI=your-mongodb-uri
   JWT_SECRET=your-jwt-secret
   JWT_EXPIRATION=1d
   MAIL_HOST=your-mail-host
   MAIL_PORT=your-mail-port
   MAIL_USER=your-mail-user
   MAIL_PASS=your-mail-password
   CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
   CLOUDINARY_API_KEY=your-cloudinary-api-key
   CLOUDINARY_API_SECRET=your-cloudinary-api-secret
   ```

4. Seed the database (optional):
   ```sh
   node user.seeds.js
   ```

5. Start the development server:
   ```sh
   npm run dev
   `

``## API Endpoints

### Authentication
- `POST /api/auth/signup` - User signup
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/forgotpassword` - Forgot password
- `POST /api/auth/verifyresetcode` - Verify reset code
- `PUT /api/auth/resetpassword` - Reset password

### Users
- `GET /api/users` - Get all users (except the logged-in user)
- `PUT /api/users` - Update user profile

### Messages
- `GET /api/messages/:userId` - Get all messages between two users
- `POST /api/messages/send/:id` - Send a message

## Technologies Used

- **Backend**: Node.js, Express, MongoDB, Mongoose
- **Realtime Communication**: Socket.IO
- **Authentication**: JWT, bcrypt
- **File Uploads**: Multer, Cloudinary
- **Email**: Nodemailer
- **Validation**: express-validator
- **Error Handling**: Custom error classes and middleware

## License

This project is licensed under the MIT License.
```

You can replace placeholders like `your-username` and `your-mongodb-uri` with actual values. Let me know if you need further customization!You can replace placeholders like `your-username` and `your-mongodb-uri` with actual values. Let me know if you need further customization!
