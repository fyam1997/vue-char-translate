<script setup lang="ts">
import {inject} from "vue";
import {ViewModel} from "@/viewmodel/ViewModel.ts";
import EditObjectDialog from "@/components/EditObjectDialog.vue";

const viewModel = inject<ViewModel>("viewModel")
const translatedJson = viewModel.translatedJson

</script>

<template>
  <div class="h-100 d-flex flex-column ga-2">
    <div class="overflow-y-auto flex-grow-1">
      <h4>Translated</h4>
      <EditObjectDialog :text="translatedJson" @save="obj=>viewModel.setTranslatedJson(obj)"/>
    </div>
    <v-divider/>
    <div class="d-flex flex-row ga-2 ma-4">
      <v-btn @click="viewModel.downloadJson()" prepend-icon="md:download" text="Download Json" class="text-none flex-grow-1" variant="outlined"/>
      <v-btn @click="viewModel.downloadImage()" prepend-icon="md:download" text="Download Image" class="text-none flex-grow-1" variant="outlined"/>
    </div>
  </div>
</template>

<style scoped>

</style>