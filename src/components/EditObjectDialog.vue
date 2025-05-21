<script setup lang="ts">
import {ref, watch} from 'vue'
import {parseJsonOrNull} from "@/viewmodel/JsonUtils.ts";

const props = defineProps<{
  text: string
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
  }else{
    errorMsg.value = "Invalid JSON!"
  }
}

function openDialog() {
  editText.value = props.text
  showDialog.value = true
}

watch(editText, ()=>{
  errorMsg.value = ""
})

</script>

<template>
  <v-dialog
      max-width="600"
      scroll-strategy="none"
      v-model="showDialog"
  >
    <template v-slot:activator>
      <v-btn
          icon="md:edit_note"
          variant="plain"
          @click="openDialog"
      />
    </template>

    <v-card>
      <v-card-text class="flex-grow-1">
        <v-textarea
            v-model="editText"
            auto-grow
            max-rows="20"
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
