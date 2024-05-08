<template>
  <div class="bg-black overflow-hidden" style="height:100vh;">
    <div class="w-full h-2/3 md:h-full">
      <TresCanvas style="flex-grow:2">
        <Stats></Stats>
        <TresPerspectiveCamera ref="cameraRef" :position="cameraPosition" v-always-look-at="cameraTarget"/>
        <MapControls v-if="!looking"/>
        <TresAmbientLight :intensity=".1" />
        <TresDirectionalLight cast-shadow :position="[-3,3,0]" :look-at="[0,0,0]" :intensity="10" />
        <Stars :size=".3"/>
        <Suspense>
          <GLTFModel v-for="planet, i in planets" ref="planetRefs" :path="planet.glb" :position="[(i-1) * 15, 0, 0]" :scale="planet.scale" draco />
        </Suspense>
        <Plane>
          <MeshBasicMaterial></MeshBasicMaterial>
        </Plane>
      </TresCanvas>
    </div>
    <Transition>
    <div class="relative m-4 h-1/3 bg-gradient-to-b from-slate-800 to-slate-900 p-2 outline outline-[1px] outline-[#af724d] outline-offset-4 rounded-xl md:bg-gradient-to-r md:absolute md:w-1/3 md:-right-4 md:top-4 md:bottom-4 md:h-auto">
      <p class="m-auto">Planet:"X"</p> 
      <div>
        <button v-for="p, i in planetRefs" @click="look(i)" class="">{{i}}</button>
      </div>
    </div>
    </Transition>
  </div>
</template>
<script setup lang="ts">
import { PerspectiveCamera, Vector3 } from 'three';
import { vAlwaysLookAt } from '@tresjs/cientos';
import gsap from 'gsap';

const allPlanets = await $fetch('/api/planets')
const planets = [allPlanets[1], allPlanets[3], allPlanets[9]]
const planetRefs = ref<GLTFModel[]>()
const selectedPlanet = ref<GLTFModel>()
const cameraRef = ref<PerspectiveCamera>()
const cameraTarget = ref<Vector3>(new Vector3(0,0,0))
const cameraPosition = computed<Vector3>(() => {
  const pos = new Vector3().copy(cameraTarget.value);
  pos.add(new Vector3(4,4,4));
  return pos
})

const looking = ref<boolean>(false)
function look(i:number){
  const target = planetRefs.value?.[i]
  if(target == null || cameraRef.value == null){
    console.warn("target not found")
    return
  }  
  const endPoint:Vector3 = target.value.position;
  looking.value = true 
  gsap.to(cameraTarget.value, {...endPoint, duration:1.5 });
}

function slowRotate(){
  planetRefs.value?.forEach(planet => {
    gsap.to(planet.value.rotation, {y:2*Math.PI, duration:200, repeat:-1, ease:"none" })
  })
}

watch(planetRefs,() => {
  slowRotate()
})

</script>
