import { cookies } from 'next/headers'
import { type NextRequest, NextResponse } from 'next/server'

import { acceptInvite } from '@/http/accept-invite'
import { signInWithGithub } from '@/http/sign-in-with-github'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams

  const code = searchParams.get('code')
  if (!code) {
    return NextResponse.json(
      {
        message: 'Github OAutch code was not found',
      },
      { status: 400 },
    )
  }
  const { token } = await signInWithGithub({ code })

  const redirectUrl = request.nextUrl.clone()
  redirectUrl.pathname = '/'
  redirectUrl.search = ''

  cookies().set('token', token, {
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })

  const inviteId = cookies().get('inviteId')?.value

  if (inviteId) {
    try {
      await acceptInvite(inviteId)
      cookies().delete('inviteId')
    } catch {}
  }

  return NextResponse.redirect(redirectUrl)
}
