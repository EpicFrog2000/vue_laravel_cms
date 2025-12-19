<script setup lang="ts">
	import { ref } from 'vue'
    import AdminMenu from '@/components/cms/AdminStuff.vue';
	import { Link } from '@inertiajs/vue3';
	import CustomComponent from '@/components/cms/CustomComponent.vue';
	const props = defineProps<{cmsData:any}>()
	const cmsData = ref(props.cmsData)

</script>


<template>
	<AdminMenu/>
	<Link
		v-cms-link-element="['sample_link_element']"
		:href="cmsData.sample_link_element?.href ?? 'Lorem ipsum'"
		:target="cmsData.sample_link_element?.target ?? 'Lorem ipsum'"
	>{{ cmsData.sample_link_element?.link_text ?? 'Lorem ipsum' }}</Link>
	<br/>
	<br/>
	<a
		v-cms-link-element="['sample_link_element2']"
		:href="cmsData.sample_link_element2?.href ?? 'Lorem ipsum'"
		:target="cmsData.sample_link_element2?.target ?? 'Lorem ipsum'"
	>{{ cmsData.sample_link_element2?.link_text ?? 'Lorem ipsum' }}</a>
	<br/>
	<br/>
	<img
		v-cms-image-element="['image_1']"
		:src="cmsData.image_1 ?? 'Lorem ipsum'"
		alt="image"
	/>
	<br/>
	<br/>
	<div v-cms-text-element="['text_test']" v-html="cmsData['text_test'] ?? 'Lorem ipsum'"></div>
	<br/>
	<br/>
	<CustomComponent :cmsData="cmsData['slider_home']" :cms_path_value="['slider_home']"/>
	<br/>
	<br/>
</template>
