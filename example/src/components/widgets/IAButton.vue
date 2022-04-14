<template>
  <button :to="to" type="button" class="ia-button" :disabled="loading || disabled">
    <Spinner v-if="loading" color="#868692" />
    <template v-else>
      <slot name="leading-icon" />
      <span>
        {{ text }}
      </span>
      <slot name="trailing-icon" />
    </template>
  </button>
</template>

<script lang="ts" setup>
import { toRefs } from 'vue'
import { RouteLocationRaw } from 'vue-router'
import Spinner from './Spinner.vue'

const props = withDefaults(
  defineProps<{
    text?: string
    loading?: boolean
    disabled?: boolean
    to?: RouteLocationRaw
  }>(),
  {
    type: undefined,
    size: undefined,
    text: undefined,
    to: undefined,
  },
)

const { text } = toRefs(props)
</script>

<style lang="postcss" scoped>
.ia-button {
  font-size: 19px;
  padding: 8px 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 12px;
  min-height: 40px;
  cursor: pointer;
  background-color: transparent;
  transition: background-color 0.2s;
  color: white;
  background-color: #0e0051;
  &:not(:disabled) {
    &:hover {
      background-color: #1e0286;
    }
    &:active {
      background-color: #0e0051;
    }
  }
  &:disabled {
    color: #868692;
    background-color: #efeff0;
    border: none;
    cursor: default;
  }
}
</style>
