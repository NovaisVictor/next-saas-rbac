import { api } from './api-client'

interface GetProfileResponse {
  user: {
    email: string
    id: string
    name: string | null
    avatarUrl: string | null
  }
}

export async function getProfile() {
  const result = await api.get('profile').json<GetProfileResponse>()
  return result
}
