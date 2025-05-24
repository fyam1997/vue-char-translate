<script setup lang="ts">

import {inject} from "vue";
import {ViewModel} from "@/viewmodel/ViewModel.ts";
import {UseFileDialogOptions} from "@vueuse/core";

const viewModel = inject<ViewModel>("viewModel")

const imageSrc = viewModel.imageSrc

const openFile = inject<(localOptions?: Partial<UseFileDialogOptions>) => void>("openFileCallback")
</script>

<template>
  <div v-if="imageSrc">
    <div class="pb-4 d-flex flex-row align-center">
      <h4>Character Image</h4>
      <v-spacer/>
      <v-icon-btn icon="md:delete" variant="plain" @click="viewModel.clearImage()" title="Delete"/>
      <v-icon-btn icon="md:upload" variant="plain" @click="openFile" title="Upload"/>
    </div>
    <v-img
        :src="imageSrc"
        alt="Character image"
        title="Character image"
        class="ml-8 mr-8"
    />
  </div>

  <!--just use v-file-upload UI, won't upload file through it-->
  <v-file-upload
      v-else
      title="Drop Image Here"
  >
    <template v-slot:icon>
      <v-icon icon="md:upload" size="50"/>
    </template>
    <template v-slot:browse>
      <v-btn variant="text" @click="openFile" text="Browse Files" class="text-none" prepend-icon="md:folder_open"/>
    </template>
  </v-file-upload>
</template>

<style scoped>

</style>