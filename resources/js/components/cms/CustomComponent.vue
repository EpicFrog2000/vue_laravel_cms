<script setup lang="ts">
import { ref } from 'vue'
import { CmsItemValueType, CmsItemValue } from '@/types/cmsTypes'

interface CmsItem {
	"imagePath": CmsItemValue
	"text": CmsItemValue
}

const default_values: CmsItem[] = [{
	"imagePath": { name: 'img', type: CmsItemValueType.imagePath, value: 'loremIpsum' },
	"text": { name: 'txt', type: CmsItemValueType.text, value: 'lorem ipsum' }
}]

const props = defineProps<{ cmsData?: CmsItem[], cms_path_value:string[] }>()
const cmsData = ref(
	(props.cmsData && props.cmsData.length ? props.cmsData : default_values)
)

</script>


<template>
	<div v-cms-custom-element:[cmsData]="props.cms_path_value" class="flex flex-row w-screen">
		<div v-for="element_data in cmsData" class="flex flex-col basis-1/5">
			<img alt="image" :src="element_data['imagePath'].value" />
			<div v-html="element_data['text'].value"></div>
		</div>
	</div>
</template>