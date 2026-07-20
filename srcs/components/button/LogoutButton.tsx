import { signOut } from "@/app/auth";

export function LogoutButton() {
  return (
    <form
      action={async () => {
        "use server";
        await signOut({
          redirectTo: "/login",
        });
      }}
    >
      <button type="submit" className="corner-right button button-round button--basic">
        Cerrar sesión
      </button>
    </form>
  );
}