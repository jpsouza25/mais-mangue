import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Navbar } from '../components/Navbar';
import { HeroCarousel } from '../components/HeroCarousel';
import { DidYouKnow } from '../components/DidYouKnow';
import { InteractiveMap } from '../components/InteractiveMap';
import { WhyUseMangue } from '../components/WhyUseMangue';
import { Footer } from '../components/Footer';
import { LoginModal } from '../components/LoginModal';
import { SignupModal } from '../components/SignupModal';
import { getMe } from '../lib/api';

export function LandingPage() {
  const navigate = useNavigate();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const whyUseRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getMe().then((res) => setLoggedIn(res.authenticated)).catch(() => {});
  }, []);

  const scrollToWhyUse = () => {
    whyUseRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const goToDashboard = () => navigate('/dashboard');

  return (
    <div
      style={{
        backgroundColor: '#F8FAF0',
        fontFamily: 'Work Sans, sans-serif',
      }}
    >
      <Navbar
        loggedIn={loggedIn}
        onLoginClick={() => setShowLoginModal(true)}
        onSignupClick={() => setShowSignupModal(true)}
        onDashboardClick={goToDashboard}
      />

      <div style={{ paddingTop: '80px' }}>
        <HeroCarousel onCTAClick={scrollToWhyUse} />
        <DidYouKnow />
        <InteractiveMap />
        <div ref={whyUseRef}>
          <WhyUseMangue onDownloadClick={() => setShowSignupModal(true)} />
        </div>
        <Footer />
      </div>

      {showLoginModal && (
        <LoginModal
          onClose={() => setShowLoginModal(false)}
          onSwitchToSignup={() => {
            setShowLoginModal(false);
            setShowSignupModal(true);
          }}
          onSuccess={goToDashboard}
        />
      )}

      {showSignupModal && (
        <SignupModal
          onClose={() => setShowSignupModal(false)}
          onSwitchToLogin={() => {
            setShowSignupModal(false);
            setShowLoginModal(true);
          }}
          onSuccess={goToDashboard}
        />
      )}
    </div>
  );
}
