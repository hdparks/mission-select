<template>
  <Suspense>
    <GLTFModel path="models/hoxxesIV.glb" :position="planet.position" draco />
  </Suspense>
</template>
<script setup lang="ts">
import type { Text3D, Sphere } from '@tresjs/cientos';
import { Vector3 } from 'three';
import { useTexture } from '@tresjs/core';
import type { SphereProps } from '@tresjs/cientos/dist/core/shapes/Sphere.vue.js';
import type { PlanetConfig } from '~/types/planetConfig';
defineProps<SphereProps & {planet: PlanetConfig}>()
const pbrTexture = await useTexture({
  normalMap: "textures/Rock035_2K_NormalGL.jpg"
})
const sphereRef = shallowRef<typeof Sphere>()
function rotate(rot: Vector3){
  if (sphereRef.value != null) {
    sphereRef.value.rotation.x += rot.x;
    sphereRef.value.rotation.y += rot.y;
    sphereRef.value.rotation.z += rot.z;
  }
}
defineExpose({rotate})
</script>
