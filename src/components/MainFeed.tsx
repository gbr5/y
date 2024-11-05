"use client"
import { getAllPosts } from "@/app/actions/post";
import ComposePost from "./ComposePost";
import PostFeed from "./PostFeed";
import { Suspense, useEffect, useState, useTransition } from "react";
import PostFeedSkeleton from "./PostFeedSkeleton";
import { TPost } from "@/dtos/Post";

type Props = {
  userId: string
}

export default function MainFeed({ userId }: Props) {
  const [isPending, startTransition] = useTransition()
  const [posts, setPosts] = useState<TPost[] | null>(null)

  function fetchPosts() {
    getAllPosts().then((response) => {
      if (response.data) setPosts(response.data)
    })
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  function refreshFeed() {
    startTransition(() => {
      fetchPosts()
    })
  }
  return (
    <main className="
      relative
      md:w-[600px]
      lg:w-[600px]
      flex
      flex-1
      w-auto
      flex-col
      mx-auto
      border-r-[0.5px]
      border-l-[0.5px]
      border-gray-600
      box-border
    ">
      <h1 className="sticky top-0 text-xl font-bold p-6 backdrop-blur bg-white/10">
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
        <ComposePost isPending={isPending} onPostSuccess={refreshFeed} />
      </div>
      
      <Suspense fallback={<PostFeedSkeleton />}>
        <PostFeed refreshFeed={refreshFeed} posts={posts} userId={userId} />
      </Suspense>
    </main>
  )
}
