export default function Button({ children, func }: { children: React.ReactNode, func: () => void }) {
  return (<button data-id="base-button" onClick={func} className="bg-[#CECAA7] hover:bg-[#86745C] text-black font-bold py-2 px-4 rounded relative overflow-hidden duration-300 [transition-timing-function:cubic-bezier(0.175,0.885,0.32,1.275)] active:translate-y-1 active:scale-x-110 active:scale-y-90">
    {children}
  </button>)
}
