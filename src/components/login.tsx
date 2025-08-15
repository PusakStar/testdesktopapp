import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Message from "../components/common/Message";
import { useMessage } from "../features/auth/hooks/useMessage";

import LoginForm from "../features/auth/components/loginForm";
import RegisterForm from "../features/auth/components/registerForm";
import RecoveryForm from "../features/auth/components/RecoveryForm";
import ResetPasswordForm from "../features/auth/components/ResetPasswordForm";

import {
  login,
  register,
  sendRecoveryCode,
  verifyCode,
  resetPassword,
} from "../services/authServices";

import { useGoogleLogin } from "@react-oauth/google";

interface LoginProps {
  onSuccess?: (email: string) => void;
  initialEmail?: string;
}

const Login: React.FC<LoginProps> = ({ onSuccess, initialEmail = "" }) => {
  const navigate = useNavigate();
  const { msgVisible, msgTitle, msgContent, showMessage } = useMessage();

  const [isRegister, setIsRegister] = useState(false);
  const [isRecovery, setIsRecovery] = useState(false);
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isCodeConfirmed, setIsCodeConfirmed] = useState(false);

  const [authCode, setAuthCode] = useState(["", "", "", "", "", ""]);
  const [retryCountdown, setRetryCountdown] = useState(0);

  const [formData, setFormData] = useState({
    email: initialEmail,
    password: "",
    confirmPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  useEffect(() => {
    setFormData((prev) => ({ ...prev, email: initialEmail }));
  }, [initialEmail]);

  useEffect(() => {
    let timer: number;
    if (retryCountdown > 0) {
      timer = window.setTimeout(() => setRetryCountdown((prev) => prev - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [retryCountdown]);

  const clearForm = () =>
    setFormData({
      email: "",
      password: "",
      confirmPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    });

  // Handlers
  const loginHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = await login(formData.email, formData.password);
    if (data.success) {
      showMessage("✅ Success", "Logged in successfully!");
      navigate("/home", { state: { email: formData.email } });
    } else {
      showMessage("❌ Login Failed", data.message || "Invalid credentials.");
    }
  };

  const registerHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      showMessage("Password mismatch!", "Please ensure the passwords match.");
      return;
    }
    const data = await register(formData.email, formData.password);
    if (data.success) {
      showMessage("✅ Success", data.message);
      const registeredEmail = formData.email;
      clearForm();
      setFormData((prev) => ({ ...prev, email: registeredEmail }));
      setIsRegister(false);
      onSuccess?.(registeredEmail);
    } else {
      showMessage("⚠️ Warning", data.message || "Something went wrong");
    }
  };

  const sendRecoveryHandler = async () => {
    const data = await sendRecoveryCode(formData.email);
    if (data.success) {
      showMessage("📩 Email Sent", data.message);
      setIsCodeSent(true);
      setRetryCountdown(60);
    } else {
      showMessage("⚠️ Error", data.message || "Could not process recovery.");
    }
  };

  const confirmAuthCodeHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = authCode.join("");
    const data = await verifyCode(formData.email, code);
    if (data.success) {
      setIsCodeConfirmed(true);
      showMessage("✅ Verified", "Code verified. You may now reset password.");
      setAuthCode(["", "", "", "", "", ""]);
    } else {
      showMessage("❌ Invalid Code", data.message || "Incorrect code");
    }
  };

  const resetPasswordHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmNewPassword) {
      showMessage("❌ Error", "New passwords do not match.");
      return;
    }
    const data = await resetPassword(formData.email, formData.newPassword);
    if (data.success) {
      showMessage("✅ Success", "Password reset successfully.");
      clearForm();
      setIsRecovery(false);
      setIsCodeSent(false);
      setIsCodeConfirmed(false);
    } else {
      showMessage("❌ Failed", data.message || "Reset failed.");
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      const accessToken = tokenResponse.access_token;
      try {
        const resUserInfo = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const user = await resUserInfo.json();
        await register(user.email, ""); // Placeholder if your backend handles Google ID
        showMessage("✅ Success", "Google account registered.");
        navigate("/home", { state: { email: user.email } });
      } catch (err) {
        showMessage("❌ Error", "Google Sign-In failed.");
      }
    },
    onError: () => {
      showMessage("❌ Error", "Google Sign-In was unsuccessful");
    },
  });

  return (
    <div>
      <Message visible={msgVisible} title={msgTitle} content={msgContent} />

      <div className="login-container" />
      <form
        className="login-box"
        onSubmit={
          isRecovery
            ? isCodeConfirmed
              ? resetPasswordHandler
              : confirmAuthCodeHandler
            : isRegister
            ? registerHandler
            : loginHandler
        }
      >
        {isRecovery ? (
          isCodeConfirmed ? (
            <ResetPasswordForm formData={formData} setFormData={setFormData} />
          ) : (
            <RecoveryForm
              formData={formData}
              setFormData={setFormData}
              authCode={authCode}
              setAuthCode={setAuthCode}
              isCodeSent={isCodeSent}
              retryCountdown={retryCountdown}
              sendRecoveryHandler={sendRecoveryHandler}
            />
          )
        ) : isRegister ? (
          <RegisterForm formData={formData} setFormData={setFormData} googleLogin={googleLogin} />
        ) : (
          <LoginForm formData={formData} setFormData={setFormData} googleLogin={googleLogin} />
        )}
      </form>
    </div>
  );
};

export default Login;
