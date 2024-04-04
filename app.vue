<template>
  <div>
    <button @click="saveGalaxy">Save Galaxy</button>
    <button @click="randomizeGalaxy">Randomize</button>
    <button @click="loadGalaxy(galaxyName)" v-for="galaxyName in galaxyNames">{{galaxyName}}</button>
    <span ref="debugSpan"></span>
    <button @click="requestCreatureCv">cv: {{creatureCv}}</button>
    <div id="canvas-container">
      <TresCanvas >
        <Stats></Stats>
        <TresPerspectiveCamera ref="cameraRef"/>
        <MapControls v-if="mapControlsEnabled"/>
        <OrbitControls v-if="orbitControlsEnabled" :target="cameraTarget" />
        <Stars :size="1"/>
        <Sphere ref="planetSpheres" @click="selectPlanet" v-for="planet in planets" :args="[.1,10,10]" :position="[planet.position.x, planet.position.z, planet.position.y]" color="gray"/>
        <Line2 v-for="lane in hyperlanes" :points="[[lane.p1.position.x, lane.p1.position.z, lane.p1.position.y],[lane.p2.position.x, lane.p2.position.z, lane.p2.position.y]]" :line-width=".001" color="white"/>
        <Ring ref="selectorRingRef" />
        <TresGridHelper />
      </TresCanvas>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { Ring, Sphere } from '@tresjs/cientos';
import type { Hyperlane, Planet } from './utils/galaxyGenerator';
import { Object3D, type Intersection } from 'three'
import type { ShallowRef } from "vue";

const { onLoop } = useRenderLoop()
const mapControlsEnabled = computed(() => cameraTarget.value == undefined);
const orbitControlsEnabled = computed(() => cameraTarget.value != undefined);
const cameraRef = ref<Object3D>();
const cameraTarget = computed(() => selectedPlanet.value?.value?.position)

const planets = shallowRef<Planet[]>([])
const planetSpheres: ShallowRef<ShallowRef<Object3D>[]> = shallowRef([])
const hyperlanes = shallowRef<Hyperlane[]>([])
function randomizeGalaxy(){
  const galaxy = randomGalaxy()
  planets.value = galaxy.planets;
  hyperlanes.value = galaxy.hyperlanes;
}
randomizeGalaxy()

async function saveGalaxy(){
  await $fetch("/api/save-galaxy", {
    method: "POST",
    body: JSON.stringify({
      planets: planets,
      hyperlanes: hyperlanes
    })
  })
}

async function loadGalaxy(galaxyName: string) {
  const result = await $fetch<Galaxy>(`/api/galaxy/${encodeURI(galaxyName)}`)
  planets.value = result.planets
  hyperlanes.value = result.hyperlanes
}

const {data:galaxyNames} = await useFetch<string[]>('/api/galaxy/list')

const selectorRingRef = ref<Ref<Object3D>>()
const selectedPlanet = ref<Ref<Object3D>>()

function selectPlanet({object}:Intersection) {
  const planet = planetSpheres.value.find(p => p.value.uuid == object.uuid)
  if (planet == null) return;
  selectedPlanet.value = planet
  if (cameraRef.value == null) return;
  // start zoom
  cameraRef.value.lookAt(planet.value.position)

  // start selection 
  if (selectorRingRef.value) {
    selectorRingRef.value.value.position.set(planet.value.position.x, planet.value.position.y, planet.value.position.z)
    selectorRingRef.value.value.lookAt(cameraRef.value.position)

  }
}

const debugSpan = ref<HTMLSpanElement | null>()
let ping = 0
onLoop(({delta, elapsed}) => {
  if (debugSpan.value) {
    debugSpan.value.innerText = cameraTarget.value?.toArray().toString() ?? ""
  }
  if (selectorRingRef.value?.value != null) {
    
  }
})


const creatureCv = ref<string>(".")
async function requestCreatureCv() {
  creatureCv.value = 'fetching...'
  creatureCv.value = await $fetch('/api/creature/1/cv')
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
