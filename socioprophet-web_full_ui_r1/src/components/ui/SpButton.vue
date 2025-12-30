<template>
  <button class="ui-btn" :class="variant" :disabled="disabled" :type="type" @click="$emit('click', $event)">
    <slot />
  </button>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  variant?: 'primary' | 'ghost' | 'danger' | ''
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
}>(), {
  variant: '',
  disabled: false,
  type: 'button'
})
defineEmits<{ (e:'click', ev: MouseEvent): void }>()
</script>
