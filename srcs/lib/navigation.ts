import {
  Cookie,
  Dices,
  Home,
  Podium,
  User,
} from "lucide-react";

export const navigation = {
  header: [
    {
      href: "/profile",
      label: "Profile",
      icon: User,
    },
  ],

  content: [
    {
      href: "/game-selection",
      label: "Home",
      icon: Home,
    },
    {
      href: "/leaderboard",
      label: "Leaderboard",
      icon: Podium,
    },
    {
      href: "/lobby",
      label: "Lobby",
      icon: Dices,
    },
  ],

  footer: [
    {
      href: "/privacy-politics",
      label: "Privacy & politics",
      icon: Cookie,
    },
  ],
};
