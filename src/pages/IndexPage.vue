<template>
  <q-page padding class="q-page row no-wrap"> <div class="col">
    <div class="full-height">
      <q-scroll-area class="q-scrollarea q-scrollarea--dark col q-pr-sm q-scrollarea--only-vertical full-height"> <div class="q-ma-lg q-pt-md"> <div class="row q-col-gutter-lg">
        <div class="col-lg-3 col-md-3 col-sm-12 col-xs-12">
          <q-card class="q-card q-card--dark q-dark q-card--flat no-shadow shadow_custom full-height">
            <q-card-section class="q-card__section q-card__section--vert row">
              <div class="text-grey-7 text-h6 col-12">
                <span class="text-grey-7 q-mb-xs block text-weight-medium">New Customers</span>
                <div class="text-grey-7 text-weight-medium text-h5 col-12" style="font-size: 26px;">
                  829<span class="q-mt-sm text-green text-weight-bolder text-caption"> (+14.25%) </span>
                </div>
                <div class="text-caption q-mt-xs text-weight-bold">New Customers</div>
                <q-icon name="person" class="absolute-top-right q-ma-md" size="38px" color="primary" />
              </div>
            </q-card-section>
          </q-card>
        </div>

        <div class="col-lg-3 col-md-3 col-sm-12 col-xs-12"> ... Tarjeta Sales ... </div>
        <div class="col-lg-3 col-md-3 col-sm-12 col-xs-12"> ... Tarjeta Goals ... </div>
        <div class="col-lg-3 col-md-3 col-sm-12 col-xs-12"> ... Tarjeta % Change ... </div>

        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
          <q-card class="q-card q-card--dark q-dark q-card--flat no-shadow shadow_custom">
            <q-card-section class="q-card__section q-card__section--vert row q-pa-none">
              <q-table
                :rows="customerData"
                :columns="customerColumns"
                row-key="name"
              hide-bottom
              dense flat dark no-wrap full-width
              class="q-table__container q-table--horizontal-separator column no-wrap q-table__card q-table__card--dark q-dark q-table--flat q-table--dark q-table--dense q-table--no-wrap full-width"
              >
              <template v-slot:body-cell-CUSTOMER="props">
                <q-td :props="props">
                  <div class="q-item q-item-type row no-wrap q-item--dark q-pa-none">
                    <div class="q-item__section column q-item__section--side justify-center q-item__section--avatar">
                      <q-avatar>
                        <img :src="props.row.avatar" alt="avatar" />
                      </q-avatar>
                    </div>
                    <div class="q-item__section column q-item__section--main justify-center">
                      <div class="q-item__label text-grey-7 text-weight-medium" style="font-size: 15px;">{{ props.row.name }}</div>
                      <div class="q-item__label text-grey-6">{{ props.row.designation }}</div>
                    </div>
                  </div>
                </q-td>
              </template>

              <template v-slot:body-cell-STATUS="props">
                <q-td :props="props">
                  <q-chip
                    :color="props.row.status === 'ACTIVE' ? 'green-2' : 'red-2'"
                  :text-color="props.row.status === 'ACTIVE' ? 'green-9' : 'red-9'"
                  square dense
                  >
                  {{ props.row.status }}
                  </q-chip>
                </q-td>
              </template>

              <template v-slot:body-cell-ACTION="props">
                <q-td :props="props" class="text-center">
                  <q-btn flat round dense icon="more_vert" class="text-grey-8" />
                </q-td>
              </template>

              </q-table>
            </q-card-section>
          </q-card>
        </div>

      </div>
      </div>
      </q-scroll-area>
    </div>
  </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';

// Datos de ejemplo para la tabla de clientes (esto vendría de tu API en un caso real)
const customerData = ref([
  {
    name: 'Mayank Patel',
    designation: 'Designation',
    avatar: 'https://avatars3.githubusercontent.com/u/34883558?s=400&amp;u=09455019882ac53dc69b23df570629fd84d37dd1&amp;v=4',
    city: 'GILBER',
    state: 'CA',
    status: 'ACTIVE'
  },
  {
    name: 'Mayur Patel',
    designation: 'Designation',
    avatar: 'https://avatars2.githubusercontent.com/u/27857088?s=400&amp;u=a898efbc753d93cf4c2070a7cf3b05544b50deea&amp;v=4',
    city: 'LA MESA',
    state: 'AZ',
    status: 'ACTIVE'
  },
  {
    name: 'Pratik Patel',
    designation: 'Designation',
    avatar: 'https://avatars0.githubusercontent.com/u/55240045?s=400&amp;u=cf9bffc2bd2d8e42ca6e5abf40ddd6c1a03ce2860&amp;v=4',
    city: 'PHOENIX',
    state: 'AZ',
    status: 'INACTIVE'
  },
]);

// Definición de las columnas para QTable
const customerColumns = [
  { name: 'CUSTOMER', label: 'CUSTOMER', field: 'customer', sortable: true }, // Usamos la fila completa para el slot
  { name: 'CITY', label: 'CITY', field: 'city', sortable: true },
  { name: 'STATE', label: 'STATE', field: 'state', sortable: true },
  { name: 'STATUS', label: 'STATUS', field: 'status', sortable: true },
  { name: 'ACTION', label: 'ACTION', field: 'action', sortable: false }, // Campo placeholder, el contenido es custom
];

// Puedes añadir aquí computed properties para las estadísticas si los datos son dinámicos
// const newCustomersCount = computed(() => /* lógica para contar nuevos clientes */);

</script>

<style scoped>
/* Re-aplicar estilos específicos si es necesario */
.shadow_custom {
  box-shadow: 0 4px 8px rgba(0,0,0,0.1); /* Ajusta si el original es diferente */
}
/* Otros estilos de la página si son necesarios */
</style>
