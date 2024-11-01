import { AiOutlineHeart, AiOutlineRetweet } from "react-icons/ai";
import { BsChat, BsDot, BsThreeDots } from "react-icons/bs";
import { IoShareOutline, IoStatsChart } from "react-icons/io5";

const ICONS = [
  { item: <BsChat /> },
  { item: <AiOutlineRetweet /> },
  { item: <AiOutlineHeart /> },
  { item: <IoStatsChart /> },
  { item: <IoShareOutline /> },
]


export default function PostFeedSkeleton() {
  return (
    <div
      className="
        flex
        flex-col
        min-w-full
        min-h-full
        "
        >
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="
          flex
          w-full
          border-t-[0.5px]
          border-gray-600
          space-x-4
          p-6
          pl-4
        ">
          <div className="
            flex
            min-w-10
            h-10
            bg-gradient-to-r
            from-black
            via-gray-600
            to-gray-800
            rounded-full
          "/>
          <div className="flex flex-col w-full pr-6">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center space-x-1">
                <div className="flex font-bold" />
                <div className="text-gray-500 flex m-2">
                  @
                  <span className="
                    bg-gradient-to-r
                    from-black
                    via-gray-600
                    to-gray-800
                    min-h-6
                    rounded-3xl
                    w-24
                    ml-2
                  "/>
                </div>
                <div className="text-gray-500"><BsDot /></div>
                <div className="
                  bg-gradient-to-r
                  from-black
                  via-gray-600
                  to-gray-800
                  min-h-6
                  rounded-3xl
                  w-24
                  ml-2
                  "/>
              </div>
              <div className="text-gray-500 "><BsThreeDots /></div>
            </div>
            {Array.from({ length: 2 }).map((_, index) => (
              <div key={index} className="
                bg-gradient-to-r
                from-black
                via-gray-600
                to-gray-800
                min-h-6
                rounded-3xl
                w-92
                mb-2
                "/>
              ))}
            <div className="
              bg-gradient-to-r
              from-black
              via-gray-600
              to-gray-800
              aspect-square
              w-full
              h-96
              rounded-xl"/>
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
  )
}
