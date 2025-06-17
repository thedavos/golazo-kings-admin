import { LeagueViewModel } from 'src/modules/leagues/presentation/viewmodels/league.viewmodel';
import { useQuasarNotifications } from 'src/composables/useQuasarNotifications';

let leagueViewModel: LeagueViewModel | null = null;

export function useLeagues() {
  if (!leagueViewModel) {
    const notificationService = useQuasarNotifications();
    leagueViewModel = new LeagueViewModel(notificationService);
  }

  return leagueViewModel;
}
