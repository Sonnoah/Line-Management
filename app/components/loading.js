import Image from "next/image";

export function Loading() {
  return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/70">
          <Image
            src="/loading.png"
            alt="loading"
            width={300}
            height={300}
          />
          
          <progress className="progress h-3 w-50 progress-info mt-4"></progress>
        </div>
  );
}

