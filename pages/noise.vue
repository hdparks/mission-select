<template>
  <div>
    <button @click="save">Save</button>
    <image v-for="link in links" :src="link" />
  </div> 
</template>
<script setup lang="ts">
import { createNoise2D } from 'simplex-noise';

const noiseGenerator = createNoise2D()
const noise:number[][] = []
for(let i = 0; i < 100; i++) {
  let row = []
  for (let j = 0; j <100; j++) {
    row.push(noiseGenerator(i,j))
  }
  noise.push(row)
}

async function save(){
  await useFetch('/api/tools/noise',{
    method: "POST",
    body: JSON.stringify(noise)
  })
  await fetchLinks()
}

const links = ref<string[]>([]) 
async function fetchLinks(){
  const res = await useFetch('/api/tools/noise')
  const data = res.data.value
  if (data){
    links.value = data
  }
}

await fetchLinks()

</script>
