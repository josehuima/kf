
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) {
    return text;
  }
  return text.slice(0, maxLength) + '...';
};

export  const formatDateDistance = (dateString: string): string => {
  const createdDate = new Date(dateString);
  const now = new Date();

  return formatDistanceToNow(createdDate, { addSuffix: true, locale: ptBR }); // Adapte a localização conforme necessário
};

