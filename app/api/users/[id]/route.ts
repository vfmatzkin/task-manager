import { NextRequest } from 'next/server';

interface User {
    id: number;
    name: string;
    email: string;
}

let users: User[] = [];

export async function POST(req: NextRequest) {
    console.log('POST request received');
    const idParam = req.nextUrl.searchParams.get('id');
    const id = idParam ? parseInt(idParam) : NaN;
    const name = req.nextUrl.searchParams.get('name');
    const email = req.nextUrl.searchParams.get('email');
    if (!name || !email || isNaN(id)) {
        return new Response(JSON.stringify({ message: 'ID, name, and email are required' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }
    const newUser: User = { id, name, email };
    users.push(newUser);
    return new Response(JSON.stringify(newUser), {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
    });
}

export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    console.log('GET request received');
    const userId = parseInt(params.id);
    const user = users.find(u => u.id === userId);
    if (user) {
        return new Response(JSON.stringify(user), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } else {
        return new Response(JSON.stringify({ message: 'User not found' }), {
            status: 404,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}

export async function PUT(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    console.log('PUT request received');
    const userId = parseInt(params.id);
    const body: Partial<User> = await req.json();
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
        users[userIndex] = { ...users[userIndex], ...body };
        return new Response(JSON.stringify(users[userIndex]), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } else {
        return new Response(JSON.stringify({ message: 'User not found' }), {
            status: 404,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    console.log('DELETE request received');
    const userId = parseInt(params.id);
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
        users.splice(userIndex, 1);
        return new Response(JSON.stringify({ message: 'User deleted' }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } else {
        return new Response(JSON.stringify({ message: 'User not found' }), {
            status: 404,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}