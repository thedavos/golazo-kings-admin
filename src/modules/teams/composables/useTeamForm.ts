import { computed, reactive, ref, watch } from 'vue';
import { useQuasar } from 'quasar';
import { useRules } from 'src/composables/useRules';
import { useQuasarNotifications } from 'src/composables/useQuasarNotifications';
import { useLeagueViewModel } from 'src/modules/leagues/presentation/viewmodels/league.viewmodel';
import { isValidUrl } from 'src/modules/shared/utils/isValidUrl.util';
import { ValidationUtils } from 'src/modules/shared/utils/validation.util';
import { objectComparer } from 'src/modules/shared/utils/objectComparer.util';
import type { CreateTeamDto } from 'src/modules/teams/dtos/create-team.dto';
import type { Team } from 'src/modules/teams/domain/entities/team.entity';

interface UseTeamFormOptions {
  initialData?: Partial<Team>;
  mode: 'create' | 'edit';
}

/**
 * Composable for managing team form state and logic
 * @param options Configuration options
 * @returns Form state, validation, and methods
 */
export function useTeamForm(options: UseTeamFormOptions) {
  const { initialData, mode } = options;

  // Composables
  const $q = useQuasar();
  const notifications = useQuasarNotifications();
  const { leagues, loadLeagues: fetchLeagues, countries } = useLeagueViewModel();
  const { nameRules, cityRules, countryRules, logoUrlRules, abbrRules } = useRules();

  // Form state
  const initialFormState: CreateTeamDto = {
    name: initialData?.name || '',
    slug: initialData?.slug || '',
    abbr: initialData?.abbr || null,
    city: initialData?.city || '',
    country: initialData?.country || '',
    venue: initialData?.venue || null,
    logoUrl: initialData?.logoUrl || null,
    foundationYear: initialData?.foundationYear || null,
    leagueId: initialData?.leagueId || null,
    isQueensLeagueTeam: initialData?.isQueensLeagueTeam || false,
    referenceId: initialData?.referenceId || null,
    referenceUrl: initialData?.referenceUrl || null,
  };

  const form = reactive<CreateTeamDto>({ ...initialFormState });
  const originalFormData = ref<CreateTeamDto>({ ...initialFormState });

  // League options
  const loadingLeagues = ref(false);

  // Country options
  const countryOptions = ref<string[]>(countries.value);

  const leagueOptions = computed<{ label: string; value: number }[]>(() =>
    leagues.value.map((league) => ({ label: league.name, value: league.id })),
  );

  // Computed
  const currentYear = computed(() => new Date().getFullYear());

  const isFormValid = computed(() => {
    return !!form.name && !!form.city && !!form.country && !!form.leagueId && form.name.length >= 3;
  });

  const hasChanges = computed(() => {
    if (mode === 'create') return true;
    return objectComparer.compare(form, originalFormData.value).hasChanges;
  });

  // Auto-generate slug from name
  watch(
    () => form.name,
    (newName) => {
      if (newName && (!form.slug || mode === 'create')) {
        form.slug = ValidationUtils.generateSlug(newName);
      }
    },
  );

  // Methods
  const loadLeagues = async () => {
    loadingLeagues.value = true;
    try {
      await fetchLeagues();
    } catch (error) {
      console.error('Error loading leagues:', error);
      notifications.notifyError('Error al cargar las ligas');
    } finally {
      loadingLeagues.value = false;
    }
  };

  const filterCountries = (val: string, update: (callback: () => void) => void) => {
    if (val === '') {
      update(() => {
        countryOptions.value = countries.value;
      });
      return;
    }

    update(() => {
      const needle = val.toLowerCase();
      countryOptions.value = countries.value.filter((v) => v.toLowerCase().indexOf(needle) > -1);
    });
  };

  const previewLogo = () => {
    if (form.logoUrl && isValidUrl(form.logoUrl)) {
      $q.dialog({
        title: 'Vista previa del logo',
        message: `<img src="${form.logoUrl}" alt="${form.name}" style="max-width: 300px; max-height: 300px;"/>`,
        html: true,
      });
    }
  };

  const onImageError = (event: Event) => {
    const target = event.target as HTMLImageElement;
    target.src = '';
    notifications.notifyWarning('Error al cargar la imagen');
  };

  const resetForm = () => {
    Object.assign(form, initialFormState);
  };

  const populateForm = (teamData: Team) => {
    const formData = {
      name: teamData.name,
      slug: teamData.slug,
      abbr: teamData.abbr,
      city: teamData.city,
      country: teamData.country,
      venue: teamData.venue,
      logoUrl: teamData.logoUrl,
      foundationYear: teamData.foundationYear,
      leagueId: teamData.leagueId,
      isQueensLeagueTeam: teamData.isQueensLeagueTeam,
      referenceId: teamData.referenceId,
      referenceUrl: teamData.referenceUrl,
    };

    Object.assign(form, formData);
    originalFormData.value = { ...formData };
  };

  return {
    // State
    form,
    loadingLeagues,
    leagueOptions,
    countryOptions,

    // Computed
    currentYear,
    isFormValid,
    hasChanges,

    // Validation rules
    nameRules,
    cityRules,
    countryRules,
    logoUrlRules,
    abbrRules,

    // Methods
    loadLeagues,
    filterCountries,
    previewLogo,
    onImageError,
    resetForm,
    populateForm,
  };
}
