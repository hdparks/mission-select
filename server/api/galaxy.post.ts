import { z } from "zod"
import fs from "node:fs/promises"

const positionSchema = z.object({
  x: z.number(),
  y: z.number(),
  z: z.number()
})
const planetSchema = z.object({position: positionSchema})
const galaxySchema = z.object({
  planets: z.array(planetSchema),
  hyperlanes: z.array(z.object({p1: planetSchema, p2: planetSchema}))
})

export default defineEventHandler(async (event) => {
  const results = await readValidatedBody(event, body => galaxySchema.safeParse(body))  
  if (!results.success){
    throw createError({
      statusCode: 400,
      statusMessage: results.error.message
    })
  }

  const filepath = 'assets/galaxy/' + new Date().toISOString() + ".json"
  await fs.writeFile(filepath, JSON.stringify(results.data))
  return filepath
})
