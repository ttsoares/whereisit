export default function Input({ children, reference, defVal, placeHol, func }: {
  children?: React.ReactNode,
  reference: React.RefObject<HTMLInputElement>,
  defVal?: string
  placeHol?: string
  func?: () => void
}) {
  return (<label className="text-xl text-[#CECAA7]">
    {children}
    <input
      data-id="base-input"
      onKeyDown={(e) => {
        if (e.key === "Enter" && func) {
          func();
        }
      }}
      type="text"
      ref={reference}
      defaultValue={defVal}
      required
      placeholder={placeHol}
      className="bg-[#86745C] border-2 border-yellow-400 text-black font-bold ml-3 p-2 rounded-xl"
    />
  </label>)
}
