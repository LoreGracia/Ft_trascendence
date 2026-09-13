import { createAuthClient } from "better-auth/react"
import { jwtClient } from "better-auth/client/plugins"
// import { jwtClient, genericOAuthClient } from "better-auth/client/plugins"

export const authClient =  createAuthClient({
    plugins: [
      jwtClient(),
      // genericOAuthClient(),
  ]
})