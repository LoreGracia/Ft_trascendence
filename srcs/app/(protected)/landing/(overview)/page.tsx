import LandingClient from "@/components/LandingClient";
import SelectDice from "@/components/3dDice/SelectDice";

export default function GameSelection() {
  return (
    <div className="container container-two">
        <LandingClient/>
        <SelectDice roomCode="test-room" />
    </div>
  );
}
