import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
import express from 'express';
import cookieParser from 'cookie-parser';

const app = express();
const PORT = process.env.PORT || 8080;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());

import connectToDB from './db/connection/index.js';
connectToDB();


// import routes
import register from './routes/auth/register.js';
app.use('/api', register);
import login from './routes/auth/login.js';
app.use('/api', login);
import user from './routes/user/index.js';
app.use('/api', user);

app.use('/*', (req, res) => {
    res.status(404).json({
        status: 0,
        message: 'Route Not found',
    });
})

app.listen(PORT, () => {
    console.log(`Listening on http://localhost:${PORT}`);
})