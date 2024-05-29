import { roleSchema } from '@saas/auth'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { BadRequestError } from '@/http/_errors/bad-request-error'
import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'

export async function getPedendingInvite(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      '/pending-invtes',
      {
        schema: {
          tags: ['Invites'],
          summary: 'Get pending invites',
          params: z.object({
            inviteId: z.string().uuid(),
          }),
          200: z.object({
            invite: z.array(
              z.object({
                id: z.string().uuid(),
                role: roleSchema,
                email: z.string().email(),
                createdAt: z.date(),
                organization: z.object({
                  name: z.string(),
                }),
                author: z
                  .object({
                    id: z.string().uuid(),
                    name: z.string().nullable(),
                    avatarUrl: z.string().url().nullable(),
                  })
                  .nullable(),
              }),
            ),
          }),
        },
      },
      async (request) => {
        const userId = await request.getCurrentUserId()

        const user = await prisma.user.findUnique({
          where: {
            id: userId,
          },
        })

        if (!user) {
          throw new BadRequestError('User not found')
        }

        const invites = await prisma.invite.findMany({
          select: {
            id: true,
            email: true,
            role: true,
            createdAt: true,
            author: {
              select: {
                id: true,
                name: true,
                avatarUrl: true,
              },
            },
            organization: {
              select: {
                name: true,
              },
            },
          },
          where: {
            email: user.email,
          },
        })

        if (!invites) {
          throw new BadRequestError('Invite not found')
        }

        return { invites }
      },
    )
}
