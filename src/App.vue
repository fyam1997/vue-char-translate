<script setup lang="ts">
import {ViewModel} from "@/viewmodel/ViewModel.ts";
import {computed, ref} from "vue";
import {LoadFileType} from "@/viewmodel/ReadFileContent.ts";

const viewModel = new ViewModel()
const theme = computed(() => {
  return viewModel.darkTheme.value ? 'dark' : 'light'
})

const imageSrc = computed(() => {
  const encodedImage = viewModel.image.value
  if (!encodedImage) return ''
  return `data:image/png;base64,${encodedImage}`
})

const rawJson = viewModel.rawJson
const prompt = viewModel.prompt
const translatedJson = viewModel.translatedJson
const apiConfig = viewModel.apiConfig

const snackbarMessageQueue = ref([])
viewModel.snackbarMessage.observe((msg) => {
  snackbarMessageQueue.value.push(msg)
})
</script>

<template>
  <v-app :theme="theme">
    <v-snackbar-queue v-model="snackbarMessageQueue"></v-snackbar-queue>
    <div class="overflow-y-auto h-100 d-flex flex-column">
      <v-btn @click="viewModel.clearImage()" text="clearImage" class="text-none"/>
      <v-btn @click="viewModel.clearJson()" text="clearJson" class="text-none"/>
      <v-btn @click="viewModel.downloadJson()" text="downloadJson" class="text-none"/>
      <v-btn @click="viewModel.downloadImage()" text="downloadImage" class="text-none"/>
      <v-btn @click="viewModel.openBugReport()" text="openBugReport" class="text-none"/>
      <v-btn @click="viewModel.toggleDarkTheme()" text="toggleDarkTheme" class="text-none"/>
      <v-text-field v-model="apiConfig.baseURL" label="baseURL"/>
      <v-text-field v-model="apiConfig.apiKey" label="apiKey"/>
      <v-text-field v-model="apiConfig.model" label="model"/>
      <v-textarea v-model="prompt" label="prompt" auto-grow/>
      <v-file-input
          label="Both"
          @update:modelValue="file => viewModel.loadFile(file, LoadFileType.BOTH)"
          accept=".json,.png"
      />
      <v-file-input
          label="Image"
          @update:modelValue="file => viewModel.loadFile(file, LoadFileType.PNG)"
          accept=".png"
      />
      <v-img v-if="imageSrc" :src="imageSrc" alt="Character image"/>
      <v-file-input
          label="Json"
          @update:modelValue="file => viewModel.loadFile(file, LoadFileType.JSON)"
          accept=".json"
      />
      <v-textarea v-if="rawJson" v-model="rawJson" auto-grow/>
      <v-btn @click="viewModel.translate()" text="translate" class="text-none"/>
      <v-textarea v-if="translatedJson" v-model="translatedJson" auto-grow/>
    </div>
  </v-app>
</template>

<style scoped>
</style>
