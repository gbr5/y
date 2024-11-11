import { TPostLike } from "./PostLike"
import { TPostReply } from "./PostReply"
import { TProfile } from "./Profile"

export type TPost = {
  id: string
  text: string
  author_id: string
  created_at: string
  updated_at: string
  profiles: TProfile | null
  likes: TPostLike[] | null
  replies?: TPostReply[] | null
}