<script setup>
import { ref } from 'vue';
import { useToast } from 'primevue/usetoast';
import Message from 'primevue/message';
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import Button from 'primevue/button';
import { Form } from '@primevue/forms';

const toast = useToast();

const initialValues = ref({
    email: '',
    password: ''
});

const onFormSubmit = async (e) => {
    // e.originalEvent: Represents the native form submit event.
    // e.valid: A boolean that indicates whether the form is valid or not.
    // e.states: Contains the current state of each form field, including validity status.
    // e.errors: An object that holds any validation errors for the invalid fields in the form.
    // e.values: An object containing the current values of all form fields.
    // e.reset: A function that resets the form to its initial state.
    const token = document
        .querySelector('meta[name="csrf-token"]')
        ?.getAttribute('content');

	const res = await fetch('/login', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': token },
		body: JSON.stringify(e.values)
	});
    if(res.ok){
        window.location.href = '/';
    }else{
        toast.add({ severity: 'success', summary: 'Nie udało się zalogować', life: 3000 });
    }
};
</script>

<template>
    <div class="card flex justify-center">
        <Form v-slot="$form" :initialValues @submit="onFormSubmit" class="flex flex-col gap-4 w-full sm:w-60">
            <div class="flex flex-col gap-1">
                <InputText name="email" type="text" placeholder="Email" fluid />
                <Message v-if="$form.email?.invalid" severity="error" size="small" variant="simple">{{ $form.email.error.message }}</Message>
            </div>
            <div class="flex flex-col gap-1">
                <Password name="password" placeholder="Password" :feedback="false" toggleMask fluid />
                <Message v-if="$form.password?.invalid" severity="error" size="small" variant="simple">
                    <ul class="my-0 px-4 flex flex-col gap-1">
                        <li v-for="(error, index) of $form.password.errors" :key="index">{{ error.message }}</li>
                    </ul>
                </Message>
            </div>
            <Button type="submit" severity="secondary" label="Submit" />
        </Form>
    </div>
</template>

