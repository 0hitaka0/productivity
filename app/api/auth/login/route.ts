import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { comparePassword, signJWT } from '@/lib/auth-utils';
import { z } from 'zod';

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string(),
});

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const result = loginSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                { error: 'Invalid input' },
                { status: 400 }
            );
        }

        const { email, password } = result.data;

        // Find user
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user || !user.passwordHash) {
            // Return 401 even if user doesn't exist to prevent enumeration, or if user uses Google Auth only
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            );
        }

        // Verify password
        const isValid = await comparePassword(password, user.passwordHash);

        if (!isValid) {
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            );
        }

        // Generate tokens
        // Access token: 15 minutes
        const accessToken = await signJWT(
            { userId: user.id, email: user.email },
            '15m'
        );

        // Refresh token: 7 days
        const refreshToken = await signJWT(
            { userId: user.id, type: 'refresh' },
            '7d'
        );

        // Provide user info (excluding sensitive data)
        const { passwordHash, ...userProfile } = user;

        // Set refresh token as httpOnly cookie preferably, but for this API JSON response is requested.
        // We will return it in JSON for client handling (e.g. local storage or manually setting cookie)
        // The requirement says "returning JWT token"

        const response = NextResponse.json(
            {
                user: userProfile,
                accessToken,
                refreshToken,
                expiresIn: 900, // 15 minutes in seconds
            },
            { status: 200 }
        );

        response.cookies.set('auth-token', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 900, // 15 minutes
            path: '/',
        });

        return response;
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
