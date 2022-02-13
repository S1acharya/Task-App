import prisma from '@/lib/prisma';
import superjson from 'superjson';

export default async function handler(_, res) {
    const tasks = await prisma.task.findMany({ orderBy: { completed_at: 'asc' } });
    const tasksJson = superjson.stringify(tasks);

    return res.status(200).json({ message: 'Task successfully sorted.', tasks: tasksJson });
}