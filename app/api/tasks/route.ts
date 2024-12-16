import { NextRequest } from 'next/server';

interface Task {
    id: number;
    title: string;
    date: string; // ISO string representation of DateTime
    userId: number;
}

let tasks: Task[] = [];

export async function POST(req: NextRequest) {
    const { title, date, userId } = await req.json();
    if (!title || !date || isNaN(userId)) {
        return new Response(JSON.stringify({ message: 'Title, date, and userId are required' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }
    const id = tasks.length ? tasks[tasks.length - 1].id + 1 : 1;
    const newTask = { id, title, date, userId };
    tasks.push(newTask);
    return new Response(JSON.stringify(newTask), {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
    });
}

export async function GET() {
    return new Response(JSON.stringify(tasks), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
    });
}
