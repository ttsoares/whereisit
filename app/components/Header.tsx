'use client'

import Link from "next/link";
import { useRouter } from 'next/navigation'

export default function Header() {
  const router = useRouter()

  return (
    <header className="w-full h-20 flex items-center justify-between bg-[#5F453A] text-lg tracking-widest">
      <div className="group w-1/3 bg-[#BDAF8C] rounded-xl items-center justify-center flex ml-10">
        <button
          data-id="home-link"
          className="text-6xl m-auto mx-auto text-black group-hover:animate-pulse flex justify-center items-center" type="button" onClick={() => router.push('/')}>
          <p className="mb-2">&#191;</p> <p>WhereIsIt</p><p className="ml-1.5">?</p>
        </button>
      </div>
      <div className="w-2/3 flex items-center justify-end space-x-8 pr-10 font-bold">
        <Link
          data-id="search-link"
          href={"/search"}>Search</Link>
        <Link
          data-id="totals-link"
          href={"/statistics"}>Totals</Link>
        <Link
          data-id="oneDvd-link"
          href={"/oneDvd"}>One DVD</Link>
        <Link
          data-id="comments-link"
          href={"/allComments"}>Comments</Link>
        <Link
          data-id="browse-link"
          href={"/browse"}>Browse</Link>
      </div>
    </header>
  );
}