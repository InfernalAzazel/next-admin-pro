import {getDictionary} from "./dictionaries";
import Link from "next/link";
import {Button} from "antd";

interface Params{
    lang: string;
}

export default async function Home({ params }:{ params: Params}){
  const t = await getDictionary(params.lang);
  return (
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <div className="space-x-2">
          <Link href="/en">English</Link>
          <span>|</span>
          <Link href="/zh">Chinese/中文</Link>
        </div>
          <Button type={"primary"}>555</Button>
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          {t.home.title}
        </p>
        {t.home.desc}
      </main>
  );
}
