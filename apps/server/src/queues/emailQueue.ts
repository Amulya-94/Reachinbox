import { Queue } from 'bullmq';
import connection from '../config/redis';

export const emailQueue = new Queue('email-queue', {
    connection,
    defaultJobOptions: {
        attempts: 3,
        backoff: {
            type: 'exponential',
            delay: 1000,
        },
        removeOnComplete: true,
    },
});

export const addEmailJob = async (data: any, delay?: number) => {
    return await emailQueue.add('send-email', data, {
        delay: delay || 0,
    });
};
