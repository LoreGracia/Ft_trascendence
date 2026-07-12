import Image from "next/image";

export default function Profile() {
  return (
	// <div>
	//   <h2>Profile</h2>
	// </div>
		<div className="flex flex-row flex-1 w-full max-w-3xl justify-center gap-10 font-sans sm:items-start">
		  <div className="flex flex-1 w-full max-w-2xl flex-col items-center justify-between gap-16 py-80 px-5 sm:items-start">
			<Image
			  className="light"
			  src="/dice-mockup.svg"
			  alt="dice mockup"
			  width={200}
			  height={20}
			/>
			</div>
		</div>
  )
}