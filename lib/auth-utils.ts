import { hash, compare } from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET || 'fallback-secret-do-not-use-in-prod';
const key = new TextEncoder().encode(JWT_SECRET);

export async function hashPassword(password: string): Promise<string> {
    return hash(password, 12);
}

export async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    return compare(password, hashedPassword);
}

export async function signJWT(payload: any, expiresIn: string = '7d'): Promise<string> {
    return new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime(expiresIn)
        .sign(key);
}

export async function verifyJWT(token: string): Promise<any> {
    try {
        const { payload } = await jwtVerify(token, key, {
            algorithms: ['HS256'],
        });
        return payload;
    } catch (error) {
        return null;
    }
}

export async function verifyAuth(req: Request) {
    const cookieHeader = req.headers.get('cookie') || '';
    console.log('[VerifyAuth] Cookie Header:', cookieHeader);

    // Try standard parsing first
    let token = cookieHeader.split('; ').find(row => row.startsWith('auth-token='))?.split('=')[1];

    // If not found, try more robust parsing (in case of different spacing)
    if (!token) {
        const match = cookieHeader.match(/auth-token=([^;]+)/);
        if (match) token = match[1];
    }

    // Fallback: Check Authorization header
    if (!token) {
        const authHeader = req.headers.get('authorization');
        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.split(' ')[1];
            console.log('[VerifyAuth] Found Bearer token');
        }
    }

    if (token) {
        const payload = await verifyJWT(token);
        if (payload?.userId) return { id: payload.userId as string };
    }

    // Fallback: Check NextAuth Session (Google, etc.)
    try {
        // Dynamic import to avoid circular dependency issues if any
        const { auth } = await import('@/auth');
        const session = await auth();
        if (session?.user?.id) {
            console.log('[VerifyAuth] Found NextAuth session');
            return { id: session.user.id };
        }
    } catch (e) {
        console.error('[VerifyAuth] NextAuth check failed:', e);
    }

    return null;
}
