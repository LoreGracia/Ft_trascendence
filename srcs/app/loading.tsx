import Image from "next/image";

export default function Loading() {
  return (
  <div className="flex flex-auto justify-center">
    <Image
      src="/loading.svg"
      alt="Cargando..."
      width={80}
      height={80}
    />
    </div>
  );
}