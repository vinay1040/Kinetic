import { changePassword } from '@/services/authApi';
import { useMutation } from '@tanstack/react-query';

export const useChangePassword = () => {
  return useMutation({
    mutationFn: changePassword,
  });
};