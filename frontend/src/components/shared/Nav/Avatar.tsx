import { Link } from "react-router";
import { useAuth } from "@/features/auth/context/AuthContext";

export const Avatar = () => {
  const { user } = useAuth();

  const userInitials =
    user?.name
      ?.split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0].toUpperCase())
      .join("") || "U";

  return (
    <Link
      to="/profile"
      aria-label="Your account"
      className="flex size-10 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-semibold text-secondary-foreground transition hover:ring-2 hover:ring-primary/30"
    >
      {userInitials}
    </Link>
  );
};

