import prisma from '@/lib/prisma';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(400).json({ message: 'Only POST requests allowed' });
    }

    await prisma.task.delete({ where: { id: req.body.id } });

    return res.status(200).json({ message: 'Task successfully deleted.' });
}