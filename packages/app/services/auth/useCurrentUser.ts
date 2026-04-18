import { useQuery } from '@tanstack/react-query';
import { authService } from './auth.service';

export function useCurrentUser() {
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: () => authService.getMe(),
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
}
