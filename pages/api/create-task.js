import prisma from '@/lib/prisma';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(400).json({ message: 'Only POST requests allowed' })
    }

    const task = await prisma.task.create({ data: req.body });

    return res.status(200).json({ message: 'Task successfully created.', id: task.id })
}