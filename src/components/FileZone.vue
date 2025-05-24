<script setup lang="ts">
import {provide, useTemplateRef} from "vue";
import {useDropZone, useFileDialog, UseFileDialogOptions} from "@vueuse/core";

const props = defineProps<{
  accept: string
}>()
const emits = defineEmits<{
  onFileSelected: [File],
}>()

const {open, onChange, reset} = useFileDialog({
  accept: props.accept,
  directory: false,
  multiple: false,
})

provide<(localOptions?: Partial<UseFileDialogOptions>) => void>("openFileCallback", open)

const dropZoneRef = useTemplateRef("dropZoneRef")

const zone = useDropZone(dropZoneRef, {
  onDrop: onDrop,
  dataTypes: props.accept.split(","),
  multiple: false,
})
const isOverDropZone = zone.isOverDropZone


async function onDrop(files: File[] | null) {
  if (files) {
    emits("onFileSelected", files[0])
  }
}

onChange(async (files) => {
  if (files) {
    emits("onFileSelected", files[0])
    reset()
  }
})

</script>

<template>
  <div ref="dropZoneRef" class="position-relative">
    <slot name="default"/>

    <Transition>
      <h1 v-show="isOverDropZone" class="drop-target-overlay ma-4">
        Drop file here
      </h1>
    </Transition>
  </div>
</template>

<style scoped>
.drop-target-overlay {
  position: absolute;
  inset: 0;
  /*noinspection CssUnresolvedCustomProperty*/
  background: rgba(var(--v-theme-on-surface), 0.32);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  /*noinspection CssUnresolvedCustomProperty*/
  border: 2px dashed rgba(var(--v-border-color), var(--v-border-opacity));
}

/*noinspection CssUnusedSymbol*/
.v-enter-active,
.v-leave-active {
  transition: opacity 0.2s ease;
}

/*noinspection CssUnusedSymbol*/
.v-enter-from,
.v-leave-to {
  opacity: 0;
}

</style>