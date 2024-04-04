import fs from "node:fs/promises" 
import { z } from "zod"

const galaxyNameSchema = z.object({name: z.string()})

export default defineEventHandler(async (event) => {
  const params = await getValidatedRouterParams(event,(p) => galaxyNameSchema.safeParse(p))
  if (!params.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid galaxy name:' + params.error
    })
  } 
  const decodedName = decodeURI(params.data.name)
  const galaxy = JSON.parse(await fs.readFile('assets/galaxy/' + decodedName, 'utf8'))
  return galaxy
})
