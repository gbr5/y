import { TProfile } from "./Profile"

export type TPostReply = {
  id: string
  user_id: string
  tweet_id: string | null
  reply_id: string | null
  text: string
  profiles?: TProfile | null
  // replies: TPostReply[] | null
}