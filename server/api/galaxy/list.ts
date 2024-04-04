import fs from "node:fs/promises" 

export default defineEventHandler(async (event) => {
  const galaxyNames = await fs.readdir('./assets/galaxy/')
  return galaxyNames
})
