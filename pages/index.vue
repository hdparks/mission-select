<template>
  <div>
    <button @click="saveGalaxy">Save Galaxy</button>
    <button @click="randomizeGalaxy">Randomize</button>
    <button v-for="galaxyName in galaxyNames" @click="loadGalaxy(galaxyName)">{{galaxyName}}</button>
    <span ref="debugSpan"></span>
    <button @click="requestCreatureCv">cv: {{creatureCv}}</button>
    <div id="canvas-container">
      <Suspense>
        <TresCanvas >
          <Stats></Stats>
          <TresPerspectiveCamera ref="cameraRef"/>
          <MapControls v-if="mapControlsEnabled"/>
          <OrbitControls v-if="orbitControlsEnabled" :target="cameraTarget" />
          <TresAmbientLight :intensity=".1" />
          <TresDirectionalLight cast-shadow :position="[-3,3,0]" :look-at="[0,0,0]" :intensity="10" />
          <Stars :size=".3"/>
          <Suspense>
            <PlanetRenderer ref="planetSpheres" @click="selectPlanet" v-for="planet in planets" :args="[.1,10,10]" :planet="planet" color="gray"/>
          </Suspense>
          <Line2 v-for="lane in hyperlanes" :points="[[lane.p1.position.x, lane.p1.position.y, lane.p1.position.z],[lane.p2.position.x, lane.p2.position.y, lane.p2.position.z]]" :line-width="1" color="white"/>
          <Ring ref="selectorRingRef" v-if="selectedPlanet" :args="[.2,.3]" />
          <Suspense>
            <GLTFModel path="/galaxyGrid/galaxyGrid.glb"/>
          </Suspense>
          <TresGridHelper />
        </TresCanvas>
      </Suspense>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { Ring,} from '@tresjs/cientos';
import { Object3D, Vector3, type Intersection } from 'three'
import type { ShallowRef } from "vue";
const { onLoop } = useRenderLoop()
const mapControlsEnabled = computed(() => cameraTarget.value == undefined);
const orbitControlsEnabled = computed(() => cameraTarget.value != undefined);
const cameraRef = ref<Object3D>();
const cameraTarget = computed(() => selectedPlanet.value?.planet.position)

const planets = shallowRef<Planet[]>([])
const planetSpheres: ShallowRef<ShallowRef<InstanceType<typeof PlanetRenderer>>[]|null> = shallowRef(null)
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
const selectedPlanet = shallowRef<InstanceType<typeof PlanetRenderer>|null>(null)

function selectPlanet({object}:Intersection) {
  const planet = planetSpheres.value?.find(p => p.value.uuid == object.uuid)
  if (planet?.value?.position == null) return;
  selectedPlanet.value = planet.value
  if (cameraRef.value == null) return;
  // start zoom
  cameraRef.value.lookAt(planet.value.planet.position)

  // start selection 
  if (selectorRingRef.value) {
    selectorRingRef.value.value.position.set(planet.value.position.x, planet.value.position.y, planet.value.position.z)
    selectorRingRef.value.value.lookAt(cameraRef.value.position)
  }
}

const debugSpan = ref<HTMLSpanElement | null>()

onLoop(({delta, elapsed}) => {
  planetSpheres.value?.forEach(planet => {
    planet?.value?.rotate(new Vector3(.1 * delta,0,0))
  })      
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
