import { BsChat, BsDot, BsThreeDots } from "react-icons/bs";
import { IoShareOutline, IoStatsChart } from "react-icons/io5";
import { AiOutlineHeart, AiOutlineRetweet } from "react-icons/ai";

const ICONS = [
  { item: <BsChat /> },
  { item: <AiOutlineRetweet /> },
  { item: <AiOutlineHeart /> },
  { item: <IoStatsChart /> },
  { item: <IoShareOutline /> },
]

export default function MainFeed() {
  return (
    // min-w-[100vw]
    // max-w-[100vw]
    // lg:max-w-[600px]
    // lg:min-w-[600px]
    <main className="

      flex
      flex-col
      mx-auto
      h-full
      w-auto

      sm:max-w-[600px]
      lg:max-w-[600px]

      border-r-[0.5px]
      border-l-[0.5px]
      border-gray-600
      box-border
    ">
      <h1 className="text-xl font-bold p-6 backdrop-blur bg-white/10 sticky top-0">
        Home
      </h1>
      <div className="
        relative
        flex
        items-stretch
        space-x-2
        border-t-[0.5px]
        border-b-[0.5px]
        border-gray-600
        h-full
        w-auto
        p-4
      ">
        <div className="flex-none w-10 h-10 bg-slate-400 rounded-full"></div>
        <div className="flex flex-col w-full h-full ">
          <input
            type="text"
            name=""
            id=""
            placeholder="What&apos;s happening?"
            className="
              w-auto
              h-full
              bg-transparent
              outline-none
              border-none
              border-b-[0.5px]
              border-gray-600
              p-4
            "
          />
          <div className="flex w-full justify-between items-center">
            <div className="flex"></div>
            <div className="w-full max-w-[100px]">
              <button
                type="button"
                className="
                  rounded-full
                  bg-yprimary
                  px-6
                  py-2
                  text-center
                  text-lg
                  placeholder:text-gray-600
                  hover:opacity-70
                  transition
                  duration-200
                  font-bold
                "
              >
                Post
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col w-full">
        {Array.from({length:5}).map((_, index) => (
          <div
            key={index}
            className="
              flex
              w-full
              border-t-[0.5px]
              border-gray-600
              space-x-4
              p-6
              pl-4
            "
          >
            <div className="flex min-w-10 h-10 bg-slate-200 rounded-full" />
            <div className="flex flex-col w-full">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center space-x-1">
                  <div className="flex font-bold">Fidos</div>
                  <div className="text-gray-500">@fidos2873876</div>
                  <div className="text-gray-500"><BsDot /></div>
                  <div className="text-gray-500">1 hour ago</div>
                </div>
                <div className="text-gray-500 "><BsThreeDots /></div>
              </div>
              <div className="text-sm text-white">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Assumenda ipsam expedita, quasi reprehenderit libero earum excepturi voluptas veniam fugiat a? Sint ipsum tempora sunt dolorem fuga tenetur voluptates cum vel!
                Iste iusto at dicta corporis earum tempora deleniti nihil, recusandae illum quia dolorum, similique consequuntur placeat ipsam non ullam! Praesentium, facilis? Nulla, fuga soluta fugiat laborum saepe sed ex necessitatibus.
                Natus laboriosam labore, 
              </div>
              <div className="bg-slate-400 aspect-square w-full h-96 rounded-xl">

              </div>
              <div className="flex items-center space-x-2 w-full justify-between mt-2">
                {ICONS.map(({ item }, index) => (
                  <div key={index} className="rounded-full hover:bg-white/15 transition duration-200 p-3 cursor-pointer">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}
