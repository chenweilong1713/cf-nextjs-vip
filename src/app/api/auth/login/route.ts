import { getCloudflareContext } from '@opennextjs/cloudflare';
import { success, error, jsonResponse } from '@/lib/utils/response';
import { hashPassword } from '@/lib/utils/password';
import { signJWT } from '@/lib/utils/jwt';

export async function POST(request: Request) {
    try {
        const { env } = await getCloudflareContext();
        const db = (env as CloudflareEnv).DB;

        const body = await request.json();
        const { email, password } = body as any;

        if (!email || !password) {
            return jsonResponse(error(400, 'Email and password are required'), 400);
        }

        // Find user by email
        const user = await db.prepare(
            'SELECT * FROM users WHERE email = ?'
        ).bind(email).first<any>();

        if (!user) {
             return jsonResponse(error(401, 'Invalid email or password'), 401);
        }

        // Verify password
        const hashedPassword = await hashPassword(password);
        if (hashedPassword !== user.password_hash) {
            return jsonResponse(error(401, 'Invalid email or password'), 401);
        }
        
        // Remove sensitive info
        const { password_hash, ...userInfo } = user;
        
        // Generate JWT
        const token = await signJWT({ id: user.id, email: user.email, nickname: user.nickname });
        
        return jsonResponse(success({
            user: userInfo,
            token
        }, 'Login successful'));

    } catch (e: any) {
        console.error('Login error:', e);
        return jsonResponse(error(500, e.message || 'Internal Server Error'), 500);
    }
}
