import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";

import Message from "../common/Message";
import Sidebar from "../layout/sidebar";
import LoginForm from "../forms/LoginForm";
import RegisterForm from "../forms/RegisterForm";
import RecoveryForm from "../forms/RecoveryForm";

import { AuthFormData } from "../../types/AuthFormTypes";
import useAuth from "../hooks/useAuth";
import useAPI from "../hooks/useAPI";
import dreamicon from "../../assets/dreamicon.png";

interface AuthPageProps {
  onSuccess?: (email: string) => void;
  initialEmail?: string;
}

const AuthPage: React.FC<AuthPageProps> = ({ onSuccess, initialEmail = "" }) => {
  const navigate = useNavigate();

  // UI State
  const [isRegister, setIsRegister] = useState(false);
  const [isRecovery, setIsRecovery] = useState(false);

  // Custom hooks
  const {
    formData,
    setFormData,
    authCode,
    setAuthCode,
    msgVisible,
    msgTitle,
    msgContent,
    showMessage,
    clearForm,
  } = useAuth(initialEmail);
  
  const [open, setOpen] = useState(false);
  const { loginAPI, registerAPI, registerGoogleAPI } = useAPI(showMessage);

  // Login handler
  const loginHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await loginAPI(formData.email, formData.password);
    if (success) {
      navigate("/home", { state: { email: formData.email } });
    }
  };

  // Register handler
  const registerHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      showMessage("⚠️ Password mismatch", "Passwords must match!");
      return;
    }

    const success = await registerAPI(formData.email, formData.password);
    if (success) {
      const registeredEmail = formData.email;
      clearForm();
      setFormData((prev) => ({ ...prev, email: registeredEmail }));
      setIsRegister(false);
      onSuccess?.(registeredEmail);
    }
  };

  // Google login
  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      const accessToken = tokenResponse.access_token;

      try {
        const resUserInfo = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        const user = await resUserInfo.json();
        const success = await registerGoogleAPI(user.email, user.name, user.sub);

        if (success) {
          navigate("/home", { state: { email: user.email } });
        }
      } catch (err) {
        showMessage("❌ Error", "Google Sign-In failed.");
        console.error(err);
      }
    },
    onError: () => showMessage("❌ Error", "Google Sign-In was unsuccessful"),
  });

  return (
    <div>
      {/* Toast Message */}
      <Message visible={msgVisible} title={msgTitle} content={msgContent} />

      {/* Left Sidebar */}
      <Sidebar open={open} setOpen={setOpen}/>

      <div className="auth-container" />

      {/* Recovery Form */}
      {isRecovery ? (
        <RecoveryForm
          formData={formData}
          setFormData={setFormData}
          showMessage={showMessage}
          setIsRecovery={setIsRecovery}
          authCode={authCode}
          setAuthCode={setAuthCode}
        />
      ) : (
        <form
          className="auth-box"
          onSubmit={isRegister ? registerHandler : loginHandler}
        >
          <div className="authform-title">
            <h2 className="title">Dream</h2>
          </div>
          
          <hr />

          {isRegister ? (
            <RegisterForm
              formData={formData}
              setFormData={setFormData}
              registerHandler={registerHandler}
              googleLogin={() => googleLogin()}
              setIsRegister={setIsRegister}
              clearForm={clearForm}
            />
          ) : (
            <LoginForm
              formData={formData}
              setFormData={setFormData}
              loginHandler={loginHandler}
              googleLogin={() => googleLogin()}
              setIsRecovery={setIsRecovery}
              setIsRegister={setIsRegister}
              clearForm={clearForm}
              open={open}              // 👈 add this
              setOpen={setOpen} 
            />
          )}
        </form>
      )}
    </div>
  );
};

export default AuthPage;
