import { Worker, Job } from 'bullmq';
import connection from './config/redis';
import nodemailer from 'nodemailer';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Configure Nodemailer for Ethereal
const createTransporter = async () => {
    let user = process.env.ETHEREAL_USER;
    let pass = process.env.ETHEREAL_PASS;

    if (!user || !pass) {
        // Generate a test account dynamically if not provided
        const testAccount = await nodemailer.createTestAccount();
        user = testAccount.user;
        pass = testAccount.pass;
        // console.log('Generated Ethereal Credentials:', { user, pass });
    }

    return nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: { user, pass }
    });
};

const MIN_DELAY_BETWEEN_EMAILS = 2000; // 2 seconds

const processor = async (job: Job) => {
    const { emailJobId } = job.data;

    // Fetch job details from DB
    const emailJob = await prisma.emailJob.findUnique({
        where: { id: emailJobId }
    });

    if (!emailJob) return;

    try {
        console.log(`Processing Job ${job.id} for ${emailJob.to}`);

        // Simulate delay (throttling)
        await new Promise(resolve => setTimeout(resolve, MIN_DELAY_BETWEEN_EMAILS));

        const transporter = await createTransporter();
        const info = await transporter.sendMail({
            from: '"ReachInbox Scheduler" <scheduler@reachinbox.com>',
            to: emailJob.to,
            subject: emailJob.subject,
            text: emailJob.body,
        });

        console.log(`Message sent: ${info.messageId}`);
        console.log(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);

        // Update DB
        await prisma.emailJob.update({
            where: { id: emailJobId },
            data: {
                status: 'COMPLETED',
                sentAt: new Date(),
                bullMessageId: info.messageId
            }
        });

    } catch (err: any) {
        console.error(`Job ${job.id} failed:`, err);
        await prisma.emailJob.update({
            where: { id: emailJobId },
            data: {
                status: 'FAILED',
                failedAt: new Date(),
                error: err.message
            }
        });
        throw err;
    }
};

const worker = new Worker('email-queue', processor, {
    connection,
    limiter: {
        max: 50, // 50 emails per hour
        duration: 3600000 // 1 hour
    },
    concurrency: 5 // Process up to 5 jobs in parallel (but limited by rate limiter)
});

worker.on('completed', job => {
    console.log(`Job ${job.id} completed!`);
});

worker.on('failed', (job, err) => {
    console.log(`Job ${job?.id} failed with ${err.message}`);
});

export default worker;
