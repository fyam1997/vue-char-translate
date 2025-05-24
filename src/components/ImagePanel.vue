<script setup lang="ts">

import {inject} from "vue";
import {ViewModel} from "@/viewmodel/ViewModel.ts";
import {UseFileDialogOptions} from "@vueuse/core";

const viewModel = inject<ViewModel>("viewModel")

const imageSrc = viewModel.imageSrc

const openFile = inject<(localOptions?: Partial<UseFileDialogOptions>) => void>("openFileCallback")
</script>

<template>
  <div>
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
  </div>
</template>

<style scoped>

</style>