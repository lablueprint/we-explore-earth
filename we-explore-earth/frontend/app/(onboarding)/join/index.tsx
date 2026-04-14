import OnboardingPage from '../components/onboardingPage';

export default function JoinPage() {
  return (
    <OnboardingPage
      title="Join events and help the community"
      description="Lorem ipsum dolor sit amet."
      nextRoute="/(onboarding)/unlock"
      currentPage={2} 
      totalPages={5}
    />
  );
}