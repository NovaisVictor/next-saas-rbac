import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { BadRequestError } from '@/http/_errors/bad-request-error'
import { UnauthorizedError } from '@/http/_errors/unauthorized-error'
import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { getUserPermissions } from '@/utils/get-user-permissions'

export async function getProject(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/organizations/:orgSlug/projects/:projectSlug',
      {
        schema: {
          tags: ['Projects'],
          summary: 'Get a project details',
          security: [{ bearerAuth: [] }],
          params: z.object({
            orgSlug: z.string(),
            projectSlug: z.string(),
          }),
          response: {
            200: z.object({
              project: z.object({
                id: z.string().uuid(),
                name: z.string(),
                description: z.string(),
                slug: z.string(),
                avatarUrl: z.string().nullable(),
                organizationId: z.string().uuid(),
                ownerId: z.string(),
                owner: z.object({
                  id: z.string(),
                  name: z.string().nullable(),
                  avatarUrl: z.string().nullable(),
                }),
              }),
            }),
          },
        },
      },
      async (request, reply) => {
        const { projectSlug, orgSlug } = request.params
        const userId = await request.getCurrentUserId()
        const { membership, organization } =
          await request.getUserMembership(orgSlug)

        const { cannot } = getUserPermissions(userId, membership.role)

        if (cannot('get', 'Project')) {
          throw new UnauthorizedError(`You're not allowed to see this project.`)
        }

        const project = await prisma.project.findUnique({
          select: {
            id: true,
            name: true,
            description: true,
            slug: true,
            ownerId: true,
            avatarUrl: true,
            organizationId: true,
            owner: {
              select: {
                id: true,
                name: true,
                avatarUrl: true,
              },
            },
          },
          where: { slug: projectSlug, organizationId: organization.id },
        })

        if (!project) {
          throw new BadRequestError('Project not found')
        }

        return reply.status(200).send({ project })
      },
    )
}
