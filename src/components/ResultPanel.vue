<script setup lang="ts">
import {computed, inject} from "vue";
import {ViewModel} from "@/viewmodel/ViewModel.ts";
import EditObjectDialog from "@/components/EditObjectDialog.vue";
import FlattenJsonList from "@/components/FlattenJsonList.vue";

const viewModel = inject<ViewModel>("viewModel")
const translatedJson = viewModel.translatedJson

const loading = viewModel.loading
const imageDisabled = computed(() => !viewModel.image.value)
const jsonDisabled = computed(() => translatedJson.isEmpty())
</script>

<template>
  <div v-if="!jsonDisabled" class="h-100 d-flex flex-column">
    <div class="overflow-y-auto flex-grow-1 pa-4">
      <div class="pb-4 d-flex flex-row align-center">
        <h4>Translated</h4>
        <v-spacer/>
        <EditObjectDialog
            v-if="!loading"
            :obj="translatedJson.getSrcValue()"
            @save="obj=>viewModel.setTranslatedJson(obj)"
        />
      </div>
      <FlattenJsonList :flatten-json="translatedJson"/>
    </div>
    <v-divider/>
    <div class="d-flex flex-row ga-2 ma-4">
      <v-btn @click="viewModel.downloadJson()" prepend-icon="md:download" text="Json"
             :disabled="jsonDisabled"
             :loading="loading"
             class="text-none flex-grow-1" variant="outlined"/>
      <v-btn @click="viewModel.downloadImage()" prepend-icon="md:download" text="Image"
             :loading="loading"
             :disabled="imageDisabled"
             class="text-none flex-grow-1" variant="outlined"/>
    </div>
  </div>

  <div v-else-if="!loading" class="h-100 d-flex flex-column align-center justify-center overflow-y-auto">
    <h2>No translation</h2>
    <v-btn
        class="text-none"
        prepend-icon="md:translate"
        variant="text"
        @click="viewModel.translate()"
        text="Translate"
        :loading="loading"
    />
    or
    <EditObjectDialog
        button-text="Manually edit"
        :obj="translatedJson.getSrcValue()"
        @save="obj=>viewModel.setTranslatedJson(obj)"
    />
  </div>

  <div v-else class="h-100 d-flex flex-column justify-center overflow-y-auto">
    <div class="text-caption text-disabled">{{ viewModel.loadingText.value }}</div>
  </div>
</template>

<style scoped>

</style>