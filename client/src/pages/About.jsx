import React from 'react';
import PublicNavbar from '../components/common/PublicNavbar';
import HeroSection from '../components/AboutPage/HeroSection';
import StatsSection from '../components/AboutPage/StatsSection';
import AboutContent from '../components/AboutPage/AboutContent';
import ServicesGrid from '../components/AboutPage/ServicesGrid';
import TeamSection from '../components/AboutPage/TeamSection';
import ContactCTA from '../components/AboutPage/ContactCTA';

const About = () => {
  // Check if user is logged in
  const isLoggedIn = localStorage.getItem("user");

  return (
    <div className="min-h-screen">
      {/* Show public navbar only when user is not logged in */}
      {!isLoggedIn && <PublicNavbar title="About Us" />}
      
      <HeroSection />
      <StatsSection />
      <AboutContent />
      <ServicesGrid />
      <TeamSection />
      <ContactCTA />
    </div>
  );
};

export default About;