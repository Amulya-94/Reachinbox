import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

import session from 'express-session';
import passport from './config/passport';
import authRoutes from './routes/authRoutes';
import emailRoutes from './routes/emailRoutes';
import './worker';

app.use(cors({ origin: 'http://localhost:3000', credentials: true })); // Allow frontend
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

app.use(session({
    secret: process.env.SESSION_SECRET || 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Set to true if pending https
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', authRoutes);
app.use('/api/email', emailRoutes);

app.get('/', (req, res) => {
    res.send('ReachInbox Scheduler API');
});

const start = async () => {
    try {
        await prisma.$connect();
        console.log('Database connected');
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Error starting server', error);
        process.exit(1);
    }
};

start();
