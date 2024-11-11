import { TPostReply } from "@/dtos/PostReply";
import { BsChat } from "react-icons/bs";

type Props = {
  toggleReplyPost: () => void
  postId: string
  replies: TPostReply[]
}

export default function PostRepliesButton({ toggleReplyPost, replies }: Props) {
  return (
    <button
      onClick={toggleReplyPost}
      className="
        flex
        items-center
        gap-2
        rounded-full
        hover:bg-white/15
        transition
        duration-200
        p-3
        cursor-pointer
      "
    >
     <BsChat />
      <span>{replies.length}</span>
    </button>
  )
}
