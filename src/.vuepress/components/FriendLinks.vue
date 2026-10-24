<template>
  <section class="friend-links">
    <div class="friend-grid">
      <slot />
    </div>
  </section>
</template>

<style scoped>
.friend-links {
  margin-top: 0.5rem;
}

.friend-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
}

@media (max-width: 719px) {
  .friend-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.75rem;
  }
}
@media (max-width: 419px) {
  .friend-grid {
    gap: 0.6rem;
  }
}
</style>
