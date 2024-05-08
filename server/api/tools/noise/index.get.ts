import fs from 'node:fs/promises'
export default defineEventHandler(async() => {
  const noiseNames = await fs.readdir('./public/noise/')
  return noiseNames.map(filename => '/public/noise/' + filename) 
})
