import OnboardingPage from '../components/onboardingPage';

export default function UnlockPage() {
  return (
    <OnboardingPage
      title="View your impact"
      description="As you attend events"
      nextRoute="/(onboarding)/avatar"
      currentPage={4} 
      totalPages={4}
    />
  );
}