<template>
  <q-page class="flex flex-center">
    <q-card class="login-card q-pa-lg">
      <q-card-section>
        <div class="text-h5 text-center q-mb-md">Login</div>
      </q-card-section>

      <q-card-section>
        <q-form @submit="onSubmit" class="q-gutter-md">
          <q-input
            v-model="email"
            type="email"
            label="Email"
            :rules="emailRules"
            outlined
            lazy-rules
          >
            <template v-slot:prepend>
              <q-icon name="email" />
            </template>
          </q-input>

          <q-input
            v-model="password"
            :type="isPwd ? 'password' : 'text'"
            label="Password"
            :rules="strongPasswordRules"
            outlined
            lazy-rules
          >
            <template v-slot:prepend>
              <q-icon name="lock" />
            </template>
            <template v-slot:append>
              <q-icon
                :name="isPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isPwd = !isPwd"
              />
            </template>
          </q-input>

          <div class="full-width q-pt-md">
            <q-btn
              label="Login"
              type="submit"
              color="primary"
              class="full-width"
              :loading="loading"
            />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasarNotifications } from 'src/composables/useQuasarNotifications';
import { useAuthStore } from 'src/modules/auth/stores/auth.store';
import { useRules } from 'src/composables/useRules';

const router = useRouter();
const authStore = useAuthStore();
const notifications = useQuasarNotifications();
const { emailRules, strongPasswordRules } = useRules();

const email = ref('');
const password = ref('');
const isPwd = ref(true);
const loading = ref(false);

const onSubmit = async () => {
  loading.value = true;

  try {
    await authStore.login({
      email: email.value,
      password: password.value,
    });

    notifications.notifySuccess('Login successful');
    await router.push('/dashboard');
  } catch {
    notifications.notifyError('Login failed. Please check your credentials.');
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.login-card {
  width: 100%;
  max-width: 400px;
}
</style>
