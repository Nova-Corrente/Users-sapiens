import Image from "next/image";

export function LogoLoading() {
  return (
    <div className="flex h-screen flex-col items-center justify-center text-4xl">
      <div className="animate-pulse">
        <Image 
          src="/icons/loading-animation.png"
          alt="Carregando"
          width={400}
          height={400}
          priority
        />
      </div>
      <p>Carregando...</p>
    </div>
  );
}