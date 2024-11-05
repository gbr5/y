import { timePassed } from "@/utils/timePassed";
import {  AiOutlineRetweet } from "react-icons/ai";
import { BsChat, BsDot } from "react-icons/bs";
import { IoShareOutline, IoStatsChart } from "react-icons/io5";
import PostLikeButton from "./PostLikeButton";
import { Suspense } from "react";
import PostLikeButtonSkeleton from "./PostLikeButtonSkeleton";
import { TPost } from "@/dtos/Post";
import PostSettingsButton from "./PostSettingsButton";

type Props = {
  post: TPost
  userId: string
  refreshFeed: () => void
}

export default async function Post({ post, userId, refreshFeed }: Props) {
  const postTime = () => {
    if (post.created_at !== post.updated_at) {
      return `${timePassed(new Date(post.created_at))} edited ${timePassed(new Date(post.updated_at))}`
    }
    return timePassed(new Date(post.created_at))
  }

  return (
    <div
      className="
        relative
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
          <PostSettingsButton refreshFeed={refreshFeed} post={post} userId={userId} />
        </div>

        <p className="text-sm text-white leading-5 my-4">{post.text}</p>

        <div className="bg-slate-400 aspect-square w-full h-fit md:h-96 rounded-xl" />

        <div className="flex items-center space-x-2 w-full justify-between mt-2">
          <div className="rounded-full hover:bg-white/15 transition duration-200 p-3 cursor-pointer">
            <BsChat />
          </div>
          <div className="rounded-full hover:bg-white/15 transition duration-200 p-3 cursor-pointer">
            <AiOutlineRetweet />
          </div>
          <Suspense fallback={<PostLikeButtonSkeleton />}>
            <PostLikeButton
              initialLikes={post.likes ?? []}
              post_id={post.id}
              userId={userId}
            />
          </Suspense>
          <div className="rounded-full hover:bg-white/15 transition duration-200 p-3 cursor-pointer">
            <IoStatsChart />
          </div>
          <div className="rounded-full hover:bg-white/15 transition duration-200 p-3 cursor-pointer">
            <IoShareOutline />
          </div>
        </div>
      </div>
    </div>
  )
}
