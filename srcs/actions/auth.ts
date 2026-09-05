// aplly to any element to make the action: logout
// "use server";

// import { signOut } from "@/app/auth";

// export async function logout() {
//   await signOut({
//     redirectTo: "/login",
//   });
// }
// "use client";

// import { authClient } from "@/lib/auth-client";
// import { useRouter } from "next/navigation";

// export function useLogout() {
//   const router = useRouter();
//   return async () => {
//     await authClient.signOut();
//     router.push("/login");
//   };
// }