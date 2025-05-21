<script setup lang="ts">
import {ViewModel} from "@/viewmodel/ViewModel.ts";
import {computed, onMounted, provide, ref} from "vue";
import ConfigPanel from "@/components/ConfigPanel.vue";
import RawPanel from "@/components/RawPanel.vue";
import ResultPanel from "@/components/ResultPanel.vue";
import {useWindowSize} from "@vueuse/core";

const viewModel = new ViewModel()
provide("viewModel", viewModel)

onMounted(() => {
  viewModel.loadCachedImage()
})

const screenWidth = useWindowSize().width
const largeScreen = computed(() => screenWidth.value >= 950)
const tab = ref("chat-panel")

</script>

<template>
  <v-app :theme="viewModel.theme.value">
    <v-snackbar-queue v-model="viewModel.snackbarMessages.value" location="top"></v-snackbar-queue>
    <div v-if="!largeScreen" class="w-100 h-100 d-flex flex-column">
      <div>
        <v-tabs
            v-model="tab"
            fixed-tabs
            class="flex-grow-0"
        >
          <v-tab value="config-panel" class="text-none">Config</v-tab>
          <v-tab value="raw-panel" class="text-none">Raw</v-tab>
          <v-tab value="translated-panel" class="text-none">Translated</v-tab>
        </v-tabs>
      </div>
      <v-divider/>
      <v-tabs-window v-model="tab" class="h-100 flex-grow-1">
        <v-tabs-window-item value="config-panel" class="h-100">
          <ConfigPanel/>
        </v-tabs-window-item>

        <v-tabs-window-item value="raw-panel" class="h-100">
          <RawPanel/>
        </v-tabs-window-item>

        <v-tabs-window-item value="translated-panel" class="h-100">
          <ResultPanel/>
        </v-tabs-window-item>
      </v-tabs-window>
    </div>

    <div v-else class="w-100 h-100 d-flex flex-row ga-2 justify-center overflow-x-auto">
      <ConfigPanel class="config-panel-large flex-grow-0"/>
      <v-divider vertical class="mt-4 mb-4"/>
      <RawPanel class="content-panel-large flex-grow-1"/>
      <v-divider vertical class="mt-4 mb-4"/>
      <ResultPanel class="content-panel-large flex-grow-1"/>
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
