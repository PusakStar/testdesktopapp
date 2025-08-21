import React, { useState, useEffect } from "react";
import AuthCodeInput from "../../../components/forms/AuthCodeInput";

interface RecoveryFormProps {
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  showMessage: (title: string, content: string) => void;
  setIsRecovery: React.Dispatch<React.SetStateAction<boolean>>;
  authCode: string[];
  setAuthCode: React.Dispatch<React.SetStateAction<string[]>>;
}

const RecoveryForm: React.FC<RecoveryFormProps> = ({
  formData,
  setFormData,
  showMessage,
  setIsRecovery,
  authCode,
  setAuthCode,
}) => {
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isCodeConfirmed, setIsCodeConfirmed] = useState(false);
  const [retryCountdown, setRetryCountdown] = useState(0);

  useEffect(() => {
    let timer: number;
    if (retryCountdown > 0) {
      timer = window.setTimeout(
        () => setRetryCountdown((prev) => prev - 1),
        1000
      );
    }
    return () => clearTimeout(timer);
  }, [retryCountdown]);

  const resetAuthCode = () => setAuthCode(["", "", "", "", "", ""]);

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
    } catch {
      showMessage("🚨 Network Error", "Unable to connect to backend.");
    }
  };

  const confirmAuthCode = async (code?: string) => {
    const finalCode = code || authCode.join("");
    if (finalCode.length !== 6) return;

    try {
      const response = await fetch("http://localhost:3001/api/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, code: finalCode }),
      });

      const data = await response.json();
      if (response.ok) {
        setIsCodeConfirmed(true);
        showMessage("✅ Verified", "Code verified. You may now reset password.");
        resetAuthCode();
      } else {
        showMessage("❌ Invalid Code", data.message || "Incorrect code");
      }
    } catch {
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
      const response = await fetch(
        "http://localhost:3001/api/reset-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email,
            newPassword: formData.newPassword,
          }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        showMessage("✅ Success", "Password reset successfully.");
        setFormData({
          email: "",
          password: "",
          confirmPassword: "",
          newPassword: "",
          confirmNewPassword: "",
        });
        setIsRecovery(false);
        setIsCodeSent(false);
        setIsCodeConfirmed(false);
      } else {
        showMessage("❌ Failed", data.message || "Reset failed.");
      }
    } catch {
      showMessage("🚨 Network Error", "Could not reset password.");
    }
  };

  return (
    <form
      className="login-box"
      onSubmit={
        isCodeConfirmed
          ? resetPasswordHandler
          : (e) => {
              e.preventDefault();
              confirmAuthCode();
            }
      }
    >
      <h2 className="login-title">
        {isCodeConfirmed ? "Create New Password" : "Recover Account"}
      </h2>
      <hr />

      {!isCodeConfirmed ? (
        <>
          {!isCodeSent ? (
            <>
              <input
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
              <div className="authenticationcode-retry">
                <span>
                  *An authentication code will be sent to your corresponding email.
                </span>
              </div>
              <button type="button" onClick={sendRecoveryCode}>
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

              <AuthCodeInput
                authCode={authCode}
                setAuthCode={setAuthCode}
                onComplete={(code) => confirmAuthCode(code)}
              />

              <button type="submit">Confirm</button>
            </>
          )}
        </>
      ) : (
        <>
          <input
            type="password"
            placeholder="New Password"
            value={formData.newPassword}
            onChange={(e) =>
              setFormData({ ...formData, newPassword: e.target.value })
            }
          />
          <input
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
    </form>
  );
};

export default RecoveryForm;
