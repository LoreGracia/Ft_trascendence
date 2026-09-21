import { jwtVerify, createRemoteJWKSet } from 'jose';

function getBaseUrl(): string {
	const url = process.env.NEXT_PUBLIC_URL;
	console.log(`URL: ${process.env.NEXT_PUBLIC_URL}, url2: ${url}`);
	if (!url || url === "")
		throw new Error("Missing Auth Url");
	return url;
}

function getAuthInternalUrl(): string {
	const url = "http://next-app:3000";
	if (!url || url === "")
		throw new Error("Missing Auth Internal Url");
	return url;
}

const baseUrl = getBaseUrl();
const authInternalUrl = getAuthInternalUrl();
const JWKS = createRemoteJWKSet(new URL('/api/auth/jwks', baseUrl));


export async function validateToken(token: string) {
	try {
		const { payload } = await jwtVerify(token, JWKS, {
			issuer: baseUrl,
			audience: baseUrl,
		})
		return payload;
	} catch (err) {
		throw err;
	}
}