import prisma from '@/lib/prisma';
import superjson from 'superjson';

export default async function handler(_, res) {
    const tasks = await prisma.task.findMany();
    const tasksJson = superjson.stringify(tasks);

    return res.status(200).json({ message: 'Task successfully sorted.', tasks: tasksJson });
}