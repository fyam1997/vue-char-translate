<script setup lang="ts">
import {ViewModel} from "@/viewmodel/ViewModel.ts";
import {provide} from "vue";
import ConfigPanel from "@/components/ConfigPanel.vue";
import RawPanel from "@/components/RawPanel.vue";
import ResultPanel from "@/components/ResultPanel.vue";

const viewModel = new ViewModel()
provide("viewModel", viewModel)

</script>

<template>
  <v-app :theme="viewModel.theme.value">
    <v-snackbar-queue v-model="viewModel.snackbarMessages.value" location="top"></v-snackbar-queue>
    <div class="w-100 h-100 d-flex flex-row ga-2 justify-center">
      <ConfigPanel class="config-panel-large w-100 h-100 pa-4"/>
      <div class="content-panel-large flex-grow-1 pa-4 d-flex flex-column">
        <RawPanel class="raw-panel-large w-100 flex-grow-1 pa-4"/>
        <v-divider/>
        <v-btn class="ma-4 text-none" prepend-icon="md:translate" variant="outlined" @click="viewModel.translate()" text="Translate"/>
      </div>
      <ResultPanel class="content-panel-large flex-grow-1 pa-4"/>
    </div>
  </v-app>
</template>

<style scoped>
.config-panel-large {
  max-width: 300px;
}

.content-panel-large {
  max-width: 600px;
}
</style>
