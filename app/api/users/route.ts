import { NextRequest } from 'next/server';

interface User {
    id: number;
    name: string;
    email: string;
}

let users: User[] = [];

export async function POST(req: NextRequest) {
    const { name, email } = await req.json();
    if (!name || !email) {
        return new Response(JSON.stringify({ message: 'Name and email are required' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }
    const id = users.length ? users[users.length - 1].id + 1 : 1;
    const newUser = { id, name, email };
    users.push(newUser);
    return new Response(JSON.stringify(newUser), {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
    });
}

export async function GET() {
    return new Response(JSON.stringify(users), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
    });
}
