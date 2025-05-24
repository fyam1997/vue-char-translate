<script setup lang="ts">
import {computed, inject, ref, watch} from "vue";
import {APIConfigIndex, APIConfigStorage} from "@/shared/apiconfig/APICondigStorage.ts";

const showDialog = ref(false)
const store = inject<APIConfigStorage>("apiConfigStorage")
const apiConfig = store.config

const idList = store.idList
const selectedItem = computed(() => {
  const found = idList.value.find(item => item.id === store.id.value)
  return found ?? idList.value[0]
})

function itemProps(item: APIConfigIndex) {
  let name = item.name
  if (!name) {
    name = "No name"
  }
  return {title: name}
}

function itemSelected(item: APIConfigIndex) {
  store.id.value = item.id
}

function addNewConfig() {
  const newID = Date.now()
  idList.value.push({id: newID, name: ""})
  store.id.value = newID
}

function deleteConfig() {
  if (idList.value.length > 1) {
    const deleteID = store.id.value
    const index = idList.value.findIndex(item => item.id === deleteID)
    if (index !== -1) {
      idList.value.splice(index, 1)
      store.id.value = idList.value[0].id
      store.removeConfig(deleteID)
    }
  } else {
    apiConfig.value = {baseURL: "", apiKey: "", model: ""}
  }
}

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
          prepend-icon="md:settings"
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
          <div class="d-flex flex-row align-center">
            <v-select
                variant="outlined"
                :model-value="selectedItem"
                :items="idList"
                :item-props="itemProps"
                @update:model-value="itemSelected"
                hide-details
            />
            <v-btn
                icon="md:note_add"
                variant="plain"
                @click="addNewConfig"
                title="Add config"
            />
            <v-btn
                icon="md:delete"
                variant="plain"
                @click="deleteConfig"
                title="Delete config"
            />
          </div>
          <v-text-field
              variant="outlined"
              label="Config name"
              v-model="selectedItem.name"
              class="flex-grow-0"
              hide-details
          />
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