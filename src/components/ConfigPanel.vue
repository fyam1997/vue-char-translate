<script setup lang="ts">
import {ViewModel} from "@/viewmodel/ViewModel.ts";
import {inject} from "vue";

const viewModel = inject<ViewModel>("viewModel")
const apiConfig = viewModel.apiConfig
const appVersion = __APP_VERSION__

</script>

<template>
  <div class="d-flex flex-column ga-4 overflow-y-auto">
    <div>
      <v-alert border="start">
        Configuration is only saved in the browser.
        Please clear API key before leave if you are using public devices.
      </v-alert>
    </div>
    <v-text-field
        variant="outlined"
        label="BaseURL"
        v-model="apiConfig.baseURL"
        class="flex-grow-0"
        hide-details
    />
    <v-text-field
        variant="outlined"
        label="ApiKey"
        type="password"
        v-model="apiConfig.apiKey"
        class="flex-grow-0"
        hide-details
    />
    <v-text-field
        variant="outlined"
        label="Model"
        v-model="apiConfig.model"
        class="flex-grow-0"
        hide-details
    />
    <v-textarea
        variant="outlined"
        label="Translation Prompt"
        v-model="viewModel.prompt.value"
        class="flex-grow-0"
        hide-details
    />

    <v-spacer/>
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