import {
  Cookie,
  Dices,
  Home,
  Podium,
  User,
} from "lucide-react";

// export type NavigationItem = {
//   href: string;
//   label: string;
//   icon: typeof User;
//   disabled?: boolean;
// };

export const getNavigation = (hasActiveRoom: boolean) => ({
  header: [
    {
      href: "/profile",
      label: "Profile",
      icon: User,
    },
  ] as NavigationItem[],

  content: [
    {
      href: "/landing",
      label: "Home",
      icon: Home,
    },
    {
      href: "/leaderboard",
      label: "Leaderboard",
      icon: Leaderboard,
    },
    {
      href: "/lobby",
      label: "Lobby",
      icon: Dices,
      disabled: !hasActiveRoom,
    },
  ] as NavigationItem[],

  footer: [
    {
      href: "/privacy-politics",
      label: "Privacy policy",
      icon: Cookie,
    },
  ] as NavigationItem[],
});

export const navigation = getNavigation(false);