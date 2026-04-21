import OnboardingPage from '../components/onboardingPage';
import { useAppSelector, useAppDispatch } from '@/app/redux/hooks';
import { setUserState } from '@/app/redux/slices/userSlice';

export default function NotificationsPage() {

const user = useAppSelector(state => state.user);
const dispatch = useAppDispatch();

var route = "";

if(user?.isAdmin)
{
  route = "/(admin)/home";
}
else
{
  route = "/(users)/home";
}

async function completeOnboarding() {
    if (!user?.id) return; 

    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/users/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hasOnboarded: true })
      });

      if (!response.ok) {
        throw new Error('Failed to update onboarding status');
      }

      //console.log("success!");
      dispatch(setUserState({...user, hasOnboarded: true}));
      
    } catch (error) {
      console.error("Error updating user:", error);
    }
  }

  return (
    <OnboardingPage
      title="Turn on Notifications"
      nextRoute={route}
      onFinish={completeOnboarding}
      currentPage={5} 
      totalPages={5}
    />
  );
}