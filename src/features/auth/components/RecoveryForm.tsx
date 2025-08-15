import React from "react";
import FormInput from "../../../components/forms/FormInput";
import AuthCodeInput from "../../../components/forms/AuthCodeInput";

interface RecoveryFormProps {
  formData: any;
  setFormData: (val: any) => void;
  authCode: string[];
  setAuthCode: (val: string[]) => void;
  isCodeSent: boolean;
  retryCountdown: number;
  sendRecoveryHandler: () => void;
}

const RecoveryForm: React.FC<RecoveryFormProps> = ({
  formData,
  setFormData,
  authCode,
  setAuthCode,
  isCodeSent,
  retryCountdown,
  sendRecoveryHandler,
}) => (
  <>
    {!isCodeSent ? (
      <>
        <FormInput
          type="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        <div className="authenticationcode-retry">
          <span>*An authentication code will be sent to your email.</span>
        </div>
        <button type="button" onClick={sendRecoveryHandler}>
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
              if (retryCountdown === 0) sendRecoveryHandler();
            }}
            style={{
              pointerEvents: retryCountdown > 0 ? "none" : "auto",
              color: retryCountdown > 0 ? "gray" : "blue",
            }}
          >
            retry {retryCountdown > 0 ? `(${retryCountdown}s)` : ""}
          </a>
        </div>
        <AuthCodeInput authCode={authCode} setAuthCode={setAuthCode} />
        <button type="submit">Confirm</button>
      </>
    )}
    <span>
      Back to{" "}
      <a
        href="#login"
        onClick={(e) => {
          e.preventDefault();
          setFormData({ email: "", password: "" });
        }}
      >
        Login
      </a>
    </span>
  </>
);

export default RecoveryForm;
