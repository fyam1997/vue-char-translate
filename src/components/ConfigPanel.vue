<script setup lang="ts">
import {ViewModel} from "@/viewmodel/ViewModel.ts";
import {inject} from "vue";
import ApiConfigDialog from "@/shared/apiconfig/APIConfigDialog.vue";

const viewModel = inject<ViewModel>("viewModel")
const appVersion = __APP_VERSION__

</script>

<template>
  <div class="h-100 d-flex flex-column ga-4 overflow-y-auto pa-4">
    <ApiConfigDialog/>
    <v-textarea
        variant="outlined"
        label="Translation Prompt"
        v-model="viewModel.prompt.value"
        class="flex-grow-1"
        auto-grow
        hide-details
    />

    <v-divider/>

    <v-list-item
        :prepend-icon="viewModel.toggleThemeIcon.value"
        @click="viewModel.toggleDarkTheme()"
        title="Change theme"
        class="text-none"
        density="compact"
    />
    <v-list-item
        prepend-icon="md:bug_report"
        @click="viewModel.openBugReport()"
        title="Bug report"
        class="text-none"
        density="compact"
    />
    <v-list-item :subtitle="'version: '+appVersion"/>
  </div>
</template>

<style scoped>

</style>