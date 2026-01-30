import { Router } from 'express';
import passport from 'passport';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
        res.redirect('http://localhost:3000/dashboard');
    }
);

// Mock Login Route for Testing/Demo
router.get('/mock', async (req, res, next) => {
    try {
        // Find or create a mock user
        const user = await prisma.user.upsert({
            where: { email: 'demo@reachinbox.com' },
            update: {},
            create: {
                email: 'demo@reachinbox.com',
                name: 'Demo User',
                googleId: 'mock-google-id-123'
            }
        });

        // Manually log the user in using Passport's req.login
        req.login(user, (err) => {
            if (err) return next(err);
            return res.redirect('http://localhost:3000/dashboard');
        });
    } catch (error) {
        next(error);
    }
});

router.get('/me', (req, res) => {
    if (req.isAuthenticated()) {
        res.json({ user: req.user });
    } else {
        res.status(401).json({ error: 'Not authenticated' });
    }
});

router.post('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);
        res.json({ message: 'Logged out' });
    });
});

export default router;
