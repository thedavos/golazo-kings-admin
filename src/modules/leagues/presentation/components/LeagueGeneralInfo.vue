<template>
  <div class="league-general-info">
    <div class="row q-col-gutter-md">
      <!-- Basic Information Card -->
      <div class="col-md-3 col-xs-12">
        <q-card bordered class="full-height">
          <q-card-section>
            <div class="text-h6">Información Básica</div>
          </q-card-section>

          <q-card-section class="q-pl-none q-pt-none">
            <q-list dense>
              <q-item>
                <q-item-section>
                  <q-item-label caption>Nombre completo</q-item-label>
                  <q-item-label>{{ league.name }}</q-item-label>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <q-item-label caption>Abreviación</q-item-label>
                  <q-item-label>{{ league.abbr }}</q-item-label>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <q-item-label caption>Ubicación</q-item-label>
                  <q-item-label>{{ league.location }}</q-item-label>
                </q-item-section>
              </q-item>

              <q-item v-if="league.foundationYear">
                <q-item-section>
                  <q-item-label caption>Año de fundación</q-item-label>
                  <q-item-label>
                    {{ league.foundationYear }}
                    <span class="text-grey-7 q-ml-sm" v-if="league.getAge()">
                      ({{ league.getAge() }} años)
                    </span>
                  </q-item-label>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <q-item-label caption>Número de equipos</q-item-label>
                  <q-item-label>{{ league.numberOfTeams }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>
      </div>

      <!-- Configuration Card -->
      <div class="col-md-3 col-xs-12">
        <q-card bordered class="full-height">
          <q-card-section>
            <div class="text-h6">Configuración</div>
          </q-card-section>

          <q-card-section class="q-pl-none q-pt-none">
            <q-list dense>
              <q-item>
                <q-item-section>
                  <q-item-label caption>Estado</q-item-label>
                  <q-item-label>
                    <q-chip
                      :color="getStatusColor(league.status)"
                      text-color="white"
                      :label="league.status"
                      size="sm"
                    />
                  </q-item-label>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <q-item-label caption>Liga activa</q-item-label>
                  <q-item-label>
                    <q-chip
                      :color="league.isActive ? 'positive' : 'negative'"
                      text-color="white"
                      :label="league.isActive ? 'Sí' : 'No'"
                      size="sm"
                    />
                  </q-item-label>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <q-item-label caption>Liga visible</q-item-label>
                  <q-item-label>
                    <q-chip
                      :color="league.isVisible ? 'info' : 'grey'"
                      text-color="white"
                      :label="league.isVisible ? 'Sí' : 'No'"
                      size="sm"
                    />
                  </q-item-label>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <q-item-label caption>Temporadas activas</q-item-label>
                  <q-item-label>
                    <q-chip
                      :color="league.hasActiveSeason() ? 'positive' : 'grey'"
                      text-color="white"
                      :label="league.hasActiveSeason() ? 'Sí' : 'No'"
                      size="sm"
                    />
                  </q-item-label>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <q-item-label caption>Estado operacional</q-item-label>
                  <q-item-label>
                    <q-chip
                      :color="league.isOperational ? 'positive' : 'negative'"
                      text-color="white"
                      :label="league.isOperational ? 'Operativa' : 'No operativa'"
                      size="sm"
                    />
                  </q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>
      </div>

      <!-- Description Card -->
      <div class="col-md-3 col-xs-12">
        <q-card bordered class="full-height">
          <q-card-section>
            <div class="text-h6">Descripción</div>
          </q-card-section>

          <q-card-section>
            <p v-if="league.description" class="q-ma-none">{{ league.description }}</p>
            <p v-else class="text-grey-6 q-ma-none">No hay descripción disponible</p>
          </q-card-section>
        </q-card>
      </div>

      <!-- Contact & Social Media Card -->
      <div class="col-md-3 col-xs-12">
        <q-card class="full-height" v-if="league.hasWebsite || league.hasSocialMedia">
          <q-card-section>
            <div class="text-h6">Contacto y Redes Sociales</div>
          </q-card-section>

          <q-card-section class="q-pl-none q-pt-none">
            <q-list dense>
              <q-item v-if="league.website">
                <q-item-section avatar>
                  <q-icon name="language" color="primary" />
                </q-item-section>
                <q-item-section>
                  <q-item-label caption>Sitio web</q-item-label>
                  <q-item-label>
                    <a :href="league.website" target="_blank" rel="noopener noreferrer">
                      {{ league.website }}
                    </a>
                  </q-item-label>
                </q-item-section>
              </q-item>

              <q-item v-if="league.twitterHandle">
                <q-item-section avatar>
                  <q-icon name="fab fa-twitter" color="info" />
                </q-item-section>
                <q-item-section>
                  <q-item-label caption>Twitter</q-item-label>
                  <q-item-label>
                    <a
                      :href="`https://twitter.com/${league.twitterHandle}`"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      @{{ league.twitterHandle }}
                    </a>
                  </q-item-label>
                </q-item-section>
              </q-item>

              <q-item v-if="league.instagramHandle">
                <q-item-section avatar>
                  <q-icon name="fab fa-instagram" color="deep-orange" />
                </q-item-section>
                <q-item-section>
                  <q-item-label caption>Instagram</q-item-label>
                  <q-item-label>
                    <a
                      :href="`https://instagram.com/${league.instagramHandle}`"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      @{{ league.instagramHandle }}
                    </a>
                  </q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Metadata Card -->
    <q-card class="q-mt-md">
      <q-card-section>
        <div class="text-h6">Metadatos</div>
      </q-card-section>

      <q-card-section class="q-pl-none q-pt-none">
        <q-list dense>
          <q-item>
            <q-item-section>
              <q-item-label caption>ID</q-item-label>
              <q-item-label>{{ league.id }}</q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <q-item-label caption>UUID</q-item-label>
              <q-item-label>{{ league.uuid }}</q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <q-item-label caption>Slug</q-item-label>
              <q-item-label>{{ league.slug }}</q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <q-item-label caption>Fecha de creación</q-item-label>
              <q-item-label>{{ formatDateForDisplay(league.createdAt) }}</q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <q-item-label caption>Última actualización</q-item-label>
              <q-item-label>{{ formatDateForDisplay(league.updatedAt) }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { getStatusColor } from 'src/modules/leagues/presentation/utils/getStatusColor.utils';
import { formatDateForDisplay } from 'src/modules/shared/utils/date.util';
import type { League } from 'src/modules/leagues/domain/entities/league.entity';

interface Props {
  league: League;
}

defineProps<Props>();
</script>
