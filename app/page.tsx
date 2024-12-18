'use client'

export default function Home() {

  return (
    <div
      className="h-screen w-screen flex">
      <div
        data-id="home-img"
        className="h-full w-1/2 flex flex-col items-center justify-center bg-[url('./images/bg-home.jpg')] bg-contain bg-no-repeat bg-blend-overlay">
      </div>
      <div className="w-1/2 h-full flex items-center justify-center flex-col space-y-10 ">
        <div className="flex flex-col items-center justify-center p-1 space-y-10">
          <h1 className="text-7xl font-bold text-[#86745C]">Find Files Anywhere</h1>
        </div>
      </div>
    </div>
  );
}
