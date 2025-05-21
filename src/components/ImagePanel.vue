<script setup lang="ts">

import FileZone from "@/components/FileZone.vue";
import {inject} from "vue";
import {ViewModel} from "@/viewmodel/ViewModel.ts";
import {LoadFileType} from "@/viewmodel/ReadFileContent.ts";
import EditObjectDialog from "@/components/EditObjectDialog.vue";
import FlattenJsonList from "@/components/FlattenJsonList.vue";

const viewModel = inject<ViewModel>("viewModel")

const imageSrc = viewModel.imageSrc
</script>

<template>
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
</template>

<style scoped>

</style>