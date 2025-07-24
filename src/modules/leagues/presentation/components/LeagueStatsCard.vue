<template>
  <q-card flat bordered class="league-stats-card full-height" :color="color" v-ripple>
    <q-card-section class="text-center">
      <p :class="[valueClass, 'text-primary']">{{ value }}</p>
      <p class="text-secondary text-weight-regular q-ma-none">{{ label }}</p>
      <span v-if="subLabel" class="text-caption text-grey-8">{{ subLabel }}</span>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  icon: string;
  value: string | number;
  label: string;
  subLabel?: string;
  color?: string;
  size?: 'sm' | 'md' | 'lg';
}

const props = withDefaults(defineProps<Props>(), {
  color: 'primary',
  size: 'md',
});

const valueClass = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'text-h5 q-mt-sm';
    case 'lg':
      return 'text-h3 q-mt-md';
    default:
      return 'text-h4 q-mt-sm';
  }
});
</script>
