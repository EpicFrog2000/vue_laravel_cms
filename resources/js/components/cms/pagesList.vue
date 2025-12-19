<script setup lang="ts">
import { ref, onMounted, inject } from "vue"
import DataView from "primevue/dataview"
import { getPagesList } from "@/composables/cms"
import { router } from "@inertiajs/vue3"
import Button from "primevue/button"
const pagesList = ref<string[]>([])
const dialogRef = inject<any>('dialogRef')
import { useDialog } from 'primevue/usedialog';
import PageSettings from "./pageSettings.vue"
const dialog = useDialog();
import { useToast } from 'primevue/usetoast';
const toast = useToast();

onMounted(async()=>{
	const res = await getPagesList()
    pagesList.value = res.data;
    if(!res.status_ok){
        toast.add({severity:"error",summary:"Error",detail:res.message,life:3000});
    }
})

const closeDialog = (src: string) => {
	if (dialogRef.value.choose == false) return;
	dialogRef?.value?.close({ src })
}

const listPageSettings = (slug:string) => {
    dialog.open(PageSettings, {
        props: {
            header: 'Ustawienia strony',
            style: {
                width: 'auto',
                height: 'auto',
            },
            modal: true,
        },
        data: {
            choose: false,
            slug: slug
        },
    });
}



</script>

<template>
	<div class="w-full h-full overflow-y-auto">
		<DataView
			:value="pagesList"
			layout="list"
			class="w-full"
			:pt="{ content:{ class:['flex flex-col gap-4'] } }"
		>
			<template #list="{ items }">
				<div
					v-for="(item,i) in items"
					:key="i"
					class="flex flex-row gap-16 justify-between overflow-clip"

				>
					<div class="text-xs">{{ item }}</div>
                    <div class="flex flex-row gap-4">
                        <Button label="przejdź" @click="router.visit(item)" />
                        <Button @click="listPageSettings(item)"><i class="pi pi-cog text-sm"></i></Button>
                    </div>
				</div>
			</template>
		</DataView>
	</div>
</template>
