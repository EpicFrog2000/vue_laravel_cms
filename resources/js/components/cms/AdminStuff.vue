<script setup lang="ts">
import DynamicDialog from 'primevue/dynamicdialog';
import Toast from 'primevue/toast';
import customElementContextMenu from './customElementContextMenu.vue';
import globalContextMenu from './globalContextMenu.vue';
import imageContextMenu from './imageContextMenu.vue';
import linkContextMenu from './linkContextMenu.vue';
import videoContextMenu from './videoContextMenu.vue';
</script>
<template>
    <!-- admin stuff -->
    <globalContextMenu />
    <imageContextMenu />
    <linkContextMenu />
    <videoContextMenu />
    <customElementContextMenu />
    <Toast />
    <DynamicDialog />
</template>
