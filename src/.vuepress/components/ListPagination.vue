<script setup lang="ts">
import { Icon } from "@iconify/vue"
import { computed } from "vue"

const props = withDefaults(
  defineProps<{
    currentPage: number
    totalPages: number
    totalItems: number
    pageSize: number
    unit?: string
  }>(),
  {
    unit: "条",
  },
)

const emit = defineEmits<{
  change: [page: number]
}>()

const pageItems = computed<Array<number | "ellipsis">>(() => {
  const total = props.totalPages
  const current = props.currentPage

  if (total <= 7) {
    return Array.from({ length: total }, (_, index) => index + 1)
  }

  if (current <= 4) {
    return [1, 2, 3, 4, 5, "ellipsis", total]
  }

  if (current >= total - 3) {
    return [
      1,
      "ellipsis",
      total - 4,
      total - 3,
      total - 2,
      total - 1,
      total,
    ]
  }

  return [1, "ellipsis", current - 1, current, current + 1, "ellipsis", total]
})

const startItem = computed(() => {
  if (!props.totalItems) return 0
  return (props.currentPage - 1) * props.pageSize + 1
})

const endItem = computed(() => {
  return Math.min(props.currentPage * props.pageSize, props.totalItems)
})

function goToPage(page: number) {
  if (page < 1 || page > props.totalPages || page === props.currentPage) return
  emit("change", page)
}
</script>

<template>
  <nav
    v-if="totalPages > 1"
    class="list-pagination"
    aria-label="列表分页"
  >
    <span class="list-pagination-summary">
      显示 {{ startItem }}–{{ endItem }}，共 {{ totalItems }} {{ unit }}
    </span>

    <div class="list-pagination-pages">
      <button
        class="list-pagination-button"
        type="button"
        :disabled="currentPage === 1"
        aria-label="上一页"
        @click="goToPage(currentPage - 1)"
      >
        <Icon icon="mdi:chevron-left" />
      </button>

      <template v-for="(item, index) in pageItems" :key="`${item}-${index}`">
        <span v-if="item === 'ellipsis'" class="list-pagination-ellipsis">
          …
        </span>
        <button
          v-else
          class="list-pagination-button"
          :class="{ 'is-active': item === currentPage }"
          type="button"
          :aria-label="`第 ${item} 页`"
          :aria-current="item === currentPage ? 'page' : undefined"
          @click="goToPage(item)"
        >
          {{ item }}
        </button>
      </template>

      <button
        class="list-pagination-button"
        type="button"
        :disabled="currentPage === totalPages"
        aria-label="下一页"
        @click="goToPage(currentPage + 1)"
      >
        <Icon icon="mdi:chevron-right" />
      </button>
    </div>
  </nav>
</template>

<style scoped>
.list-pagination {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.65rem 1rem;

  margin-top: 1rem;
  padding-top: 0.9rem;
  border-top: 1px dashed var(--vp-c-border);
}

.list-pagination-summary {
  color: var(--vp-c-text-mute);

  font-size: 0.75rem;
}

.list-pagination-pages {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.3rem;
}

.list-pagination-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;

  min-width: 2rem;
  height: 2rem;
  padding: 0 0.45rem;
  border: 1px solid var(--vp-c-border);
  border-radius: 0.5rem;

  background: var(--vp-c-bg-elv);
  color: var(--vp-c-text-mute);

  font-size: 0.78rem;
  line-height: 1;
  cursor: pointer;

  transition:
    color var(--vp-t-color),
    border-color var(--vp-t-color),
    background var(--vp-t-color);
}

.list-pagination-button:hover:not(:disabled):not(.is-active) {
  border-color: var(--vp-c-accent);
  color: var(--vp-c-accent);
}

.list-pagination-button.is-active {
  border-color: transparent;

  background: var(--vp-c-accent-bg);
  color: #fff;
  font-weight: 600;
}

.list-pagination-button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.list-pagination-ellipsis {
  min-width: 1.5rem;

  color: var(--vp-c-text-mute);

  font-size: 0.8rem;
  text-align: center;
}

@media (max-width: 719px) {
  .list-pagination {
    justify-content: center;
  }

  .list-pagination-summary {
    width: 100%;

    text-align: center;
  }
}
</style>
