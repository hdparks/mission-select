import { jsonEvent } from "@eventstore/db-client"
import { UUID } from "@eventstore/db-client/generated/shared_pb"
import { z } from "zod"
import getEventStoreClient from "~/composables/eventStoreClient"
import { WasBorn, WasBornType } from "~/types/events/creatureEvents"

const bornEventSchema = z.object({
  species: z.string(),
  planet: z.string(),
  name: z.string(),
  height: z.number(),
  weight: z.number(),
  year: z.number(),
})

export default defineEventHandler(async (event) => {
  const results = await readValidatedBody(event, body => bornEventSchema.safeParse(body))  
  if (!results.success){
    throw createError({
      statusCode: 400,
      statusMessage: results.error.message
    })
  }

  const newCreatureId = new UUID();
  const bornEvent: WasBorn = jsonEvent<WasBorn>({
    type: WasBornType,
    data: {
      creatureId: newCreatureId,
      ...results.data,
    }
  })

  const client = getEventStoreClient()
  client.appendToStream('asdf', bornEvent)

  return newCreatureId;
})
