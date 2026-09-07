"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getNavigation } from "@/lib/navigation";
import { useGameSocket } from "@/hooks/useGameSocket";
import { cn } from "@/lib/utils";

export function MobileBottomBar({className} : {className?: string;} ) {
  const pathname = usePathname();
  const { waitingRoom, matchRoom } = useGameSocket();
  const navigation = getNavigation(Boolean(waitingRoom || matchRoom));

  return (
    <nav
    className={cn("list-none fixed bottom-0 left-0 right-0 z-50",
      "flex items-center justify-evenly h-16 bg-(--light) shadow-lg shadow-gray-50 md:hidden", className)}>
      {navigation.content.map((item) => {
        const Icon = item.icon;
        const isDisabled = Boolean(item.disabled);
        console.log(`IT is disabled? ${item.disabled}`);
        return (
          <Link
            key={item.href}
            href={isDisabled ? "#" : item.href}
            aria-disabled={isDisabled}
            tabIndex={isDisabled ? -1 : 0}
            onClick={(event) => {
              if (isDisabled) {
                event.preventDefault();
              }
            }}
            className={cn("p-2 rounded-3xl", pathname === item.href && "bg-(--accent)/20")}
          >
            <Icon className={isDisabled? "text-(--accent)" : ""}/>
            {/* <span className="text-[10px]">
              {item.label}
            </span> */}
          </Link>
        );
      })}
    </nav>
  );
}
