import React, { useState } from 'react';
import { SignIn } from './SignIn';
import { SignUp } from './SignUp';
import { UserProfile } from '../types';

interface AuthScreenProps {
  initialMode?: 'login' | 'signup';
  onLoginSuccess: (user: UserProfile) => void;
  onBackToHome: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ initialMode = 'login', onLoginSuccess, onBackToHome }) => {
  const [isLogin, setIsLogin] = useState<boolean>(initialMode === 'login');
  const [prefilledEmail, setPrefilledEmail] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');

  const handleSignUpSuccess = (email: string) => {
    setPrefilledEmail(email);
    setSuccessMessage('Your account has been created. Please check your email and verify your address before logging in.');
    setIsLogin(true);
  };

  if (isLogin) {
    return (
      <SignIn
        initialEmail={prefilledEmail}
        successMessage={successMessage}
        onLoginSuccess={onLoginSuccess}
        onSwitchToSignUp={() => {
          setIsLogin(false);
          setSuccessMessage('');
        }}
        onBackToHome={onBackToHome}
      />
    );
  }

  return (
    <SignUp
      onSignUpSuccess={handleSignUpSuccess}
      onSwitchToSignIn={() => {
        setIsLogin(true);
        setSuccessMessage('');
      }}
      onBackToHome={onBackToHome}
    />
  );
};
