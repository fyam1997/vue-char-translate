<script setup lang="ts">
import {inject} from "vue";
import {ViewModel} from "@/viewmodel/ViewModel.ts";
import EditObjectDialog from "@/components/EditObjectDialog.vue";
import FlattenJsonList from "@/components/FlattenJsonList.vue";

const viewModel = inject<ViewModel>("viewModel")
const translatedJson = viewModel.translatedJson

</script>

<template>
  <div class="h-100 d-flex flex-column">
    <div class="overflow-y-auto flex-grow-1 pa-4">
      <div class="pb-4 d-flex flex-row align-center">
        <h4>Translated</h4>
        <v-spacer/>
        <EditObjectDialog
            v-if="!viewModel.loading.value"
            :obj="translatedJson.getSrcValue()"
            @save="obj=>viewModel.setTranslatedJson(obj)"
        />
      </div>
      <div class="text-caption text-disabled">{{ viewModel.loadingText.value }}</div>
      <FlattenJsonList :flatten-json="viewModel.translatedJson"/>
    </div>
    <v-divider/>
    <div class="d-flex flex-row ga-2 ma-4">
      <v-btn @click="viewModel.downloadJson()" prepend-icon="md:download" text="Json"
             :loading="viewModel.loading.value"
             class="text-none flex-grow-1" variant="outlined"/>
      <v-btn @click="viewModel.downloadImage()" prepend-icon="md:download" text="Image"
             :loading="viewModel.loading.value"
             :disabled="!viewModel.image.value"
             class="text-none flex-grow-1" variant="outlined"/>
    </div>
  </div>
</template>

<style scoped>

</style>