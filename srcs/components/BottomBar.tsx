"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navigation } from "@/lib/navigation";
import { cn } from "@/lib/utils";

export function MobileBottomBar({className} : {className?: string;} ) {
  const pathname = usePathname();

  return (
    <nav
    className={cn("list-none fixed bottom-0 left-0 right-0 z-50",
      "flex h-16 bg-(--light) shadow-2xl md:hidden", className)}>
      {navigation.content.map((item) => {
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-1 flex-col items-center justify-center gap-1",
              pathname === item.href && "text-(--accent)"
            )}
          >
            <Icon />
            {/* <span className="text-[10px]">
              {item.label}
            </span> */}
          </Link>
        );
      })}
    </nav>
  );
}
