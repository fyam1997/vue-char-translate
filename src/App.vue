<script setup lang="ts">
import {ViewModel} from "@/viewmodel/ViewModel.ts";
import {provide} from "vue";
import SimpleUI from "@/components/SimpleUI.vue";

const viewModel = new ViewModel()
provide("viewModel", viewModel)

</script>

<template>
  <v-app :theme="viewModel.theme.value">
    <v-snackbar-queue v-model="viewModel.snackbarMessages.value" location="top"></v-snackbar-queue>
    <SimpleUI/>
  </v-app>
</template>

<style scoped>
</style>
