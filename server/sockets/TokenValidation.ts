import { jwtVerify, createRemoteJWKSet } from 'jose';

const baseUrl = process.env.BETTER_AUTH_URL
const JWKS = createRemoteJWKSet(new URL('/api/auth/jwks', baseUrl));


export async function validateToken(token: string) {
    try {
        const { payload } = await jwtVerify(token, JWKS, {
            issuer: baseUrl,
            audience: baseUrl,
        })
        return payload;
    } catch (err) {
        console.error('Token validation failed:', err);
        throw err;
    }
}