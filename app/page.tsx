import Image from "next/image";
import PolkadotClient from "@/app/api/smoldot"

export default function Home() {  
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
              <PolkadotClient />
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
 
        <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:size-auto lg:bg-none">
        </div>
      </div>
    </main>
  );
}
