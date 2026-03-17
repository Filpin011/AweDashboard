import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import sites from "@/app/sites.json"; // Assuming you have a JSON file with site data
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";


export default function Home() {

  return (
    // <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
    //   <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
    //     <Image
    //       className="dark:invert"
    //       src="/next.svg"
    //       alt="Next.js logo"
    //       width={180}
    //       height={38}
    //       priority
    //     />
    //     <ol className="font-mono list-inside list-decimal text-sm/6 text-center sm:text-left">
    //       <li className="mb-2 tracking-[-.01em]">
    //         Get started by editing{" "}
    //         <code className="bg-black/[.05] dark:bg-white/[.06] font-mono font-semibold px-1 py-0.5 rounded">
    //           app/page.tsx
    //         </code>
    //         .
    //       </li>
    //       <li className="tracking-[-.01em]">
    //         Save and see your changes instantly.
    //       </li>
    //     </ol>

    //     <div className="flex gap-4 items-center flex-col sm:flex-row">
    //       <a
    //         className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
    //         href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
    //         target="_blank"
    //         rel="noopener noreferrer"
    //       >
    //         <Image
    //           className="dark:invert"
    //           src="/vercel.svg"
    //           alt="Vercel logomark"
    //           width={20}
    //           height={20}
    //         />
    //         Deploy now
    //       </a>
    //       <a
    //         className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[158px]"
    //         href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
    //         target="_blank"
    //         rel="noopener noreferrer"
    //       >
    //         Read our docs
    //       </a>
    //     </div>
    //   </main>
    //   <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
    //     <a
    //       className="flex items-center gap-2 hover:underline hover:underline-offset-4"
    //       href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
    //       target="_blank"
    //       rel="noopener noreferrer"
    //     >
    //       <Image
    //         aria-hidden
    //         src="/file.svg"
    //         alt="File icon"
    //         width={16}
    //         height={16}
    //       />
    //       Learn
    //     </a>
    //     <a
    //       className="flex items-center gap-2 hover:underline hover:underline-offset-4"
    //       href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
    //       target="_blank"
    //       rel="noopener noreferrer"
    //     >
    //       <Image
    //         aria-hidden
    //         src="/window.svg"
    //         alt="Window icon"
    //         width={16}
    //         height={16}
    //       />
    //       Examples
    //     </a>
    //     <a
    //       className="flex items-center gap-2 hover:underline hover:underline-offset-4"
    //       href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
    //       target="_blank"
    //       rel="noopener noreferrer"
    //     >
    //       <Image
    //         aria-hidden
    //         src="/globe.svg"
    //         alt="Globe icon"
    //         width={16}
    //         height={16}
    //       />
    //       Go to nextjs.org →
    //     </a>
    //   </footer>
    // </div>
    <>
      <div className="container-wrapper flex flex-1 flex-col pb-8">
        <div className="container flex flex-1 flex-col">
          <div className="grid">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3">
              {/* Add new site card */}
              <Card className="group transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_8px_32px_rgba(99,102,241,0.18)] hover:cursor-pointer border-dashed border-2 border-violet-200/80 bg-white/40 hover:bg-white/60">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-100 to-blue-100 border border-violet-200/60 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <PlusIcon className="w-5 h-5 text-violet-500" />
                    </div>
                    <div>
                      <CardTitle className="text-violet-700">Add new site</CardTitle>
                      <CardDescription>Click to create a new entry</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              {sites.map((site) => (
                <Card
                  key={site.title}
                  className="group transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_8px_32px_rgba(99,102,241,0.18)] hover:cursor-pointer"
                >
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200/60 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300 overflow-hidden">
                        <Image alt={site.title} width={24} height={24} className="object-contain" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <CardTitle className="truncate">{site.title}</CardTitle>
                        <CardDescription className="truncate">{site.description}</CardDescription>
                      </div>
                    </div>
                    <CardAction>
                      <a
                        href={site.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center rounded-full bg-gradient-to-r from-violet-500 to-blue-500 px-3 py-1 text-xs font-semibold text-white shadow-sm hover:from-violet-600 hover:to-blue-600 transition-all duration-200 whitespace-nowrap"
                      >
                        {site.actionLabel}
                      </a>
                    </CardAction>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
