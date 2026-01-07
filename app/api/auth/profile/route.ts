import { NextResponse } from 'next/server';
import { verifyJWT } from '@/lib/auth-utils';
import { prisma } from '@/lib/db';

export async function GET(req: Request) {
    try {
        // Extract token from Authorization header or Cookie
        const authHeader = req.headers.get('Authorization');
        let token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;

        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const payload = await verifyJWT(token);

        if (!payload || !payload.userId) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { id: payload.userId as string },
            select: {
                id: true,
                name: true,
                email: true,
                image: true,
                mbtiType: true,
                createdAt: true,
                preferences: true,
            },
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({ user });
    } catch (error) {
        console.error('Profile error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
