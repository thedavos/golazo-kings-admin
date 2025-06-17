import { ScrapingViewModel } from 'src/modules/scraping/presentation/viewmodels/scraping.viewmodel';
import { useQuasarNotifications } from 'src/composables/useQuasarNotifications';

let scrapingViewModel: ScrapingViewModel | null = null;

export function useScraping() {
  if (!scrapingViewModel) {
    const notificationService = useQuasarNotifications();
    scrapingViewModel = new ScrapingViewModel(notificationService);
  }

  return scrapingViewModel;
}
