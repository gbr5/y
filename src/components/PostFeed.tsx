import { TPost } from "@/app/actions/post";
import Post from "./Post";
import PostFeedSkeleton from "./PostFeedSkeleton";
import { LoaderIcon } from "lucide-react";

type Props = {
  posts: TPost[] | null
}

export default function PostFeed({ posts }: Props) {

  return (
    <div className="flex flex-col w-full">
      {!posts && (
        <div className="flex flex-col w-full h-full items-center">
          <LoaderIcon className="my-4" />
          <PostFeedSkeleton />
        </div>
      )}
      {posts && posts.map((item, index) => (
        <Post key={index} post={item} />
      ))}
    </div>
  )
}
