<script setup lang="ts">
import {inject} from "vue";
import {ViewModel} from "@/viewmodel/ViewModel.ts";

const viewModel = inject<ViewModel>("viewModel")
const translatedJson = viewModel.translatedJson

</script>

<template>
  <div class="h-100 d-flex flex-column ga-2">
    <h4>Translated</h4>
    <v-textarea v-model="translatedJson" no-resize hide-details class="flex-grow-1"/>
    <div class="d-flex flex-row ga-2 mb-4">
      <v-btn @click="viewModel.downloadJson()" text="downloadJson" class="text-none flex-grow-1" variant="outlined"/>
      <v-btn @click="viewModel.downloadImage()" text="downloadImage" class="text-none flex-grow-1" variant="outlined"/>
    </div>
  </div>
</template>

<style scoped>

</style>