import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { addEmailJob } from '../queues/emailQueue';

const router = Router();
const prisma = new PrismaClient();

// Schedule Emails
router.post('/schedule', async (req, res) => {
    const { userId, emails, subject, body, startTime, delaySeconds = 0, hourlyLimit } = req.body;

    // Basic validation
    if (!userId || !emails || !emails.length || !subject || !body) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const scheduledTime = new Date(startTime || Date.now());
    const initialDelay = Math.max(scheduledTime.getTime() - Date.now(), 0);

    // Calculate effective interval per email
    let interval = 2000; // Default 2s min delay
    if (delaySeconds) {
        interval = Math.max(interval, parseInt(delaySeconds) * 1000);
    }
    if (hourlyLimit) {
        const rateLimitInterval = Math.floor(3600000 / parseInt(hourlyLimit));
        interval = Math.max(interval, rateLimitInterval);
    }

    try {
        const jobs = await Promise.all(emails.map(async (to: string, index: number) => {
            // Staggered delay: Initial Wait + (Index * Interval)
            const jobSpecificDelay = initialDelay + (index * interval);
            const jobScheduleTime = new Date(Date.now() + jobSpecificDelay);

            // Create DB entry
            const job = await prisma.emailJob.create({
                data: {
                    userId,
                    to,
                    subject,
                    body,
                    scheduleTime: jobScheduleTime,
                    status: 'PENDING'
                }
            });

            // Add to BullMQ with calculated delay
            // Note: BullMQ delay is relative to "now"
            await addEmailJob({ emailJobId: job.id }, jobSpecificDelay);
            return job;
        }));

        res.json({ message: 'Emails scheduled', count: jobs.length });
    } catch (error: any) {
        console.error('Error scheduling emails:', error);
        res.status(500).json({ error: 'Failed to schedule emails' });
    }
});

// Get Scheduled Emails (Pending/Delayed)
router.get('/scheduled', async (req, res) => {
    try {
        const jobs = await prisma.emailJob.findMany({
            where: {
                status: {
                    in: ['PENDING', 'DELAYED']
                }
            },
            orderBy: { scheduleTime: 'asc' }
        });
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch scheduled emails' });
    }
});

// Get Sent Emails (Completed)
router.get('/sent', async (req, res) => {
    try {
        const jobs = await prisma.emailJob.findMany({
            where: { status: 'COMPLETED' },
            orderBy: { sentAt: 'desc' }
        });
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch sent emails' });
    }
});

export default router;
