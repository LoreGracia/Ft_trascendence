import Image from "next/image";

import ToggleModeButton from "@/components/button/ToggleModeButton";
import type { GameType } from "@/types/game";

import JoinButton from "@/components/SocketComponent/JoinButton";
import CreateRoomButton from "@/components/SocketComponent/CreateRoomButton";
import LandingClient from "@/components/LandingClient";
import SelectDice from "@/components/3dDice/SelectDice";

export default function GameSelection() {
  return (
    <div className="container container-two">
      <LandingClient />
      <SelectDice roomCode="test-room" />
    </div>
  );
}