import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import { connectToMongoDB } from './config/connect';
import userRoutes from './routes/userRoutes';
import transaction from './routes/transaction';
const app = express();
const port = process.env.PORT; // Ensure this matches your .env file (case-sensitive)
const DATABASE_URL = process.env.DATABASE_URL;

app.use(cors());
app.use(express.json());

app.use("/api/user", userRoutes)
app.use('/api/transactions', transaction);



connectToMongoDB(DATABASE_URL).then(() => {
  console.log('Connected to MongoDB');
}).catch((error) => {
  console.error('Error connecting to MongoDB:', error);
});

app.listen(port, () => {
    console.log(`Server is running at ${port}`);
});
