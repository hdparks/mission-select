export type Point = {
  x: number;
  y: number;
  z: number;
}
export type Planet = {
  position: Point
}
export type Hyperlane = {
  p1: Planet;
  p2: Planet;
}


export type GalaxyConfig = {
  numPlanets: number;
  spread: number;
}

export function randomGalaxy(ctx: GalaxyConfig = { numPlanets: 50, spread:5 }): {planets: Planet[], hyperlanes: Hyperlane[]} {  
  const planets = Array(ctx.numPlanets).fill(null).map(() => randomPlanet(ctx.spread))
  const hyperlanes = randomHyperlanes(planets) 
  return {
    planets: planets,
    hyperlanes: hyperlanes
  }
}

function randomPlanet(spread: number): Planet {
  return {
    position: {
      x: (Math.random() - .5) * spread,
      y: (Math.random() - .5) * spread,
      z: (Math.random() - .5) * spread / 10,
    }
  }
}


type DijkstraEdge = {
  dist: number;
  from: number;
  to: number;
}

function cityBlockDist(a:Point, b:Point): number {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y)
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
