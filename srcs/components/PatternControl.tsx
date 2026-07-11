import Image from 'next/image';

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
        <Image
			src={paused ? "/play-icon.svg" : "/pause-icon.svg"}
			alt=""
			width={24}
			height={24}
		/>
      </button>
    </>
  );
}