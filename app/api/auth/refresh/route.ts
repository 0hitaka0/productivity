import { NextResponse } from 'next/server';
import { verifyJWT, signJWT } from '@/lib/auth-utils';
import { prisma } from '@/lib/db';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { refreshToken } = body;

        if (!refreshToken) {
            return NextResponse.json({ error: 'Refresh token required' }, { status: 400 });
        }

        // Verify refresh token
        const payload = await verifyJWT(refreshToken);

        if (!payload || payload.type !== 'refresh') {
            return NextResponse.json({ error: 'Invalid refresh token' }, { status: 401 });
        }

        // Check if user still exists
        const user = await prisma.user.findUnique({
            where: { id: payload.userId as string },
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 401 });
        }

        // Issue new access token
        const accessToken = await signJWT(
            { userId: user.id, email: user.email },
            '15m'
        );

        // Optional: Rotate refresh token here if desired

        return NextResponse.json({
            accessToken,
            expiresIn: 900,
        });
    } catch (error) {
        console.error('Refresh error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
