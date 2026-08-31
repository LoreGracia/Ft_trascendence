// aplly to any element to make the action: logout
"use server";

import { signOut } from "@/app/auth";

export async function logout() {
  await signOut({
    redirectTo: "/login",
  });
}
