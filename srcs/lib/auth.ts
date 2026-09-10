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
          })
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
  }
});


  // socialProviders: { 
  //   github: { 
  //     clientId: process.env.GITHUB_CLIENT_ID as string, 
  //     clientSecret: process.env.GITHUB_CLIENT_SECRET as string, 
  //   }, 
  // }, 