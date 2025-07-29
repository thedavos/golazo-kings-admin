import { computed, reactive, ref } from 'vue';
import { useQuasar } from 'quasar';
import { useRules } from 'src/composables/useRules';
import { useQuasarNotifications } from 'src/composables/useQuasarNotifications';
import { isValidUrl } from 'src/modules/shared/utils/isValidUrl.util';
import { objectComparer } from 'src/modules/shared/utils/objectComparer.util';
import type { CreatePlayerDto } from 'src/modules/players/dtos/create-player.dto';
import type { Player } from 'src/modules/players/domain/entities/player.entity';
import { getAge } from 'src/modules/shared/utils/getAge.util';

interface UsePlayerFormOptions {
  initialData?: Partial<Player>;
  mode: 'create' | 'edit';
}

/**
 * Composable for managing player form state and logic
 * @param options Configuration options
 * @returns Form state, validation, and methods
 */
export function usePlayerForm(options: UsePlayerFormOptions) {
  const { initialData, mode } = options;

  // Composables
  const $q = useQuasar();
  const notifications = useQuasarNotifications();
  const { emailRules, firstNameRules, lastNameRules, logoUrlRules } = useRules();

  // Form state
  const initialFormState: CreatePlayerDto = {
    firstName: initialData?.firstName || '',
    lastName: initialData?.lastName || '',
    nickname: initialData?.nickname || '',
    slug: initialData?.slug || '',
    birthDate: initialData?.birthDate
      ? new Date(initialData.birthDate).toISOString().split('T')[0]
      : '',
    nationality: initialData?.nationality || '',
    position: initialData?.position || null,
    positionAbbreviation: initialData?.positionAbbreviation || null,
    height: initialData?.height || null,
    weight: initialData?.weight || null,
    profileImageUrl: initialData?.profileImageUrl || null,
    teamId: initialData?.teamId || 0,
    teamUuid: initialData?.teamUuid || '',
    isActive: initialData?.isActive ?? true,
    jerseyNumber: initialData?.jerseyNumber || null,
    preferredFoot: initialData?.preferredFoot || null,
    socialMediaHandle: initialData?.socialMediaHandle || null,
    isWildCard: initialData?.isWildCard ?? false,
    wildCardType: initialData?.wildCardType || null,
    wildCardDescription: initialData?.wildCardDescription || null,
    formerTeam: initialData?.formerTeam || null,
    referenceId: initialData?.referenceId || null,
    referenceUrl: initialData?.referenceUrl || null,
    marketValue: initialData?.marketValue || null,
  };

  const form = reactive<CreatePlayerDto>({ ...initialFormState });
  const originalFormData = ref<CreatePlayerDto>({ ...initialFormState });

  // Team options
  const loadingTeams = ref(false);
  const teamOptions = ref<{ label: string; value: number }[]>([]);

  // Options
  const positionOptions = [
    'Portero',
    'Defensa Central',
    'Lateral Derecho',
    'Lateral Izquierdo',
    'Pivote',
    'Mediocentro',
    'Mediocentro Ofensivo',
    'Extremo Derecho',
    'Extremo Izquierdo',
    'Delantero Centro',
    'Segundo Delantero',
  ];

  const nationalityOptions = ref<string[]>([
    'España',
    'México',
    'Argentina',
    'Colombia',
    'Chile',
    'Brasil',
    'Francia',
    'Alemania',
    'Italia',
    'Portugal',
  ]);

  const preferredFootOptions = [
    { label: 'Diestro', value: 'right' },
    { label: 'Zurdo', value: 'left' },
    { label: 'Ambidiestro', value: 'both' },
  ];

  const wildCardTypeOptions = [
    { label: 'Invitado Especial', value: 'special_guest' },
    { label: 'Streamer', value: 'streamer' },
    { label: 'Influencer', value: 'influencer' },
    { label: 'Leyenda', value: 'legend' },
    { label: 'Primera División', value: 'first_division' },
    { label: 'Segunda División', value: 'second_division' },
    { label: 'Regular', value: 'regular' },
  ];

  // Computed
  const currentYear = computed(() => new Date().getFullYear());
  const minBirthDate = computed(
    () => new Date(currentYear.value - 50, 0, 1).toISOString().split('T')[0] as string,
  );
  const maxBirthDate = computed(
    () => new Date(currentYear.value - 16, 11, 31).toISOString().split('T')[0] as string,
  );

  const isFormValid = computed(() => {
    return (
      !!form.firstName &&
      !!form.lastName &&
      !!form.nationality &&
      !!form.position &&
      !!form.teamId &&
      form.firstName.length >= 2 &&
      form.lastName.length >= 2
    );
  });

  const hasChanges = computed(() => {
    if (mode === 'create') return true;
    return objectComparer.compare(form, originalFormData.value).hasChanges;
  });

  const playerAge = computed(() => getAge(form.birthDate));

  // Validation rules
  const birthDateRules = [
    (val: string) =>
      !val ||
      (new Date(val) >= new Date(minBirthDate.value) &&
        new Date(val) <= new Date(maxBirthDate.value)) ||
      `La fecha debe estar entre ${minBirthDate.value.split('-')[0]} y ${maxBirthDate.value.split('-')[0]}`,
  ];

  const jerseyNumberRules = [
    (val: number) => !val || (val >= 1 && val <= 99) || 'El número debe estar entre 1 y 99',
  ];

  const heightRules = [
    (val: number) =>
      !val || (val >= 140 && val <= 220) || 'La altura debe estar entre 140 y 220 cm',
  ];

  const weightRules = [
    (val: number) => !val || (val >= 40 && val <= 150) || 'El peso debe estar entre 40 y 150 kg',
  ];

  // Methods
  const loadTeams = async () => {
    loadingTeams.value = true;
    try {
      // Simulate API call - replace with actual team service
      await new Promise((resolve) => setTimeout(resolve, 500));
      teamOptions.value = [
        { label: 'PIO FC', value: 1 },
        { label: 'Kunisports', value: 2 },
        { label: 'El Barrio', value: 3 },
        { label: 'Los Troncos FC', value: 4 },
      ];
    } catch (error) {
      console.error('Error loading teams:', error);
      notifications.notifyError('Error al cargar los equipos');
    } finally {
      loadingTeams.value = false;
    }
  };

  const filterNationalities = (val: string, update: (callback: () => void) => void) => {
    const allNationalities = [
      'España',
      'México',
      'Argentina',
      'Colombia',
      'Chile',
      'Brasil',
      'Francia',
      'Alemania',
      'Italia',
      'Portugal',
    ];

    if (val === '') {
      update(() => {
        nationalityOptions.value = allNationalities;
      });
      return;
    }

    update(() => {
      const needle = val.toLowerCase();
      nationalityOptions.value = allNationalities.filter(
        (v) => v.toLowerCase().indexOf(needle) > -1,
      );
    });
  };

  const previewPhoto = () => {
    if (form.profileImageUrl && isValidUrl(form.profileImageUrl)) {
      $q.dialog({
        title: 'Vista previa de la foto',
        message: `<img src="${form.profileImageUrl}" alt="${form.firstName} ${form.lastName}" style="max-width: 300px; max-height: 300px;"/>`,
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

  const populateForm = (playerData: Player) => {
    const formData = {
      firstName: playerData.firstName,
      lastName: playerData.lastName,
      nickname: playerData.nickname,
      slug: playerData.slug,
      birthDate: playerData.birthDate
        ? new Date(playerData.birthDate).toISOString().split('T')[0]
        : '',
      nationality: playerData.nationality,
      position: playerData.position,
      positionAbbreviation: playerData.positionAbbreviation,
      height: playerData.height,
      weight: playerData.weight,
      profileImageUrl: playerData.profileImageUrl,
      teamId: playerData.teamId,
      teamUuid: playerData.teamUuid,
      isActive: playerData.isActive,
      jerseyNumber: playerData.jerseyNumber,
      preferredFoot: playerData.preferredFoot,
      socialMediaHandle: playerData.socialMediaHandle,
      isWildCard: playerData.isWildCard,
      wildCardType: playerData.wildCardType,
      wildCardDescription: playerData.wildCardDescription,
      formerTeam: playerData.formerTeam,
      referenceId: playerData.referenceId,
      referenceUrl: playerData.referenceUrl,
      marketValue: playerData.marketValue,
    };

    Object.assign(form, formData);
    originalFormData.value = { ...formData };
  };

  return {
    // State
    form,
    loadingTeams,
    teamOptions,
    positionOptions,
    nationalityOptions,
    preferredFootOptions,
    wildCardTypeOptions,

    // Computed
    currentYear,
    minBirthDate,
    maxBirthDate,
    isFormValid,
    hasChanges,
    playerAge,

    // Validation rules
    firstNameRules,
    lastNameRules,
    emailRules,
    birthDateRules,
    jerseyNumberRules,
    heightRules,
    weightRules,
    logoUrlRules,

    // Methods
    loadTeams,
    filterNationalities,
    previewPhoto,
    onImageError,
    resetForm,
    populateForm,
  };
}
