import { LeagueViewModel } from 'src/modules/leagues/presentation/viewmodels/league.viewmodel';
import type { UseQuasarNotificationReturn } from 'src/composables/useQuasarNotifications';

let leagueViewModel: LeagueViewModel | null = null;

export function useLeagues(notifications: UseQuasarNotificationReturn) {
  if (!leagueViewModel) {
    leagueViewModel = new LeagueViewModel(notifications);
  }

  return leagueViewModel;
}
