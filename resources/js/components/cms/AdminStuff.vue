<script setup lang="ts">
import Toast from 'primevue/toast';
import DynamicDialog from 'primevue/dynamicdialog';
import globalContextMenu from './globalContextMenu.vue';
import imageContextMenu from './imageContextMenu.vue';
import linkContextMenu from './linkContextMenu.vue';
import customElementContextMenu from './customElementContextMenu.vue';



</script>
<template>

    <!-- admin stuff -->
    <globalContextMenu />
    <imageContextMenu />
    <linkContextMenu />
    <customElementContextMenu />
    <Toast />
    <DynamicDialog />

    
</template>
