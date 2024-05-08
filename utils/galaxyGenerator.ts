import { isVector2 } from '@tresjs/leches/dist/utils/is.js';
import {Vector3} from 'three'
import { version } from 'vue';
export type Planet = {
  position: Vector3,
  radius: number,
  color: string,
  initialRotation: Vector3,
  rotationalSpeed: Vector3,
}

export type Hyperlane = {
  p1: Planet;
  p2: Planet;
}

export type GalaxyConfig = {
  numPlanets: number;
  spread: number;
}

export type Galaxy = {
  planets: Planet[];
  hyperlanes: Hyperlane[];
}

export function randomGalaxy(ctx: GalaxyConfig = { numPlanets: 50, spread:5 }): Galaxy {  
  const planets = Array(ctx.numPlanets).fill(null).map(() => randomPlanet(ctx.spread))
  const hyperlanes = randomHyperlanes(planets) 
  return {
    planets: planets,
    hyperlanes: hyperlanes
  }
}

function randomPlanet(spread: number): Planet {
  return {
    position: new Vector3(
      (Math.random() - .5) * spread,
      (Math.random() - .5) * spread / 10,
      (Math.random() - .5) * spread,
    ),
    initialRotation: new Vector3(
      Math.random() * .2 - .1,
      Math.random() * .2 - .1,
      Math.random() * .2 - .1,
    ),
    rotationalSpeed: new Vector3(
      0,
      Math.random() * .1,
      0
    ),
    color: '#'+(0x1000000+Math.random()*0xffffff).toString(16).substr(1,6),
    radius: Math.random() * .1 + .05
  }
}


type DijkstraEdge = {
  dist: number;
  from: number;
  to: number;
}

function cityBlockDist(a:Vector3, b:Vector3): number {
  return Math.abs(a.x - b.x) + Math.abs(a.z - b.z)
}

function randomHyperlanes(planets: Planet[]): Hyperlane[] { 
  const hyperlanes: Hyperlane[] = []
  let distances: number[][] = [];
  for(let i = 0; i < planets.length; i++){
    let d_i = Array(planets.length)
    for (let j = 0; j < planets.length; j++){
      const distance = j == i ? 1e4 : cityBlockDist(planets[i].position, planets[j].position)
      d_i[j] = distance
    }
    distances.push(d_i)
  }


  const visited = new Set<number>([0]);

  let nextEdge: DijkstraEdge[] = distances[0].map((dist,i) => ({
    dist: dist,
    from: 0,
    to: i 
  }))

  const laneCount = Array(planets.length).fill(0)  
  function cost(edge: DijkstraEdge): number {
    return edge.dist + laneCount[edge.from] + laneCount[edge.to]
  }

  while(nextEdge.length > 0 ) {
    nextEdge.sort((a,b) => cost(a) - cost(b))
    const [lowestDist] = nextEdge.splice(0,1)
    if (cost(lowestDist) > 5) {
      break;
    }

    hyperlanes.push({
      p1: planets[lowestDist.from],
      p2: planets[lowestDist.to]
    })
    laneCount[lowestDist.from] += 1
    laneCount[lowestDist.to] += 1
    visited.add(lowestDist.to)
    
    //nextEdge = nextEdge.filter(n => n.to != lowestDist.to)
    nextEdge.push(...distances[lowestDist.to].map((d,to) => ({
      dist: d,
      from: lowestDist.to,
      to: to,
    })).filter(n => !visited.has(n.to)))
  }
  
  return hyperlanes
}
