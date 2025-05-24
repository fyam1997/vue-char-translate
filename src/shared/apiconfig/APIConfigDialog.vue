<script setup lang="ts">
import {inject, ref} from "vue";
import {APIConfigStorage} from "@/shared/apiconfig/APICondigStorage.ts";

const apiConfigStorage = inject<APIConfigStorage>("apiConfigStorage")
const apiConfig = apiConfigStorage.config
const showDialog = ref(false)

</script>

<template>
  <v-dialog
      max-width="600"
      scroll-strategy="none"
      v-model="showDialog"
      scrollable
  >
    <template v-slot:activator>
      <v-btn
          class="text-none"
          append-icon="md:arrow_drop_down"
          variant="outlined"
          @click="showDialog=true"
          text="Config API"
      />
    </template>

    <v-card>
      <v-card-text class="flex-grow-1">
        <div class="d-flex flex-column ga-4">
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
        </div>
      </v-card-text>

      <v-card-actions>
        <v-btn class="text-none w-100" text="Done" @click="showDialog=false"/>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>

</style>