import fs from 'node:fs/promises'

export type PlanetConfig = {
  name: string;
  glb: string;
  position: {
    x: number;
    y:number;
    z:number;
  },
  scale: number;
}

export default defineEventHandler(async(): Promise<PlanetConfig[]> => {
  const planetConfigFiles = await fs.readdir('./public/planets/config/')
  const configs:PlanetConfig[] = []
  for(let file of planetConfigFiles) {
    configs.push(await JSON.parse(await fs.readFile('./public/planets/config/' + file, 'utf8')) as PlanetConfig)
  }
  return configs
})
