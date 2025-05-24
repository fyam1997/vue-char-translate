<script setup lang="ts">

import {inject} from "vue";
import {ViewModel} from "@/viewmodel/ViewModel.ts";
import EditObjectDialog from "@/components/EditObjectDialog.vue";
import FlattenJsonList from "@/components/FlattenJsonList.vue";
import {UseFileDialogOptions} from "@vueuse/core";

const viewModel = inject<ViewModel>("viewModel")

const rawJson = viewModel.rawJson

const openFile = inject<(localOptions?: Partial<UseFileDialogOptions>) => void>("openFileCallback")
</script>

<template>
  <div>
    <div class="pb-4 d-flex flex-row align-center">
      <h4>Character Spec</h4>
      <v-spacer/>
      <EditObjectDialog :obj="rawJson.getSrcValue()" @save="obj=>viewModel.setRawJson(obj)"/>
      <v-icon-btn v-if="!rawJson.isEmpty()" icon="md:delete" variant="plain" @click="viewModel.clearJson()"
                  title="Delete"/>
      <v-icon-btn icon="md:upload" variant="plain" @click="openFile" title="Upload"/>
    </div>
    <FlattenJsonList :flatten-json="viewModel.rawJson"/>
  </div>
</template>

<style scoped>

</style>