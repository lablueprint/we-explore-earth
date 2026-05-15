import { useAppDispatch } from '@/app/redux/hooks';
import { updateUserState } from '@/app/redux/slices/userSlice';
import { User } from '@shared/types/user';

export const useUpdateUser = () => {
  const dispatch = useAppDispatch();

  const updateUser = (user: User) => {
    dispatch(updateUserState(user));
  };

  return { updateUser };
};
