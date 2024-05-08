<template>
  <canvas ref="canvas"></canvas>
</template>
<script setup lang="ts">
const props = defineProps<{text:string}>()
const canvas = ref<HTMLCanvasElement>()
watch(() => props.text,() => {
  if (!canvas.value) { return }
  const ctx = canvas.value?.getContext('2d')
  ctx?.clearRect(0,0,canvas.value.width, canvas.value.height)
  ctx?.fillText(props.text, 0, 0)
})
</script>
