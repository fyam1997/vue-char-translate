<script setup lang="ts">
import {ViewModel} from "@/viewmodel/ViewModel.ts";
import {onMounted, provide} from "vue";
import ConfigPanel from "@/components/ConfigPanel.vue";
import RawPanel from "@/components/RawPanel.vue";
import ResultPanel from "@/components/ResultPanel.vue";

const viewModel = new ViewModel()
provide("viewModel", viewModel)

onMounted(() => {
  viewModel.loadCachedImage()
})

</script>

<template>
  <v-app :theme="viewModel.theme.value">
    <v-snackbar-queue v-model="viewModel.snackbarMessages.value" location="top"></v-snackbar-queue>
    <div class="w-100 h-100 d-flex flex-row ga-2 justify-center overflow-x-auto">
      <ConfigPanel class="config-panel-large flex-grow-0 h-100 pa-4"/>
      <RawPanel class="content-panel-large flex-grow-1 pa-4"/>
      <ResultPanel class="content-panel-large flex-grow-1 pa-4"/>
    </div>
  </v-app>
</template>

<style scoped>
.config-panel-large {
  min-width: 300px;
  max-width: 300px;
}

.content-panel-large {
  min-width: 300px;
  max-width: 600px;
  width: 50%;
}
</style>
