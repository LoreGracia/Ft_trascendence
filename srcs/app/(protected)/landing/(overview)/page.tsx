// import { useState } from "react";
import Image from "next/image";

import ToggleModeButton from "@/components/button/ToggleModeButton";
import type { GameType } from "@/types/game";

import { JoinButton, CreateRoomButton } from "@/components/SocketComponent";
import LandingClient from "@/components/LandingClient";

export default function GameSelection() {
  // const [selectedMode, setSelectedMode] =
  //   useState<GameType>("FREE_PLAY");

  return (
    <div className="container container-two">
        <LandingClient/>

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
