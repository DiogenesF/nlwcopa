import Fastify from "fastify";
import { PrismaClient } from '@prisma/client'
import cors from "@fastify/cors"
import { z } from 'zod'
import ShortUniqueId from 'short-unique-id'

const prisma = new PrismaClient({
    log: ['query'],
})

async function bootstrap() {
    const fastify = Fastify({
        logger: true,
    })

    await fastify.register(cors, {
        origin: true
    })

    fastify.get("/pools/count", async () => {
        const count = await prisma.pool.count()

        return { count }
    })

    fastify.get("/users/count", async () => {
        const count = await prisma.user.count()

        return { count }
    })

    fastify.get("/guesses/count", async () => {
        const count = await prisma.guess.count()

        return { count }
    })

    fastify.post("/pools", async (req, res) => {
        const createPoolBody = z.object({
            title: z.string()
        })

        const { title } = createPoolBody.parse(req.body)

        const generate = new ShortUniqueId({ length: 6 })
        const code = String(generate()).toUpperCase()

        await prisma.pool.create({
            data: {
                title,
                code
            }
        })

        return res.status(201).send({ code })
    })

    await fastify.listen({ port: 3333 })
}

bootstrap()