import { timePassed } from "@/utils/timePassed";
import { AiOutlineHeart, AiOutlineRetweet } from "react-icons/ai";
import { BsChat, BsDot, BsThreeDots } from "react-icons/bs";
import { IoShareOutline, IoStatsChart } from "react-icons/io5";
import { TPost } from "@/app/actions/post";
const ICONS = [
  { item: <BsChat /> },
  { item: <AiOutlineRetweet /> },
  { item: <AiOutlineHeart /> },
  { item: <IoStatsChart /> },
  { item: <IoShareOutline /> },
]

type Props = {
  post: TPost
}

export default function Post({ post }: Props) {
  const postTime = () => {
    if (post.created_at !== post.updated_at) {
      return `${timePassed(new Date(post.created_at))} edited ${timePassed(new Date(post.updated_at))}`
    }
    return timePassed(new Date(post.created_at))
  }
  return (
    <div
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
      <div className="flex min-w-10 h-10 bg-slate-200 rounded-full pr-6" />
      <div className="flex flex-col w-full">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center space-x-1">
            <div className="flex font-bold">{post.profiles?.full_name ?? ""}</div>
            <div className="text-gray-500">@{post.profiles?.username}</div>
            <div className="text-gray-500"><BsDot /></div>
            <div className="text-gray-500">{postTime()}</div>
          </div>
          <div className="text-gray-500 "><BsThreeDots /></div>
        </div>
        <p className="text-sm text-white leading-5 my-4">{post.text}</p>
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
  )
}
