<template>
  <div>
    <button @click="saveGalaxy">Save Galaxy</button>
    <div id="canvas-container">
      <TresCanvas>
        <TresPerspectiveCamera />
        <MapControls />
        <TresGridHelper />
        <Sphere v-for="planet in planets" :args="[.1,10,10]" :position="[planet.position.x, planet.position.z, planet.position.y]" color="gray"/>
        <Line2 v-for="lane in hyperlanes" :points="[[lane.p1.position.x, lane.p1.position.z, lane.p1.position.y],[lane.p2.position.x, lane.p2.position.z, lane.p2.position.y]]" :line-width=".1" color="white"/>
      </TresCanvas>
    </div>
  </div>
</template>
<script setup lang="ts">
const galaxy = randomGalaxy()
const planets = galaxy.planets
const hyperlanes = galaxy.hyperlanes

async function saveGalaxy(){
  const result = await $fetch("/api/save-galaxy", {
    method: "POST",
    body: JSON.stringify({
      planets: galaxy.planets,
      hyperlanes: galaxy.hyperlanes
    })
  })
  console.log(result)
}

</script>
<style>
body {
  margin: 0;
  height: 100vh;
  width: 100vw;
}
#canvas-container {
  height: 100%;
  width: 100%;
  position: absolute;
}
</style>
