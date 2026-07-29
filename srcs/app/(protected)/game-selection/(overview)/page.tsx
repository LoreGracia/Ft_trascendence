import  ToggleModeButton from "@/components/button/ToggleModeButton";
import Image from "next/image";
import { Plus } from "lucide-react";

export default function GameSelection() {
  return (
	<div className="container container-two">
		<div className="box items-center">
			<ToggleModeButton/>
			 <div className="flex flex-row gap-4 mt-5 text-base font-medium">
              <button
                className="button button-round button--highlight whitespace-nowrap"
              >
				<Plus/>
                Create room
              </button>
              <button
                className="button button-round bg-(--white) shadow-2sl hover:bg-(--light)"
              >
				<Plus/>
                Join room
              </button>
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