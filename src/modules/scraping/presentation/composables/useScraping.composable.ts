import { ScrapingViewModel } from 'src/modules/scraping/presentation/viewmodels/scraping.viewmodel';
import type { UseQuasarNotificationReturn } from 'src/composables/useQuasarNotifications';

let scrapingViewModel: ScrapingViewModel | null = null;

export function useScraping(notifications: UseQuasarNotificationReturn) {
  if (!scrapingViewModel) {
    scrapingViewModel = new ScrapingViewModel(notifications);
  }

  return scrapingViewModel;
}
