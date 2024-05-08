<template>
  <div style="height: 100%; width: 100%; position: absolute;">
    {{planets.map(p => p.name)}}
    <TresCanvas >
      <Stats></Stats>
      <TresPerspectiveCamera ref="cameraRef"/>
      <MapControls />
      <TresAmbientLight :intensity=".1" />
      <TresDirectionalLight cast-shadow :position="[-3,3,0]" :look-at="[0,0,0]" :intensity="10" />
      <Stars :size=".3"/>
      <Suspense>
        <GLTFModel v-for="planet in planets" :path="planet.glb" :position="[planet.position.x, planet.position.y, planet.position.z]" :scale="planet.scale" draco />
      </Suspense>
      <Plane>
        <MeshBasicMaterial></MeshBasicMaterial>
      </Plane>
      <TresGridHelper />
    </TresCanvas>
  </div>
</template>
<script setup lang="ts">
const planets = await $fetch('/api/planets')
</script>
