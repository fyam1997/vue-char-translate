<script setup lang="ts">

import {inject} from "vue";
import {ViewModel} from "@/viewmodel/ViewModel.ts";
import ImagePanel from "@/components/ImagePanel.vue";
import RawJsonPanel from "@/components/RawJsonPanel.vue";
import FileZone from "@/components/FileZone.vue";

const viewModel = inject<ViewModel>("viewModel")

</script>

<template>
  <FileZone
      class="h-100 d-flex flex-column"
      accept="image/png,application/json"
      @onFileSelected="(file)=>viewModel.loadFile(file)"
  >
    <div class="overflow-y-auto flex-grow-1 pa-4">
      <ImagePanel/>
      <v-divider class="mt-8 mb-8"/>
      <RawJsonPanel/>
    </div>
    <v-divider/>
    <v-btn
        class="ma-4 text-none"
        prepend-icon="md:translate"
        variant="outlined"
        @click="viewModel.translate()"
        text="Translate"
        :loading="viewModel.loading.value"
    />
  </FileZone>
</template>

<style scoped>

</style>