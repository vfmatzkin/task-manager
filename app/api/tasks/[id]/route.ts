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
    const newTask: Task = { id, title, date, userId };
    tasks.push(newTask);
    return new Response(JSON.stringify(newTask), {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
    });
}

export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    const taskId = parseInt(params.id);
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        return new Response(JSON.stringify(task), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } else {
        return new Response(JSON.stringify({ message: 'Task not found' }), {
            status: 404,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}

export async function PUT(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    const taskId = parseInt(params.id);
    const body: Partial<Task> = await req.json();
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    if (taskIndex !== -1) {
        tasks[taskIndex] = { ...tasks[taskIndex], ...body };
        return new Response(JSON.stringify(tasks[taskIndex]), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } else {
        return new Response(JSON.stringify({ message: 'Task not found' }), {
            status: 404,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    const taskId = parseInt(params.id);
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    if (taskIndex !== -1) {
        tasks.splice(taskIndex, 1);
        return new Response(JSON.stringify({ message: 'Task deleted' }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } else {
        return new Response(JSON.stringify({ message: 'Task not found' }), {
            status: 404,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
