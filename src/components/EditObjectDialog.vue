<script setup lang="ts">
import {ref, watch} from 'vue'
import {parseJsonOrNull} from "@/viewmodel/JsonUtils.ts";

const props = defineProps<{
  obj: object
  buttonText?: string
}>()

const emits = defineEmits<{
  save: [object]
}>()

const editText = ref("")
const showDialog = ref(false)
const errorMsg = ref("")


function save() {
  const result = parseJsonOrNull(editText.value)
  if (result) {
    emits('save', result)
    showDialog.value = false
  } else {
    errorMsg.value = "Invalid JSON!"
  }
}

function openDialog() {
  if (Object.keys(props.obj).length > 0) {
    editText.value = JSON.stringify(props.obj, null, 2)
  } else {
    editText.value = ""
  }
  showDialog.value = true
}

watch(editText, () => {
  errorMsg.value = ""
})

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
          v-if="!buttonText"
          icon="md:edit_note"
          variant="plain"
          @click="openDialog"
      />
      <v-btn
          v-else
          prepend-icon="md:edit_note"
          variant="text"
          class="text-none"
          :text="buttonText"
          @click="openDialog"
      />
    </template>

    <v-card>
      <v-card-text class="flex-grow-1">
        <v-textarea
            v-model="editText"
            auto-grow
            :error-messages="errorMsg"
        />
      </v-card-text>

      <v-card-actions>
        <v-btn class="text-none w-100" text="Save" @click="save"/>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>

</style>
