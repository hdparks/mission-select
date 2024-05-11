<template>
  <div v-for="char in splitValue" ref="charRefs" style="display: inline; font-family: Aurebesh;">{{char}}</div>
</template>
<script setup lang="ts">
import gsap from "gsap"

const tl = gsap.timeline()
const props = withDefaults(defineProps<{value:string, delay?:number, duration?:number, delimiter?:string|RegExp, deviation?:number, flicker?:number, debug?:boolean}>(), {delimiter:"", delay:1, duration:1, deviation:1, flicker:60, debug:false})
const splitValue = computed(() => props.value.split(props.delimiter))
const charRefs = ref<HTMLDivElement[]>() 
const instanceFlickerDelay = Math.random() * props.flicker

onMounted(() => nextTick(() => start()))
watch(splitValue,() => nextTick(() => start()))
onUnmounted(()=>tl.revert())

async function start(){
  if (charRefs.value == null) {return}
  if (props.debug){
    console.log("charRefs", charRefs.value)
  }
  tl.clear();
  tl.restart();

  tl.set(charRefs.value, {color:"unset", fontFamily:"Aurebesh"})
  charRefs.value.forEach((char,i) => {
    tl.to(char,{
      color:"#eee",
      delay:() => Math.random() * 2 * (i+1)/splitValue.value.length * props.duration + props.delay,
    },0)
    tl.to(char, {
      fontFamily: "unset",
      color:"unset",
    }, ">")
  })
  await tl;
  tl.clear()
  charRefs.value.forEach(char => {
    tl.to(char,{
      fontFamily:"AurebeshCondensed",
      color:"#bbb",
      delay: () => Math.random() * 2 + instanceFlickerDelay,
    },0)
    tl.to(char,{
      fontFamily:"unset",
      color:"unset",
      delay:() => Math.random(),
      repeat:-1
    },">")
  })
  tl.restart()
}

</script>
