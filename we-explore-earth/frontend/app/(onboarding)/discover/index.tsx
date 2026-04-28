import React from 'react';
import OnboardingPage from '../components/onboardingPage';

export default function DiscoverPage() {
  return (
    <OnboardingPage
      title="Discover"
      description="Trails near you"
      nextRoute="/(onboarding)/join"
      currentPage={2} 
      totalPages={4}
    />
  );
}