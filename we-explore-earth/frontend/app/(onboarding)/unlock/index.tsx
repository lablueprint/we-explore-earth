import OnboardingPage from '../components/onboardingPage';

export default function UnlockPage() {
  return (
    <OnboardingPage
      title="Unlock badges as you help your community"
      description="Lorem ipsum dolor sit amet."
      nextRoute="/(onboarding)/avatar"
      currentPage={3} 
      totalPages={5}
    />
  );
}