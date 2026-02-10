import { getCloudflareContext } from '@opennextjs/cloudflare';
import { success, error, jsonResponse } from '@/lib/utils/response';
import { hashPassword } from '@/lib/utils/password';

export async function POST(request: Request) {
    try {
        const { env } = await getCloudflareContext();
        const db = (env as CloudflareEnv).DB;
        
        const body = await request.json();
        const { username, password } = body as any;

        if (!username || !password) {
            return jsonResponse(error(400, 'Username and password are required'), 400);
        }

        // Check if user exists by username
        const existingUser = await db.prepare(
            'SELECT id FROM users WHERE username = ?'
        ).bind(username).first();

        if (existingUser) {
            return jsonResponse(error(409, 'User with this username already exists'), 409);
        }

        const hashedPassword = await hashPassword(password);

        // Insert user
        const result = await db.prepare(
            'INSERT INTO users (username, password_hash, created_at, updated_at) VALUES (?, ?, datetime("now"), datetime("now"))'
        ).bind(username, hashedPassword).run();

        if (!result.success) {
             return jsonResponse(error(500, 'Failed to create user'), 500);
        }

        return jsonResponse(success({ username }, 'User registered successfully'));
    } catch (e: any) {
        console.error('Register error:', e);
        return jsonResponse(error(500, e.message || 'Internal Server Error'), 500);
    }
}
