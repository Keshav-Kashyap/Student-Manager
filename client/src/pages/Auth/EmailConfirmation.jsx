  // VerifyEmailPage.jsx - FIXED VERSION
  import React, { useState, useEffect } from 'react';
  import { TokenVerificationService, useTokenVerification } from '../../utils/tokenVerification';
  import AuthLayout from '../../components/auth/AuthLayout';
  import AuthHeader from '../../components/auth/AuthHeader';
  import AuthButton from '../../components/auth/AuthButton';
  import toast from 'react-hot-toast';
  import { MailCheck, MailWarning, Loader2, CheckCircle2, XCircle } from 'lucide-react';
  import { useNavigate, useLocation } from 'react-router-dom';

  const VerifyEmailPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [userEmail, setUserEmail] = useState(location.state?.email || '');
    const [searchParams] = useState(new URLSearchParams(window.location.search));
    const [userData, setUserData] = useState(null);
    const [verificationToken, setVerificationToken] = useState(null); // ✅ Token state add kiya

    const {
      isLoading,
      isVerifying,
      status,
      message,
      error,
      verifyEmailToken,
      resendEmail,
      updateState
    } = useTokenVerification({
      onTokenReceived: (token) => console.log('✅ Token received:', token),
      tokenStorage: {
        useLocalStorage: false,
        onTokenStored: (token) => console.log('Token stored:', token)
      }
    });

    useEffect(() => {
      // Email set karne ka logic
      if (!userEmail) {
        const email = TokenVerificationService.getEmailFromParams(searchParams);
        if (email) {
          console.log(`Email: ${email}`);
          setUserEmail(email);
        }
      }

      // Token verification logic - sirf ek baar run hoga
      const token = searchParams.get('token');
    
      
      if (token && !userData && status !== 'success' && status !== 'error') {
        console.log('🔑 Token found, verifying...', token);
        setVerificationToken(token); // ✅ Token save kar rahe hain

        // Async function ko properly handle karo
        const verifyToken = async () => {
          try {
            const result = await verifyEmailToken(token);
            console.log('📧 Verification result:', result);

            if (result && result.success) {
              console.log("✅ This is userData:", result.user);
              setUserData(result.user);
              
              console.log("🚀 Token Passing to create profile:", token);
              
              // ✅ SUCCESS MESSAGE SHOW KARO PEHLE
              toast.success('Email verified successfully!');
              
  localStorage.setItem("verifiedToken", token);
  localStorage.setItem("verifiedUserData", JSON.stringify(result.user));
              // ✅ 2 seconds wait, then navigate with proper token

              toast.success('Email verified successfully! Please log in to continue.');
             setTimeout(() => {
  navigate('/login', { replace: true });
}, 2000);
            } else {
              console.error('❌ Verification failed:', result);
              toast.error('Email verification failed');
            }
          } catch (error) {
            console.error('❌ Error during verification:', error);
            toast.error('Verification error occurred');
          }
        };

        verifyToken();
      } else if (!token) {
        updateState({
          status: 'sent',
          message: 'Verification email sent successfully! Please check your email.'
        });
      }
    }, []);

    const handleResendEmail = async () => {
      let email = userEmail || prompt('Enter your email address:');
      if (!email) return;

      try {
        await resendEmail(email);
      } catch (error) {
        console.error('Error resending email:', error);
        toast.error('Failed to resend verification email');
      }
    };



    // ✅ MANUAL NAVIGATION BUTTON
    const handleNavigateToProfile = () => {
      if (!userData || !verificationToken) {
        toast.error("Please wait for verification to complete...");
        return;
      }
      
      console.log("🔄 Manual navigation with token:", verificationToken);
      navigate('/login', { replace: true });
    };

    const handleChangeEmail = () => {
      const newEmail = prompt('Enter your new email address:');
      if (newEmail) {
        setUserEmail(newEmail);
      }
    };

    const renderContent = () => {
      if (isLoading || isVerifying) {
        return (
          <div className="text-center space-y-4">
            <Loader2 className="w-10 h-10 text-blue-400 animate-spin mx-auto" />
            <h2 className="text-xl font-semibold text-white">
              {isVerifying ? 'Verifying Email...' : 'Sending Email...'}
            </h2>
            <p className="text-gray-300">{message}</p>
          </div>
        );
      }

      if (status === 'success') {
        return (
          <div className="text-center space-y-4">
            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto animate-bounce" />
            <h2 className="text-2xl font-bold text-white">Email Verified Successfully!</h2>
            <p className="text-gray-300">{message}</p>

            {userData && (
              <div className="text-sm text-gray-400 mt-2 p-3 bg-gray-800 rounded-lg">
                <p className="text-green-400">✅ Welcome, {userData.name || 'User'}!</p>
                <p>📧 Email: {userData.email}</p>
                <p>👤 Role: {userData.role || 'User'}</p>
                <p>✅ Verified: {userData.isEmailVerified ? '✅ Yes' : '❌ No'}</p>
                {verificationToken && (
                  <p className="text-xs text-blue-400 mt-1">🔑 Token: {verificationToken.substring(0, 20)}...</p>
                )}
              </div>
            )}

            {/* ✅ MANUAL BUTTON ADD KIYA */}
            <div className="space-y-2">
              <p className="text-sm text-gray-400">Redirecting automatically in a moment...</p>
              <AuthButton
                onClick={handleNavigateToProfile}
                loading={isLoading}
                loadingText="Opening Profile..."
              >
                Continue to Profile Setup →
              </AuthButton>
            </div>
          </div>
        );
      }

      if (status === 'error') {
        return (
          <div className="text-center space-y-4">
            <XCircle className="w-16 h-16 text-red-500 mx-auto" />
            <h2 className="text-2xl font-bold text-white">Verification Failed</h2>
            <p className="text-gray-300">{message}</p>
            {error && (
              <div className="text-sm text-red-400 bg-red-900/20 p-3 rounded-lg">
                Error: {error}
              </div>
            )}

            <AuthButton
              onClick={handleResendEmail}
              loading={isLoading}
              loadingText="Sending Verification Link..."
            >
              Resend Verification Email
            </AuthButton>
          </div>
        );
      }

      return (
        <div className="text-center space-y-4">
          <MailCheck className="w-16 h-16 text-purple-400 mx-auto animate-bounce" />
          <h2 className="text-2xl font-bold text-white">Check Your Email!</h2>
          <p className="text-gray-300">{message}</p>
          {userEmail && (
            <p className="text-blue-300 text-sm">We sent the verification link to: {userEmail}</p>
          )}

          <AuthButton
            onClick={handleResendEmail}
            loading={isLoading}
            loadingText="Sending Verification Link..."
          >
            Resend Verification Email
          </AuthButton>

          <button
            className="mt-2 text-sm text-blue-300 hover:text-white underline transition-colors"
            onClick={handleChangeEmail}
          >
            Change Email Address
          </button>
        </div>
      );
    };

    return (
      <AuthLayout>
        <AuthHeader
          title="Verify Your Email"
          subtitle="We've sent a verification link to your inbox"
          icon={<MailCheck className="w-10 h-10 text-white" />}
        />
        {renderContent()}
      </AuthLayout>
    );
  };

  export default VerifyEmailPage;