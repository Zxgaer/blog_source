<script setup lang="ts">
defineProps<{
  name: string
  icon: string
  description: string
  link: string
}>()

function getIconStyle(iconUrl: string) {
  return iconUrl ? { backgroundImage: `url("${iconUrl}")` } : undefined
}
</script>

<template>
  <a
    class="friend-card no-external-link-icon"
    :href="link"
    target="_blank"
    rel="noopener noreferrer"
  >
    <span
      class="friend-card-icon"
      :style="getIconStyle(icon)"
      aria-hidden="true"
    ></span>

    <span class="friend-card-name">{{ name }}</span>
    <span class="friend-card-description">{{ description }}</span>
  </a>
</template>

<style scoped>
.friend-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.7rem;

  box-sizing: border-box;
  min-width: 0;
  padding: 1.25rem 1rem;

  border: 1px solid var(--vp-c-border);
  border-radius: 1rem;

  background: var(--vp-c-bg-elv);
  color: inherit;
  text-align: center;
  text-decoration: none;

  transition:
    transform var(--vp-t-transform),
    border-color var(--vp-t-color),
    box-shadow var(--vp-t-transform);
}

.friend-card:hover {
  transform: translateY(-4px);

  border-color: var(--vp-c-accent);
  box-shadow: 0 12px 18px
    color-mix(in srgb, var(--vp-c-accent) 20%, transparent);
}

.friend-card-icon {
  flex-shrink: 0;

  width: 4rem;
  height: 4rem;
  border-radius: 50%;

  background-color: #b8b8c2;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}

.friend-card-name {
  overflow-wrap: anywhere;

  color: var(--vp-c-text);

  font-size: 1rem;
  font-weight: 600;
  line-height: 1.4;
}

.friend-card-description {
  overflow-wrap: anywhere;

  color: var(--vp-c-text-mute);

  font-size: 0.82rem;
  line-height: 1.6;
  white-space: normal;
}

@media (max-width: 719px) {
  .friend-card {
    gap: 0.55rem;
    padding: 1rem 0.7rem;
  }

  .friend-card-icon {
    width: 3.4rem;
    height: 3.4rem;
  }

  .friend-card-name {
    font-size: 0.9rem;
  }

  .friend-card-description {
    font-size: 0.75rem;
  }
}

@media (max-width: 419px) {
  .friend-card {
    padding: 0.9rem 0.55rem;
  }

  .friend-card-icon {
    width: 3rem;
    height: 3rem;
  }

  .friend-card-description {
    font-size: 0.72rem;
  }
}
</style>
