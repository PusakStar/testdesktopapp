import React, { useState, useCallback, useEffect, useRef } from "react";
import Message from "./message";
import { useGoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import Sidebar from "./layout/sidebar";


interface LoginProps {
  onSuccess?: (email: string) => void;
  initialEmail?: string;
}

interface FormInputProps {
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}

const FormInput: React.FC<FormInputProps> = ({
  type,
  placeholder,
  value,
  onChange,
  required = true,
}) => (
  <input
    type={type}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    required={required}
  />
);

const Login: React.FC<LoginProps> = ({ onSuccess, initialEmail = "" }) => {
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [isRecovery, setIsRecovery] = useState(false);
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isCodeConfirmed, setIsCodeConfirmed] = useState(false);
  const [authCode, setAuthCode] = useState(["", "", "", "", "", ""]);
  const [retryCountdown, setRetryCountdown] = useState(0);
  const inputRefs = useRef<HTMLInputElement[]>([]);
  const resetAuthCode = () => setAuthCode(["", "", "", "", "", ""]);


  const [formData, setFormData] = useState({
    email: initialEmail,
    password: "",
    confirmPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const [msgVisible, setMsgVisible] = useState(false);
  const [msgTitle, setMsgTitle] = useState("");
  const [msgContent, setMsgContent] = useState("");

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

  const showMessage = useCallback((title: string, content: string) => {
    setMsgTitle(title);
    setMsgContent(content);
    setMsgVisible(true);
    setTimeout(() => setMsgVisible(false), 3000);
  }, []);

  const clearForm = () =>
    setFormData({
      email: "",
      password: "",
      confirmPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    });


      const loginHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3001/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        showMessage("✅ Success", "Logged in successfully!");
        navigate("/home", { state: { email: formData.email } });
      } else {
        showMessage("❌ Login Failed", data.message || "Invalid credentials.");
      }
    } catch (err) {
      showMessage("🚨 Network Error", "Could not connect to backend.");
    }
  };



  const registerHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      showMessage("Password mismatch!", "Please ensure the passwords match.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3001/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        showMessage("✅ Success", data.message);
        const registeredEmail = formData.email;
        clearForm();
        setFormData((prev) => ({ ...prev, email: registeredEmail }));
        setIsRegister(false);
        onSuccess?.(registeredEmail);
      } else {
        showMessage("⚠️ Warning", data.message || "Something went wrong");
      }
    } catch (error) {
      showMessage("🚨 Network Error", "Backend might be offline.");
    }
  };

  const sendRecoveryCode = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/recover", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email }),
      });

      const data = await response.json();

      if (response.ok) {
        showMessage("📩 Email Sent", data.message);
        setIsCodeSent(true);
        setRetryCountdown(60);
      } else {
        showMessage("⚠️ Error", data.message || "Could not process recovery.");
      }
    } catch (error) {
      showMessage("🚨 Network Error", "Unable to connect to backend.");
    }
  };

  const confirmAuthCode = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = authCode.join("");



    try {
      const response = await fetch("http://localhost:3001/api/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, code }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsCodeConfirmed(true);
        showMessage("✅ Verified", "Code verified. You may now reset password.");
        resetAuthCode();
      } else {
        showMessage("❌ Invalid Code", data.message || "Incorrect code");
      }
    } catch (err) {
      showMessage("🚨 Network Error", "Could not verify code.");
    }
  };

  const resetPasswordHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmNewPassword) {
      showMessage("❌ Error", "New passwords do not match.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3001/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          newPassword: formData.newPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        showMessage("✅ Success", "Password reset successfully.");
        clearForm();
        setIsRecovery(false);
        setIsCodeSent(false);
        setIsCodeConfirmed(false);
      } else {
        showMessage("❌ Failed", data.message || "Reset failed.");
      }
    } catch (err) {
      showMessage("🚨 Network Error", "Could not reset password.");
    }
  };

const googleLogin = useGoogleLogin({
  onSuccess: async (tokenResponse) => {
    const accessToken = tokenResponse.access_token;

    try {
      const resUserInfo = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const user = await resUserInfo.json();

      // Register or upsert to your database
      await fetch("http://localhost:3001/api/register-google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user.email,
          name: user.name,
          googleId: user.sub,
        }),
      });

      showMessage("✅ Success", "Google account registered.");

      // 👇 Redirect to home after Google sign-in
      navigate("/home", { state: { email: user.email } });

    } catch (err) {
      showMessage("❌ Error", "Google Sign-In failed.");
      console.error(err);
    }
  },
  onError: () => {
    showMessage("❌ Error", "Google Sign-In was unsuccessful");
  },
});


  return (
    <div>
      <Message visible={msgVisible} title={msgTitle} content={msgContent} />
      <Sidebar />
      <div className="login-container" />
      <form
        className="login-box"
        onSubmit={
          isRecovery
            ? isCodeConfirmed
              ? resetPasswordHandler
              : confirmAuthCode
            : isRegister
            ? registerHandler
            : loginHandler
        }
      >
        <h2 className="login-title">
          {isRecovery
            ? isCodeConfirmed
              ? "Create New Password"
              : "Recover Account"
            : isRegister
            ? "Dream"
            : "Dream"}
        </h2>
        <hr/>

{isRecovery ? (
  <>
    {!isCodeConfirmed ? (
      <>
        {!isCodeSent ? (
          <>
            <FormInput
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
            <div className="authenticationcode-retry">
              <span>*An authentication code will be sent to your email.</span>
            </div>
            <button
              type="button"
              onClick={sendRecoveryCode}
            >
              Send
            </button>
          </>
        ) : (
          <>
            <div className="authenticationcode-retry">
              <span>Enter the 6-digit code sent to your email.</span>
              <a
                href="#retry"
                onClick={(e) => {
                  e.preventDefault();
                  if (retryCountdown === 0) sendRecoveryCode();
                }}
                style={{
                  pointerEvents: retryCountdown > 0 ? "none" : "auto",
                  color: retryCountdown > 0 ? "gray" : "blue",
                }}
              >
                retry {retryCountdown > 0 ? `(${retryCountdown}s)` : ""}
              </a>
            </div>
            <div className="authenticationcode-inputs">
              {authCode.map((val, idx) => (
                <input
                  key={idx}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={val}
                  ref={(el) => {
                    if (el) inputRefs.current[idx] = el;
                  }} // we'll add inputRefs below
                  onChange={(e) => {
                    const input = e.target.value.replace(/\D/g, "").slice(0, 1); // only digits
                    const updated = [...authCode];
                    updated[idx] = input;
                    setAuthCode(updated);

                    if (input && idx < authCode.length - 1) {
                      inputRefs.current[idx + 1]?.focus(); // move to next
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Backspace") {
                      if (authCode[idx] === "" && idx > 0) {
                        inputRefs.current[idx - 1]?.focus(); // go to previous
                      }
                    }
                  }}
                  style={{ width: "2rem", textAlign: "center" }}
                />
              ))}
            </div>
            <button type="submit">Confirm</button>
          </>
        )}
      </>
    ) : (
      <>
        <FormInput
          type="password"
          placeholder="New Password"
          value={formData.newPassword}
          onChange={(e) =>
            setFormData({ ...formData, newPassword: e.target.value })
          }
        />
        <FormInput
          type="password"
          placeholder="Confirm New Password"
          value={formData.confirmNewPassword}
          onChange={(e) =>
            setFormData({ ...formData, confirmNewPassword: e.target.value })
          }
        />
        <button type="submit">Confirm</button>
      </>
    )}
    <span>
      Back to{" "}
      <a
        href="#login"
        onClick={(e) => {
          e.preventDefault();
          setIsRecovery(false);
          setIsCodeSent(false);
          setIsCodeConfirmed(false);
          resetAuthCode();
        }}
      >
        Login
      </a>
    </span>
  </>
) : isRegister ? (
          <>
            <FormInput
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <FormInput
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
            <FormInput
              type="password"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
            />
            <hr />
            <button type="submit">Register</button>
            <button type="button" className="google-login-btn" onClick={() => googleLogin()}>
              <img src="/src/assets/googleicon.png" alt="Google" style={{ width: "20px", marginRight: "8px" }} />
              Register with Google
            </button>
            <span>
              Already have an account?{" "}
              <a
                href="#login"
                onClick={(e) => {
                  e.preventDefault();
                  setIsRegister(false);
                  clearForm();
                }}
              >
                Login
              </a>
            </span>
          </>
        ) : (
          <>
            <FormInput
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <FormInput
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
            <hr />
            <button type="submit">Login</button>
            <button type="button" className="google-login-btn" onClick={() => googleLogin()}>
              <img src="/src/assets/googleicon.png" alt="Google" style={{ width: "20px" }} />
              Sign in with Google
            </button>
            <div className="forgot-password-contactus">
              <a href="#">Customer Support</a>
              <a
                href="#recover"
                onClick={(e) => {
                  e.preventDefault();
                  setIsRecovery(true);
                  clearForm();
                }}
              >
                Password Recovery
              </a>
            </div>
            <span>
              Haven't registered yet?{" "}
              <a
                href="#register"
                onClick={(e) => {
                  e.preventDefault();
                  setIsRegister(true);
                  clearForm();
                }}
              >
                Register now
              </a>
            </span>
          </>
        )}
      </form>
    </div>
  );
};

export default Login;
