import { api } from './api-client'

interface SigInWithPasswordRequest {
  email: string
  password: string
}

interface SigInWithPasswordResponse {
  token: string
}

export async function sigInWithPassword({
  email,
  password,
}: SigInWithPasswordRequest) {
  const result = await api
    .post('sessions/password', {
      json: {
        email,
        password,
      },
    })
    .json<SigInWithPasswordResponse>()

  return result
}
