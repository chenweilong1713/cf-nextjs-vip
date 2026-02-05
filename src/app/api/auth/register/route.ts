import { getCloudflareContext } from '@opennextjs/cloudflare';
import { success, error, jsonResponse } from '@/lib/utils/response';
import { hashPassword } from '@/lib/utils/password';

export async function POST(request: Request) {
    try {
        const { env } = await getCloudflareContext();
        const db = (env as CloudflareEnv).DB;
        
        const body = await request.json();
        const { nickname, password, email } = body as any;

        if (!email || !password || !nickname) {
            return jsonResponse(error(400, 'Nickname, email and password are required'), 400);
        }

        // Check if user exists by email
        const existingUser = await db.prepare(
            'SELECT id FROM users WHERE email = ?'
        ).bind(email).first();

        if (existingUser) {
            return jsonResponse(error(409, 'User with this email already exists'), 409);
        }

        const hashedPassword = await hashPassword(password);

        // Insert user
        const result = await db.prepare(
            'INSERT INTO users (nickname, password_hash, email, created_at, updated_at) VALUES (?, ?, ?, datetime("now"), datetime("now"))'
        ).bind(nickname, hashedPassword, email).run();

        if (!result.success) {
             return jsonResponse(error(500, 'Failed to create user'), 500);
        }

        return jsonResponse(success({ nickname, email }, 'User registered successfully'));
    } catch (e: any) {
        console.error('Register error:', e);
        return jsonResponse(error(500, e.message || 'Internal Server Error'), 500);
    }
}
