import OnboardingPage from '../components/onboardingPage';

export default function DiscoverPage() {
  return (
    <OnboardingPage
      title="Discover"
      description="Trails near you"
      nextRoute="/(onboarding)/join"
      currentPage={1} 
      totalPages={5}
    />
  );
}