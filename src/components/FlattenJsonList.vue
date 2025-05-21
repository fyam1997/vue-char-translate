<script setup lang="ts">
import {FlattenJson} from "@/viewmodel/JsonUtils.ts";

defineProps<{
  flattenJson: FlattenJson
}>()
</script>

<template>
  <div v-for="item in flattenJson.flattenArray.value">
    <v-textarea
        v-model:model-value="item.value"
        @update:modelValue="v=>flattenJson.setValue(item.key, v)"
        :label="item.key"
        auto-grow rows="1"
    />
  </div>
</template>

<style scoped>

</style>