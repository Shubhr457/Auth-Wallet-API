require('dotenv').config();
const express = require("express");
const cors = require('cors');
const {connectToMongoDB} = require("./config/connect");
const userRoutes = require('./routes/userRoutes')
const transaction = require('./routes/transaction');

const app = express();
const port = process.env.PORT; 
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
