"use client"
import { TPost } from "@/app/actions/post";
import { use } from "react";
import Post from "./Post";
import PostFeedSkeleton from "./PostFeedSkeleton";

type Props = {
  postsPromise: Promise<TPost[] | null>
}

export default function PostFeed({ postsPromise }: Props) {
  const posts = use(postsPromise)

  return (
    <div className="flex flex-col w-full">
      {!posts && (
        <div className="w-full h-full">
          <p>Something went wrong ...</p>
          <PostFeedSkeleton />
        </div>
      )}
      {posts && posts.map((item, index) => (
        <Post key={index} post={item} />
      ))}
    </div>
  )
}
