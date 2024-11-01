import { getAllPosts } from "@/app/actions/post";
import ComposePost from "./server-components/compose-post";
import PostFeed from "./PostFeed";
import { Suspense } from "react";
import PostFeedSkeleton from "./PostFeedSkeleton";

export default async function MainFeed() {
  const posts = getAllPosts()

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
        <ComposePost />
      </div>
      
      <Suspense fallback={<PostFeedSkeleton />}>
        <PostFeed postsPromise={posts} />
      </Suspense>
    </main>
  )
}
