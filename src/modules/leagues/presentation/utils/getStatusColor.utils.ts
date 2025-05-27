import { LeagueStatus } from 'src/modules/leagues/domain/enums/league-status.enum';

export const getStatusColor = (status: LeagueStatus): string => {
  const colors = {
    [LeagueStatus.DRAFT]: 'grey',
    [LeagueStatus.ACTIVE]: 'positive',
    [LeagueStatus.INACTIVE]: 'warning',
    [LeagueStatus.ARCHIVED]: 'negative',
  };
  return colors[status] || 'grey';
};
