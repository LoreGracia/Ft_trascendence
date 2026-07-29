import { Play, Pause } from "lucide-react";

type PatternControlProps = {
  paused: boolean;
  onToggle: () => void;
};

export default function PatternControl({
  paused,
  onToggle,
}: PatternControlProps) {
  return (
    <>
      <div className={`pattern ${paused ? "paused" : ""}`} />

      <button
        onClick={onToggle}
        className="corner-left button button-round button--secondary"
      >
		{paused ? (
			<Play size={24} color="var(--black)" /> ) : 
			(<Pause size={24} color="var(--black)" /> )
		}
      </button>
    </>
  );
}