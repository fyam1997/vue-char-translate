<script setup lang="ts">

import {LoadFileType} from "@/viewmodel/ReadFileContent.ts";
import {inject} from "vue";
import {ViewModel} from "@/viewmodel/ViewModel.ts";

const viewModel = inject<ViewModel>("viewModel")
const apiConfig = viewModel.apiConfig
const prompt = viewModel.prompt
const imageSrc = viewModel.imageSrc
const rawJson = viewModel.rawJson
const translatedJson = viewModel.translatedJson
</script>

<template>
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
</template>

<style scoped>

</style>