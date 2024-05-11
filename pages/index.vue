<template>
  <div class="bg-black overflow-hidden flex flex-col md:flex-row h-dvh w-dvw" style="height:100vh;" >
    <div class="flex-1" style="flex-grow: 2;" >
      <TresCanvas >
        <TresPerspectiveCamera />
        <MapControls />
        <TresAmbientLight :intensity=".1" />
        <TresDirectionalLight cast-shadow :position="[-3,3,0]" :look-at="[0,0,0]" :intensity="10" />
        <Stars :size=".3"/>
        <Suspense>
          <GLTFModel v-for="planet, i in planets" ref="planetRefs" :path="planet.glb" :position="[i * 15, 0, 0]" :scale="planet.scale" draco />
        </Suspense>
      </TresCanvas>
    </div>
  </div>
</template>
<script setup lang="ts">
import { PerspectiveCamera, Vector3 } from 'three';
import gsap from "gsap" 
import myr from '~/public/planets/config/myr.json';
import milheart from '~/public/planets/config/milheart.json'
import ubados from '~/public/planets/config/ubados.json'
const planets = [myr, milheart, ubados]
const planetRefs = ref<GLTFModel[]>();
function isItGsap(){
  gsap.to(".success", {fontSize:"100px"})
}
</script>
