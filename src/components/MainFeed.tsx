"use client"
import { getAllPosts, TPost } from "@/app/actions/post";
import ComposePost from "./ComposePost";
import PostFeed from "./PostFeed";
import { Suspense, useEffect, useState } from "react";
import PostFeedSkeleton from "./PostFeedSkeleton";

export default function MainFeed() {
  const [posts, setPosts] = useState<TPost[] | null>(null)
  const [refresh, setRefresh] = useState(true)

  useEffect(() => {
    async function fetchPosts() {
      const response = await getAllPosts()
      setPosts(response)
      setRefresh(false)
    }

    if (refresh) fetchPosts()
  }, [refresh])

  function handleNewPost() {
    setRefresh(true)
  }
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
      w-fit
      md:max-w-[600px]
      md:min-w-[600px]
      lg:max-w-[600px]
      lg:min-w-[600px]
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
        <ComposePost onPostSuccess={handleNewPost} />
      </div>
      
      <Suspense fallback={<PostFeedSkeleton />}>
        <PostFeed posts={posts} />
      </Suspense>
    </main>
  )
}
