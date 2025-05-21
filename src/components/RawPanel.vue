<script setup lang="ts">

import {inject} from "vue";
import {ViewModel} from "@/viewmodel/ViewModel.ts";
import ImagePanel from "@/components/ImagePanel.vue";
import RawJsonPanel from "@/components/RawJsonPanel.vue";

const viewModel = inject<ViewModel>("viewModel")

</script>

<template>
  <div class="h-100 d-flex flex-column">
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
  </div>
</template>

<style scoped>

</style>