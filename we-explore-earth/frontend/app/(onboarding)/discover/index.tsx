import OnboardingPage from '../components/onboardingPage';

export default function DiscoverPage() {
  return (
    <OnboardingPage
      title="Discover trails and events near you"
      description="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
      nextRoute="/(onboarding)/join"
      currentPage={1} 
      totalPages={5}
    />
  );
}