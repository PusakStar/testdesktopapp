import React, { useRef } from "react";

interface AuthCodeInputProps {
  authCode: string[];
  setAuthCode: (val: string[]) => void;
}

const AuthCodeInput: React.FC<AuthCodeInputProps> = ({ authCode, setAuthCode }) => {
  const inputRefs = useRef<HTMLInputElement[]>([]);

  return (
    <div className="authenticationcode-inputs">
      {authCode.map((val, idx) => (
        <input
          key={idx}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={val}
          ref={(el) => { if (el) inputRefs.current[idx] = el; }}
          onChange={(e) => {
            const input = e.target.value.replace(/\D/g, "").slice(0, 1);
            const updated = [...authCode];
            updated[idx] = input;
            setAuthCode(updated);
            if (input && idx < authCode.length - 1) {
              inputRefs.current[idx + 1]?.focus();
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "Backspace" && authCode[idx] === "" && idx > 0) {
              inputRefs.current[idx - 1]?.focus();
            }
          }}
          style={{ width: "2rem", textAlign: "center" }}
        />
      ))}
    </div>
  );
};

export default AuthCodeInput;
