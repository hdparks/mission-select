<template>
  <div class="bg-black overflow-hidden flex flex-col md:flex-row h-dvh w-dvw" style="height:100vh;" >
    <div class="flex-1" style="flex-grow: 2;" >
      <TresCanvas >
        <TresPerspectiveCamera ref="cameraRef" :position="cameraPosition" v-always-look-at="cameraTarget"/>
        <MapControls v-if="!looking"/>
        <TresAmbientLight :intensity=".1" />
        <TresDirectionalLight cast-shadow :position="[-3,3,0]" :look-at="[0,0,0]" :intensity="10" />
        <Stars :size=".3"/>
        <Suspense>
          <GLTFModel v-for="planet, i in planets" ref="planetRefs" :path="planet.glb" :position="[i * 15, 0, 0]" :scale="planet.scale" draco />
        </Suspense>
      </TresCanvas>
    </div>
    <div class="flex-1 md:max-w-[400px] m-4 overflow-auto bg-gradient-to-b from-slate-800 to-slate-900 text-slate-500 p-2 outline outline-[1px] outline-[#af724d] outline-offset-4 rounded-xl md:bg-gradient-to-r" style="overflow-wrap: anywhere;" >
      <div class="flex flex-row justify-between mb-4">
        <BackArrow :class="{'text-slate-800':selectedPlanet == 0, 'cursor-auto':selectedPlanet == 0}" @click="look(Math.max(0, selectedPlanet - 1))"/>
        <p class="m-auto"><TextPop><Translator :value="selectedPlanetName" :debug="true"></Translator></TextPop></p> 
        <FrontArrow :class="{'text-slate-800':selectedPlanet == 2, 'cursor-auto':selectedPlanet == 2}" @click="look(Math.min(2, selectedPlanet + 1))"/>
      </div>
      <QuestDescription v-if="selectedPlanet == 0">
        <template #header>
          <h1 class="text-center"><TextPop><Translator value="Operation: Vermillion Octave"></Translator></TextPop></h1>
          <h2><Translator value="Liberate a squadron of next-gen starfighters from the acid moon of Myr"></Translator></h2> 
        </template>
        <p><TextPop><Translator value="Boz"></Translator></TextPop><Translator value="'s old crewmate "></Translator><TextPop><Translator value="Siiva"></Translator></TextPop><Translator value=" has established contact."></Translator></p>
        <br>
        <p><Translator value="Several years ago, he was transfered from "></Translator><TextPop><Translator value="The Theseus"></Translator></TextPop><Translator value=" to "></Translator><TextPop><Translator value="Project Tailwind"></Translator></TextPop><Translator value=", building the successor to the Z-95 Starfighter."></Translator></p>
        <br>
        <p><Translator value="This new ship, which Siiva calls the"></Translator> <TextPop><Translator value="X-Wing"></Translator></TextPop><Translator value=", packs a serious punch."></Translator></p>
        <br>
        <p><TextPop><Translator value="Admiral Daaro"></Translator></TextPop><Translator value=" will claim them as soon as they pass their calibration tests on "></Translator><TextPop><Translator value="Myr"></Translator></TextPop><Translator value=". The Imperial Base there is vulnerable."></Translator></p>
        <br>
        <p><span class="font-bold"><Translator value="(Note from Hobby):"></Translator></span></p>
        <div class="mx-5">
        <p><Translator value="I'm sending 8 expert Z-95 pilots to bring those birds back home to roost."></Translator></p>
        <p><Translator value="If your team can punch through the ground defenses and get my guys to those ships, I might consider us even for all the times I've saved your sorry hides."></Translator></p>
        </div>
      </QuestDescription>
      <QuestDescription v-if="selectedPlanet == 1">
        <template #header>
          <h1 class="text-center"><TextPop><Translator value="Operation: Benevolent Impulse"></Translator></TextPop></h1>
          <h2><Translator value="Prevent the Assassination of Yulan Ferrik on the jungle planet Milheart"></Translator></h2>
        </template>
        <p><TextPop><Translator value="Yulan Ferrik"></Translator></TextPop><Translator value=" is the Imperial Governor of the Milheart subsystem. He was loyal to the former Senator Veloy Graff, and is gathering allies against the newly (self) appointed "></Translator><TextPop><Translator value="Senator Tiedus Amrena"></Translator></TextPop>.</p>
        <br>
        <p><Translator value="Intelligence shows that "></Translator><TextPop><Translator value="Naruk"></Translator></TextPop><Translator value=" has ordered an assassination of Governor Ferrik."></Translator></p>
        <br>
        <p><span class="font-bold"><Translator value="(Note from Quinlan Vos):"></Translator></span></p>
        <div class="mx-5">
          <p><Translator value='I don&apos;t like that Naruk is getting involved.'></Translator></p>
          <p><Translator value='Normally I wouldn&apos;t care that the Imperials are killing each other, but this guy is powerful, and he hates the new senator almost as much as we do.'></Translator></p>
          <p><Translator value='If we save him, he could be a valuable ally in the fight ahead.'></Translator> </p>
        </div>
      </QuestDescription>

      <QuestDescription v-if="selectedPlanet == 2">
        <template #header>
          <h1 class="text-center"><TextPop><Translator value="Operation: Heartbreak Actual"></Translator></TextPop></h1>
          <h2 ><Translator value='Evacuate Rebel Cell "Hydain Wayward" from the slot canyons of Ubados'></Translator></h2>
        </template>
        <p><Translator value="The rebel base on "></Translator><TextPop><Translator value="Ubados"></Translator></TextPop><Translator value=" is under attack."></Translator></p>
        <p><Translator value="Scans indicate the presence of several Imperial Class Star Destroyers in high orbit. "></Translator></p>
        <p><TextPop><Translator value="Admiral Daaro"></Translator></TextPop><Translator value=" has begun a viscious campaign through the narrow slot canyon bases of the Hydaian Wayward. They have sent out a distress call to any available rebel forces."></Translator></p>
        <br>
        <p><span class="font-bold"><Translator value="(Note from Fleet Captain Ackbar):"></Translator></span></p>
        <br>
        <div class="mx-5">
          <p><Translator value="The situation is dire. They need a small team to punch a hole through the Imperial advance forces long enough to evacuate the last of their personnel. They won't last much longer under Imperial siege. It's now or never."></Translator></p>
        </div>
      </QuestDescription>
    </div>
  </div>
</template>
<script setup lang="ts">
import { PerspectiveCamera, Vector3 } from 'three';
import gsap from "gsap" 
import myr from '@/public/planets/config/myr.json';
import milheart from '@/public/planets/config/milheart.json'
import ubados from '@/public/planets/config/ubados.json'
import { TresCanvas } from '@tresjs/core';
import { GLTFModel, MapControls, Stars } from '@tresjs/cientos';
const planets = [myr, milheart, ubados]

const planetRefs = ref<GLTFModel[]>();
const selectedPlanet = ref<number>(0)
const selectedPlanetName = computed(() => planets[selectedPlanet.value].name)
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
  selectedPlanet.value = i; 
  if(target == null || cameraRef.value == null){
    return
  }  
  const endPoint:Vector3 = target.value.position;
  looking.value = true 
  gsap.to(cameraTarget.value, {...endPoint, duration:3, ease:"power2.inOut" });
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
