import { AiOutlineHeart } from "react-icons/ai";

export default function PostLikeButtonSkeleton() {
  return (
    <div className="
      flex
      items-center
      gap-2
      rounded-full
      hover:bg-white/15
      transition
      duration-200
      p-3
      cursor-pointer
      animate-pulse
    ">
      <AiOutlineHeart />
    </div>
  )
}
