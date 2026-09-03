import LandingClient from "@/components/LandingClient";
import SelectDice from "@/components/3dDice/SelectDice";

export default function GameSelection() {
  return (
    <div className="container container-two">
        <LandingClient/>

      <div className="box items-center">
            <SelectDice roomCode="test-room" />
      </div>
    </div>
  );
}
