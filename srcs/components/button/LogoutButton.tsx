import { logout } from "@/actions/auth";

type LogoutButtonProps = {
  className?: string;
  children: React.ReactNode;
};

export function LogoutButton({
  className = "",
  children,
}: LogoutButtonProps) {
  return (
    <form action={logout} className={className}>
      <button type="submit">
        {children}
      </button>
    </form>
  );
}
