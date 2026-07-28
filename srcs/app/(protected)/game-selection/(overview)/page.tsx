import  ToggleModeButton from "@/components/button/ToggleModeButton";
import Image from "next/image";

export default function GameSelection() {
  return (
	<div className="flex flex-row gap-10 items-center">
		<div className="box items-center">
			<ToggleModeButton/>
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