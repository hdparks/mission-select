<template>
  <div>
    <div class="p-2 bg-gradient-to-r from-slate-700 to-slate-800 rounded-xl border border-slate-950">
      <slot name="header"></slot>
    </div>
    <hr class="my-4">
    <div class="p-2">
      <slot></slot>
    </div>
  </div>
</template>
