import { TProfile } from "./Profile"

export type TPostLike = {
  id: string
  user_id: string
  profiles: TProfile | null
}
