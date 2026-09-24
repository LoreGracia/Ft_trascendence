import Image from "next/image";

export default function Loading() {
  return (
  <div className="flex flex-auto justify-center w-auto h-auto">
    <Image
      src="/loading.svg"
      alt="Cargando..."
      width={80}
      height={80}
    />
    </div>
  );
}