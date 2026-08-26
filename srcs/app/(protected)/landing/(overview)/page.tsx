"use client";

import { useState } from "react";
import Image from "next/image";

import ToggleModeButton from "@/components/button/ToggleModeButton";
import type { GameType } from "@/types/game";

import { JoinButton, CreateRoomButton } from "@/components/SocketComponent";

export default function GameSelection() {
  const [selectedMode, setSelectedMode] =
    useState<GameType>("FREE_PLAY");

  return (
    <div className="container container-two">
      <div className="box items-center">
        <ToggleModeButton
          selected={selectedMode}
          onChange={setSelectedMode}
        />

        <div className="flex flex-row gap-4 mt-5 text-base font-medium">
          <CreateRoomButton mode={selectedMode} />
          <JoinButton />
        </div>
      </div>

      <div className="box items-center">
        <Image
          src="/dice-mockup.svg"
          alt="dice"
          width={180}
          height={180}
        />
      </div>
    </div>
  );
}
