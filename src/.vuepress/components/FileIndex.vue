<script setup lang="ts">
import { Icon } from "@iconify/vue"
import {
  computed,
  nextTick,
  onBeforeUnmount,
  ref,
  useSlots,
  watch,
} from "vue"
import FileEntry from "./FileEntry.vue"
import ListPagination from "./ListPagination.vue"

interface FileEntryData {
  name: string
  description?: string
  url: string
  icon?: string
  format?: string
}

const DEFAULT_PAGE_SIZE = 20

const props = defineProps<{
  pageSize?: number
}>()

const slots = useSlots()
const fileItems = computed<FileEntryData[]>(() => {
  const nodes = slots.default?.() ?? []

  return nodes
    .filter((node) => node.type === FileEntry)
    .map((node) => node.props as FileEntryData)
})

const keyword = ref("")
const pageSize = computed(() =>
  Math.max(1, Math.round(props.pageSize ?? DEFAULT_PAGE_SIZE)),
)
const sectionElement = ref<HTMLElement>()
const copiedFileUrl = ref("")
let copyFeedbackTimer: number | undefined

function matchesFileSearch(file: FileEntryData, query: string): boolean {
  const searchableText = [file.name, file.description ?? "", file.format ?? ""]
    .join(" ")
    .toLowerCase()

  return searchableText.includes(query)
}

const filteredFiles = computed(() => {
  const query = keyword.value.trim().toLowerCase()

  if (!query) return fileItems.value

  return fileItems.value.filter((file) => matchesFileSearch(file, query))
})

const currentPage = ref(1)
const totalItems = computed(() => filteredFiles.value.length)
const totalPages = computed(() =>
  Math.max(1, Math.ceil(totalItems.value / pageSize.value)),
)
const paginatedItems = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return filteredFiles.value.slice(start, start + pageSize.value)
})

function resetPage() {
  currentPage.value = 1
}

watch(keyword, resetPage)
watch(totalPages, (pages) => {
  if (currentPage.value > pages) currentPage.value = pages
})

async function handlePageChange(page: number) {
  if (page < 1 || page > totalPages.value || page === currentPage.value) return

  currentPage.value = page
  await nextTick()

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches
  sectionElement.value?.scrollIntoView({
    behavior: reduceMotion ? "auto" : "smooth",
    block: "start",
  })
}

function getFileFormat(file: FileEntryData): string {
  if (file.format) return file.format

  const extension = file.url.split("?")[0]?.split(".").pop()
  return extension ? extension.toUpperCase() : "FILE"
}

function getFileHost(url: string): string {
  try {
    return new URL(url).hostname
  } catch {
    return url
  }
}

function clearSearch() {
  keyword.value = ""
}

//Clipboard API怎么用来着？
async function copyFileLink(file: FileEntryData) {
  try {
    await navigator.clipboard.writeText(file.url)
  } catch {
    const textArea = document.createElement("textarea")
    textArea.value = file.url
    textArea.style.position = "fixed"
    textArea.style.opacity = "0"
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand("copy")
    textArea.remove()
  }

  copiedFileUrl.value = file.url
  window.clearTimeout(copyFeedbackTimer)
  copyFeedbackTimer = window.setTimeout(() => {
    if (copiedFileUrl.value === file.url) copiedFileUrl.value = ""
  }, 1600)
}

onBeforeUnmount(() => {
  window.clearTimeout(copyFeedbackTimer)
})
</script>

<template>
  <section ref="sectionElement" class="file-index">
    <header class="file-index-toolbar">
      <div class="file-index-summary">
        <span class="file-index-summary-text">共</span>
        <span class="file-index-count">{{ fileItems.length }}</span>
        <span class="file-index-summary-text">个文件</span>
      </div>

      <label class="file-index-search">
        <Icon class="file-index-search-icon" icon="mdi:magnify" />
        <input
          v-model="keyword"
          type="search"
          placeholder="搜索文件名或描述"
          aria-label="搜索文件"
        />
        <button
          v-if="keyword"
          class="file-index-clear"
          type="button"
          aria-label="清空搜索"
          @click="clearSearch"
        >
          <Icon icon="mdi:close-circle" />
        </button>
      </label>
    </header>

    <ul v-if="filteredFiles.length" class="file-list">
      <li
        v-for="file in paginatedItems"
        :key="file.url"
        class="file-row"
      >
        <span class="file-row-icon">
          <Icon :icon="file.icon ?? 'mdi:file-download-outline'" />
        </span>

        <div class="file-row-main">
          <div class="file-row-title">
            <h2 class="file-row-name">{{ file.name }}</h2>
            <span class="file-row-format">{{ getFileFormat(file) }}</span>
          </div>

          <p class="file-row-desc">
            {{ file.description ?? "暂无描述" }}
          </p>

          <span class="file-row-host" :title="file.url">
            <Icon icon="mdi:cloud-outline" />
            {{ getFileHost(file.url) }}
          </span>
        </div>

        <div class="file-row-actions">
          <button
            class="file-row-action"
            :class="{ 'is-copied': copiedFileUrl === file.url }"
            type="button"
            :aria-label="`复制 ${file.name} 的下载链接`"
            :title="copiedFileUrl === file.url ? '已复制' : '复制下载链接'"
            @click="copyFileLink(file)"
          >
            <Icon
              :icon="copiedFileUrl === file.url ? 'mdi:check' : 'mdi:link-variant'"
            />
            <span>{{ copiedFileUrl === file.url ? "已复制" : "复制" }}</span>
          </button>

          <a
            class="file-row-download"
            :href="file.url"
            target="_blank"
            rel="noopener noreferrer"
            :aria-label="`下载 ${file.name}`"
          >
            <Icon icon="mdi:download" />
            <span>下载</span>
          </a>
        </div>
      </li>
    </ul>

    <ListPagination
      v-if="filteredFiles.length"
      :current-page="currentPage"
      :total-pages="totalPages"
      :total-items="totalItems"
      :page-size="pageSize"
      @change="handlePageChange"
    />

    <div v-if="!filteredFiles.length" class="file-index-empty">
      <Icon icon="mdi:folder-search-outline" />
      <p>没有找到匹配的文件</p>
      <button type="button" @click="clearSearch">清除搜索</button>
    </div>
  </section>
</template>

<style scoped>
.file-index {
  margin-top: 0.5rem;
  scroll-margin-top: calc(var(--navbar-height) + 1rem);
}

.file-index-toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem 1rem;

  margin-bottom: 1rem;
}

.file-index-summary {
  display: flex;
  align-items: baseline;
  gap: 0.4rem;

  color: var(--vp-c-text-mute);

  font-size: 0.875rem;
}

.file-index-count {
  color: var(--vp-c-accent);

  font-weight: 700;
  font-size: 1.5rem;
  line-height: 1;
}

.file-index-search {
  display: flex;
  flex: 0 1 320px;
  align-items: center;
  gap: 0.5rem;

  box-sizing: border-box;

  min-width: 200px;
  padding: 0.55rem 0.9rem;

  border: 1px solid var(--vp-c-border);
  border-radius: 999px;

  background: var(--vp-c-bg-elv);

  transition:
    border-color var(--vp-t-color),
    box-shadow var(--vp-t-color),
    background var(--vp-t-color);
}

.file-index-search:focus-within {
  border-color: var(--vp-c-accent);
  background: var(--vp-c-bg);
  box-shadow: 0 0 0 4px var(--vp-c-accent-soft);
}

.file-index-search-icon {
  flex-shrink: 0;

  width: 1.15rem;
  height: 1.15rem;

  color: var(--vp-c-text-mute);
  font-size: 1.15rem;
}

.file-index-search input {
  flex: 1;

  min-width: 0;
  padding: 0;
  border: 0;
  outline: 0;

  background: transparent;
  color: var(--vp-c-text);

  font-size: 0.9rem;
}

.file-index-search input::placeholder {
  color: var(--vp-c-text-mute);
}

.file-index-search input::-webkit-search-cancel-button {
  display: none;
}

.file-index-clear {
  display: flex;
  align-items: center;
  justify-content: center;

  padding: 0;
  border: 0;

  background: transparent;
  color: var(--vp-c-text-mute);

  font-size: 1.1rem;
  cursor: pointer;
}

.file-index-clear:hover {
  color: var(--vp-c-accent);
}

.file-list {
  overflow: hidden;

  margin: 0;
  padding: 0;

  border: 1px solid var(--vp-c-border);
  border-radius: 0.9rem;

  background: var(--vp-c-bg-elv);
  box-shadow: 0 1px 3px var(--vp-c-shadow);

  list-style: none;
}

.file-row {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: 0.85rem;

  box-sizing: border-box;

  padding: 0.8rem 1rem;
  border-top: 1px solid var(--vp-c-border);

  transition: background var(--vp-t-color);
}

.file-row:first-child {
  border-top: 0;
}

.file-row:hover {
  background: var(--vp-c-grey-soft);
}

.file-row-icon {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;

  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.75rem;

  background: var(--vp-c-accent-soft);
  color: var(--vp-c-accent);

  font-size: 1.25rem;
}

.file-row-main {
  min-width: 0;
}

.file-row-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;

  min-width: 0;
}

.file-row-name {
  overflow: hidden;

  margin: 0;

  color: var(--vp-c-text);

  font-size: 0.95rem;
  font-weight: 600;
  line-height: 1.45;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.file-row-format {
  flex-shrink: 0;

  padding: 0.12rem 0.45rem;
  border-radius: 0.35rem;

  background: var(--vp-c-accent-soft);
  color: var(--vp-c-accent);

  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.04em;
}

.file-row-desc {
  margin: 0.2rem 0 0;

  color: var(--vp-c-text-mute);

  font-size: 0.8rem;
  line-height: 1.55;
}

.file-row-host {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;

  margin-top: 0.3rem;

  color: var(--vp-c-text-mute);

  font-size: 0.68rem;
}

.file-row-host svg {
  flex-shrink: 0;
}

.file-row-actions {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: flex-end;
  gap: 0.4rem;
}

.file-row-action,
.file-row-download {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.3rem;

  height: 2rem;
  padding: 0 0.7rem;
  border: 1px solid var(--vp-c-border);
  border-radius: 0.55rem;

  background: var(--vp-c-bg);
  color: var(--vp-c-text-mute);

  font-size: 0.78rem;
  line-height: 1;
  text-decoration: none;
  white-space: nowrap;
  cursor: pointer;

  transition:
    color var(--vp-t-color),
    background var(--vp-t-color),
    border-color var(--vp-t-color),
    transform var(--vp-t-transform);
}

.file-row-action:hover,
.file-row-action.is-copied {
  border-color: var(--vp-c-accent);
  color: var(--vp-c-accent);
}

.file-row-download {
  border-color: transparent;

  background: var(--vp-c-accent-bg);
  color: #fff;
  font-weight: 600;
}

.file-row-download:hover {
  transform: translateY(-1px);

  box-shadow: 0 6px 16px rgba(185, 156, 219, 0.35);
}

.file-index-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.6rem;

  padding: 3rem 1rem;

  color: var(--vp-c-text-mute);
  text-align: center;
}

.file-index-empty svg {
  width: 3rem;
  height: 3rem;

  opacity: 0.65;
  font-size: 3rem;
}

.file-index-empty p {
  margin: 0;
}

.file-index-empty button {
  padding: 0.4rem 1rem;
  border: 1px solid var(--vp-c-border);
  border-radius: 999px;

  background: var(--vp-c-bg-elv);
  color: var(--vp-c-text);

  cursor: pointer;
}

.file-index-empty button:hover {
  border-color: var(--vp-c-accent);
  color: var(--vp-c-accent);
}

@media (max-width: 719px) {
  .file-row {
    grid-template-columns: auto minmax(0, 1fr);
    gap: 0.65rem 0.75rem;

    padding: 0.9rem;
  }

  .file-row-actions {
    grid-column: 1 / -1;

    padding-left: 3.15rem;
  }
}

@media (max-width: 419px) {
  .file-index-toolbar {
    flex-direction: column;
    align-items: stretch;
  }

  .file-index-search {
    flex-basis: auto;
    width: 100%;
  }

  .file-row {
    padding: 0.8rem 0.75rem;
  }

  .file-row-name {
    white-space: normal;
  }

  .file-row-desc {
    display: -webkit-box;
    overflow: hidden;

    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
  }

  .file-row-host {
    display: none;
  }

  .file-row-actions {
    width: 100%;

    padding-left: 0;
  }

  .file-row-download {
    flex: 1;
  }
}
</style>
