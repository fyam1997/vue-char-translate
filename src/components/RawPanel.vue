<script setup lang="ts">

import FileZone from "@/components/FileZone.vue";
import {inject} from "vue";
import {ViewModel} from "@/viewmodel/ViewModel.ts";
import {LoadFileType} from "@/viewmodel/ReadFileContent.ts";
import EditObjectDialog from "@/components/EditObjectDialog.vue";

const viewModel = inject<ViewModel>("viewModel")

const imageSrc = viewModel.imageSrc
const rawJson = viewModel.rawJson

</script>

<template>
  <div class="overflow-y-auto">
    <FileZone
        accept="image/png"
        class="pa-4"
        @onFileSelected="(file)=>viewModel.loadFile(file, LoadFileType.PNG)"
    >
      <template v-slot:default="{openFile}">
        <div class="pb-4 d-flex flex-row align-center">
          <h4>Character Image</h4>
          <v-spacer/>
          <v-icon-btn v-if="imageSrc" icon="md:delete" variant="plain" @click="viewModel.clearImage()" title="Delete"/>
          <v-icon-btn icon="md:upload" variant="plain" @click="openFile" title="Upload"/>
        </div>
        <v-img
            v-if="imageSrc"
            :src="imageSrc"
            alt="Character image"
            title="Character image"
            class="ml-8 mr-8"
        />
      </template>
    </FileZone>

    <v-divider class="mt-8 mb-8"/>

    <FileZone
        accept="application/json"
        class="pa-4"
        @onFileSelected="(file)=>viewModel.loadFile(file, LoadFileType.JSON)"
    >
      <template v-slot:default="{openFile}">
        <div class="pb-4 d-flex flex-row align-center">
          <h4>Json</h4>
          <v-spacer/>
          <EditObjectDialog :obj="rawJson" @save="obj=>viewModel.setRawJson(obj)"/>
          <v-icon-btn v-if="rawJson" icon="md:delete" variant="plain" @click="viewModel.clearJson()" title="Delete"/>
          <v-icon-btn icon="md:upload" variant="plain" @click="openFile" title="Upload"/>
        </div>
        <div v-for="item in viewModel.flattenRawJson.value">
          <v-textarea
              v-model:model-value="item.value"
              @update:modelValue="v=>viewModel.setRawJsonValue(item.key, v)"
              :label="item.key"
              auto-grow rows="1"
          />
        </div>
      </template>
    </FileZone>
  </div>
</template>

<style scoped>

</style>