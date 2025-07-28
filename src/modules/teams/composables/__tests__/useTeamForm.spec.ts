import { describe, it, expect, vi } from 'vitest';
import { useTeamForm } from '../useTeamForm';
import type { Team } from 'src/modules/teams/domain/entities/team.entity';

// Mock dependencies
vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

vi.mock('quasar', () => ({
  useQuasar: () => ({
    dialog: vi.fn(),
  }),
}));

vi.mock('src/composables/useRules', () => ({
  useRules: () => ({
    nameRules: [(val: string) => !!val || 'Name is required'],
    cityRules: [(val: string) => !!val || 'City is required'],
    countryRules: [(val: string) => !!val || 'Country is required'],
    logoUrlRules: [],
    abbrRules: [],
  }),
}));

vi.mock('src/composables/useQuasarNotifications', () => ({
  useQuasarNotifications: () => ({
    notifyError: vi.fn(),
    notifyWarning: vi.fn(),
  }),
}));

vi.mock('src/modules/shared/utils/isValidUrl.util', () => ({
  isValidUrl: (url: string) => !!url,
}));

vi.mock('src/modules/shared/utils/validation.util', () => ({
  ValidationUtils: {
    generateSlug: (name: string) => name.toLowerCase().replace(/\s+/g, '-'),
  },
}));

describe('useTeamForm', () => {
  describe('create mode', () => {
    it('should initialize with empty form', () => {
      const { form, isFormValid } = useTeamForm({ mode: 'create' });

      expect(form.name).toBe('');
      expect(form.city).toBe('');
      expect(form.country).toBe('');
      expect(isFormValid.value).toBe(false);
    });

    it('should validate required fields', () => {
      const { form, isFormValid } = useTeamForm({ mode: 'create' });

      form.name = 'Test Team';
      form.city = 'Test City';
      form.country = 'Test Country';
      form.leagueId = 1;

      expect(isFormValid.value).toBe(true);
    });

    it('should always return true for hasChanges in create mode', () => {
      const { hasChanges } = useTeamForm({ mode: 'create' });

      expect(hasChanges.value).toBe(true);
    });
  });

  describe('edit mode', () => {
    it('should populate form with initial data', () => {
      const initialData = {
        name: 'Existing Team',
        city: 'Existing City',
        country: 'Existing Country',
        leagueId: 1,
      };

      const { form } = useTeamForm({
        mode: 'edit',
        initialData,
      });

      expect(form.name).toBe('Existing Team');
      expect(form.city).toBe('Existing City');
      expect(form.country).toBe('Existing Country');
      expect(form.leagueId).toBe(1);
    });

    it('should detect changes correctly', () => {
      const initialData = {
        name: 'Existing Team',
        city: 'Existing City',
        country: 'Existing Country',
        leagueId: 1,
      };

      const { form, hasChanges } = useTeamForm({
        mode: 'edit',
        initialData,
      });

      expect(hasChanges.value).toBe(false);

      form.name = 'Modified Team';
      expect(hasChanges.value).toBe(true);
    });

    it('should update form with populateForm method', () => {
      const { form, populateForm, hasChanges } = useTeamForm({
        mode: 'edit',
      });

      const teamData = {
        id: 1,
        name: 'New Team Data',
        city: 'New City',
        country: 'New Country',
        leagueId: 2,
        slug: 'new-team-data',
      } as Team;

      populateForm(teamData);

      expect(form.name).toBe('New Team Data');
      expect(form.city).toBe('New City');
      expect(form.country).toBe('New Country');
      expect(form.leagueId).toBe(2);
      expect(hasChanges.value).toBe(false);
    });
  });

  describe('form methods', () => {
    it('should reset form to initial state', () => {
      const initialData = {
        name: 'Initial Team',
        city: 'Initial City',
      };

      const { form, resetForm } = useTeamForm({
        mode: 'edit',
        initialData,
      });

      form.name = 'Changed Name';
      form.city = 'Changed City';

      resetForm();

      expect(form.name).toBe('Initial Team');
      expect(form.city).toBe('Initial City');
    });
  });
});
