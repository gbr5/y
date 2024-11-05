import { TPost } from "@/dtos/Post";
import Post from "./Post";
import PostFeedSkeleton from "./PostFeedSkeleton";
import { LoaderIcon } from "lucide-react";

type Props = {
  posts: TPost[] | null
  userId: string
  refreshFeed: () => void
}

export default async function PostFeed({ posts, userId, refreshFeed }: Props) {
  return (
    <div className="flex flex-col w-auto">
      {!posts && (
        <div className="flex flex-col w-full h-full items-center">
          <LoaderIcon className="my-4 animate-spin" />
          <PostFeedSkeleton />
        </div>
      )}
      {posts && posts.map((item, index) => (
        <Post refreshFeed={refreshFeed} key={index} post={item} userId={userId} />
      ))}
    </div>
  )
}
