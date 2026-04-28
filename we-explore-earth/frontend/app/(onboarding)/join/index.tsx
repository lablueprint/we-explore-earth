import OnboardingPage from '../components/onboardingPage';

export default function JoinPage() {
  return (
    <OnboardingPage
      title="Join Events"
      description="And help the Earth"
      nextRoute="/(onboarding)/unlock"
      currentPage={3} 
      totalPages={4}
    />
  );
}