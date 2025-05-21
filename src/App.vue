<script setup lang="ts">
import {ViewModel} from "@/viewmodel/ViewModel.ts";
import {provide} from "vue";
import SimpleUI from "@/components/SimpleUI.vue";
import ConfigPanel from "@/components/ConfigPanel.vue";
import RawPanel from "@/components/RawPanel.vue";

const viewModel = new ViewModel()
provide("viewModel", viewModel)

</script>

<template>
  <v-app :theme="viewModel.theme.value">
    <v-snackbar-queue v-model="viewModel.snackbarMessages.value" location="top"></v-snackbar-queue>
    <div class="w-100 h-100 d-flex flex-row ga-2 justify-center">
      <ConfigPanel class="config-panel-large w-100 h-100 pa-4"/>
      <RawPanel class="raw-panel-large w-100 h-100 pa-4"/>
      <SimpleUI class="flex-grow-1"/>
    </div>
  </v-app>
</template>

<style scoped>
.config-panel-large {
  max-width: 300px;
}

.raw-panel-large {
  max-width: 600px;
}
</style>
