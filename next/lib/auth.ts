import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { jwt } from "better-auth/plugins";
import { createAuthMiddleware, APIError } from "better-auth/api";
import { signupSchema, loginSchema } from "./validation";

export const auth = betterAuth({
	database: prismaAdapter(prisma, {
		provider: "postgresql",
	}),

	emailAndPassword: {
		enabled: true, 
	},

	rateLimit: {
		enabled: true,
		window: 60,
		max: 10,
	},

	baseURL: {
		allowedHosts: [
			"dice.eina.cc",
			"www.dice.eina.cc",
			"*.dice.eina.cc",
		],
		protocol: "https",
		fallback: process.env.NEXT_PUBLIC_URL,
	},

	trustedOrigins: [process.env.NEXT_PUBLIC_URL, "https://*.dice.eina.cc"],
	
	socialProviders: {
		github: {
			clientId: process.env.GITHUB_CLIENT_ID as string,
			clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
			mapProfileToUser: (profile) => {
				return {
					email: profile.email ?? `${profile.id}@github.invalid`,
				};
			},
		},
	},

	plugins: [
		jwt(),
	],
	hooks: {
		before: createAuthMiddleware(async (ctx) => {
		if (ctx.path === "/sign-up/email") {
			const result = signupSchema.safeParse(ctx.body);
			if (!result.success) {
				throw new APIError("BAD_REQUEST", {
					message: result.error.issues[0].message,
				});
			}

			const { name, email } = result.data;

			const [nameTaken, emailTaken] = await Promise.all([
				prisma.user.findUnique({ where: { name }, select: { id: true } }),
				prisma.user.findUnique({ where: { email }, select: { id: true } }),
			]);

			if (nameTaken) {
				throw new APIError("CONFLICT", {
					message: "Username already taken",
					code: "USERNAME_TAKEN",
				});
			}
			if (emailTaken) {
				throw new APIError("CONFLICT", {
					message: "Email already registered",
					code: "EMAIL_TAKEN",
				});
			}
		}

		if (ctx.path === "/sign-in/email") {
			const result = loginSchema.safeParse(ctx.body);
			if (!result.success) {
				throw new APIError("BAD_REQUEST", {
					message: result.error.issues[0].message,
				})
			}
		}
		})
	},
	databaseHooks: {
		user: {
		create: {
			before: async (user, ctx) => {
			if (ctx?.path?.startsWith("/callback/") || ctx?.path?.startsWith("/oauth2/callback/")) {
				return { data: { ...user, name: null, image: null  } };
			}
			return { data: user };
			},
		},
		},
	},
})