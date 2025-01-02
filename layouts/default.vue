<template>
  <section class="h-svh text-white bg-neutral-800 flex flex-col">
    <header class="flex flex-col">
      <nav class="w-full flex justify-between px-10 mt-3">
        <v-btn variant="plain"> open </v-btn>
        <div class="w-10 h-10 bg-neutral-400 rounded-full"></div>
      </nav>
    </header>
    <main class="basis-2/3 m-5">
      <slot />
    </main>
  </section>
</template>
<script setup lang="ts"></script>
