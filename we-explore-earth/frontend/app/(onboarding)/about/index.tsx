import React from 'react';
import OnboardingPage from '../components/onboardingPage';

export default function AboutPage() {
  return (
    <OnboardingPage
      title="About WEE"
      description="We Explore Earth empowers diverse communities through nature, education, creativity, and stewardship. We host events that equip underrepresented communities with tools and experiences to explore and protect Earth’s nature."
      nextRoute="/(onboarding)/discover"
      currentPage={1} 
      totalPages={4}
      isParagraph={true}
    />
  );
}