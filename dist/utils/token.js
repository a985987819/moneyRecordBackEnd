import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { db } from '../config/database';
import crypto from 'crypto';
export function generateAccessToken(payload) {
    return jwt.sign({ ...payload, type: 'access' }, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN });
}
export function generateRefreshToken() {
    return crypto.randomBytes(40).toString('hex');
}
export async function createRefreshToken(userId) {
    const token = generateRefreshToken();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);
    await db.query(`INSERT INTO refresh_tokens (token, user_id, expires_at) 
     VALUES ($1, $2, $3)`, [token, userId, expiresAt]);
    return token;
}
export function verifyAccessToken(token) {
    return jwt.verify(token, env.JWT_SECRET);
}
export async function verifyRefreshToken(token) {
    const result = await db.query(`SELECT rt.*, u.id as user_id, u.username, u.created_at as "createdAt"
     FROM refresh_tokens rt
     JOIN users u ON rt.user_id = u.id
     WHERE rt.token = $1`, [token]);
    if (result.rows.length === 0) {
        return null;
    }
    const record = result.rows[0];
    if (new Date() > new Date(record.expires_at)) {
        await db.query('DELETE FROM refresh_tokens WHERE token = $1', [token]);
        return null;
    }
    return {
        id: record.id,
        token: record.token,
        userId: record.user_id,
        expiresAt: record.expires_at,
        createdAt: record.created_at,
        user: {
            id: record.user_id,
            username: record.username,
            createdAt: record.createdAt,
        },
    };
}
export async function revokeRefreshToken(token) {
    await db.query('DELETE FROM refresh_tokens WHERE token = $1', [token]);
}
export async function revokeAllUserRefreshTokens(userId) {
    await db.query('DELETE FROM refresh_tokens WHERE user_id = $1', [userId]);
}
//# sourceMappingURL=token.js.map