import { jwtVerify, createRemoteJWKSet } from 'jose';

function getBaseUrl(): string {
	const url = process.env.BETTER_AUTH_URL;
	if (!url || url === "")
		throw new Error("Missing Auth Url");
	return url;
}

function getAuthInternalUrl(): string {
	const url = process.env.AUTH_INTERNAL_URL;
	if (!url || url === "")
		throw new Error("Missing Auth Internal Url");
	return url;
}

const baseUrl = getBaseUrl();
const authInternalUrl = getAuthInternalUrl();
const JWKS = createRemoteJWKSet(new URL('/api/auth/jwks', authInternalUrl));


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