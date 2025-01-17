# Auth Wallet API

Hosted URL: [https://auth-wallet-api.onrender.com](https://auth-wallet-api.onrender.com)  
Postman Documentation URL: [https://documenter.getpostman.com/view/36572624/2sA3kPp4UP](https://documenter.getpostman.com/view/36572624/2sA3kPp4UP) .
This is an authentication wallet API built with Node.js, Express.js, MongoDB, Mongoose, JWT (JSON Web Token), and bcrypt. The API provides user registration and login functionality, ensuring secure authentication using JWT and password hashing with bcrypt.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Endpoints](#endpoints)
- [Authentication](#authentication)
- [Error Handling](#error-handling)
- [Contributing](#contributing)
- [License](#license)
- [Example Code Snippets](#example-code-snippets)
- [Testing with Postman](#testing-with-postman)
- [Screenshots](#screenshots)

## Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/yourusername/auth-wallet-api.git
    ```

2. Navigate to the project directory:

    ```bash
    cd auth-wallet-api
    ```

3. Install the dependencies:

    ```bash
    npm install
    ```

4. Set up environment variables:

    Create a `.env` file in the root directory and add the following variables:

    ```bash
    PORT=5000
    MONGO_URI=your_mongodb_uri
    JWT_SECRET=your_jwt_secret
    ```

5. Start the server:

    ```bash
    npm start
    ```

    The server should be running on `http://localhost:5000`.

## Usage

### Register a New User

To register a new user, send a `POST` request to `/api/auth/register` with the following JSON payload:

```json
{
    "username": "exampleuser",
    "email": "user@example.com",
    "password": "examplepassword"
}
```

### Login

To login, send a `POST` request to `/api/auth/login` with the following JSON payload:

```json
{
    "email": "user@example.com",
    "password": "examplepassword"
}
```

If the login is successful, you will receive a JWT token in the response.

## Endpoints

### Register

- **URL**: `/api/auth/register`
- **Method**: `POST`
- **Description**: Registers a new user.
- **Request Body**:

    ```json
    {
        "username": "exampleuser",
        "email": "user@example.com",
        "password": "examplepassword"
    }
    ```

- **Response**:

    ```json
    {
        "message": "User registered successfully"
    }
    ```

### Login

- **URL**: `/api/auth/login`
- **Method**: `POST`
- **Description**: Logs in an existing user.
- **Request Body**:

    ```json
    {
        "email": "user@example.com",
        "password": "examplepassword"
    }
    ```

- **Response**:

    ```json
    {
        "token": "your_jwt_token"
    }
    ```

## Authentication

This API uses JWT for authentication. Include the JWT token in the `Authorization` header of requests to protected routes.

Example:

```http
Authorization: Bearer your_jwt_token
```

## Error Handling

The API returns appropriate HTTP status codes and error messages for different error scenarios, such as invalid input, unauthorized access, and server errors.

## Contributing

Contributions are welcome! Please create a pull request or open an issue to discuss your changes.

## License

This project is licensed under the MIT License.

## Example Code Snippets

### User Model

```javascript
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
```

### Register Route

```javascript
const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User');

const router = express.Router();

router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            username,
            email,
            password: hashedPassword
        });

        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
```

### Login Route

```javascript
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
```

## Testing with Postman

1. **Register User**:
    - Set the method to `POST`.
    - URL: `http://localhost:5000/api/auth/register`
    - Body: 
        ```json
        {
            "username": "exampleuser",
            "email": "user@example.com",
            "password": "examplepassword"
        }
        ```

2. **Login User**:
    - Set the method to `POST`.
    - URL: `http://localhost:5000/api/auth/login`
    - Body: 
        ```json
        {
            "email": "user@example.com",
            "password": "examplepassword"
        }
        ```

    - Copy the token from the response and include it in the `Authorization` header for protected routes.

## Screenshots

### Postman Collection

![Screenshot 2024-07-17 202550](https://github.com/user-attachments/assets/abeb2a08-f250-4251-b084-43eaa4d6c72c)
![Screenshot 2024-07-17 202536](https://github.com/user-attachments/assets/6b74af6b-5d4e-4c00-8d1c-048ce920a64d)
![Screenshot 2024-07-17 202522](https://github.com/user-attachments/assets/b5b0365c-f7c5-4f17-9117-c08af21e5823)
![Screenshot 2024-07-17 202504](https://github.com/user-attachments/assets/93e6f0f5-6bcc-465a-86a5-f0bbf0a90b77)
![Screenshot 2024-07-17 202447](https://github.com/user-attachments/assets/b18617d5-7e01-48ac-a46a-dd0411874bca)


