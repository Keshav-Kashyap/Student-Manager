// GoogleRedirect.jsx (Fixed version)
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authAPI } from '../../services/api';

const GoogleRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleGoogleAuth = async () => {
      try {
        const query = new URLSearchParams(window.location.search);
        const success = query.get('success');
        const isNew = query.get('isNew') === 'true'; // Fixed: was 'new'
        const error = query.get('error');
        const email = query.get('email');
        const action = query.get('action'); // 'signup' or 'login'
        const type = query.get('type') || 'error';

        console.log("🔍 Google redirect params:", {
          success,
          isNew,
          error,
          email,
          action,
          type
        });

        if (error) {
          const errorMessage = decodeURIComponent(error);
          console.log("❌ Error message:", errorMessage);

          // ✅ Check if it's a "no account found" error from login
          if (errorMessage.includes('No account found') && action === 'signup') {
            toast.error('No account found with this Google email. Please sign up first.');
            navigate('/signup', {
              state: {
                prefillEmail: email ? decodeURIComponent(email) : null
              }
            });
            return;
          }

          toast.error(errorMessage);
          navigate('/login');
          return;
        }

        if (success !== 'true') {
          toast.error('Google authentication failed');
          navigate('/login');
          return;
        }

        const fetchUserProfile = async () => {
  try {
    const res = await fetch('/api/users/profile', {
      method: 'GET',
      credentials: 'include', // if using cookies for auth
      headers: {
        'Content-Type': 'application/json',
        // If you're using token from localStorage instead of cookies:
        // 'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
    });

    if (!res.ok) {
      throw new Error('Failed to fetch user profile');
    }

    const user = await res.json();
    return user;
  } catch (err) {
    console.error('Error fetching user profile:', err.message);
    return null;
  }
};
        // ✅ Get user data from server
 const result = await fetchUserProfile();

       
if (result && result.success) {
  const user = result.data; // ✅ This is actual user object
  const userRole = user.role;
  const hasProfile = user.hasProfile;
  console.log("Your user data:",user);
  
  toast.success('Google authentication successful!');

          if (userRole === 'admin') {
            navigate('/admin/dashboard');
          } else if (!hasProfile || isNew) {
            navigate('/app/create-profile', {
              state: {
                userData: user,
                fromGoogleLogin: true
              }
            });
          } else {
            navigate('/app/dashboard');
          }
        } else {
          toast.error('Failed to get user info');
          navigate('/login');
        }

      } catch (error) {
        console.error('❌ Error during Google auth redirect:', error);
        toast.error('Authentication failed. Please try again.');
        navigate('/login');
      }
    };

    handleGoogleAuth();
  }, [navigate]);

  return (
    <div className="flex h-screen items-center justify-center bg-black text-white text-xl">
      <div className="text-center">
        <div className="mb-4">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        </div>
        <div className="animate-pulse">Processing Google authentication...</div>
      </div>
    </div>
  );
};

export default GoogleRedirect;