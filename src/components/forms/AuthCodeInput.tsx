import React, { useRef, useEffect } from "react";

export interface AuthCodeInputProps {
  length?: number;
  authCode: string[];
  setAuthCode: React.Dispatch<React.SetStateAction<string[]>>;
  onComplete?: (code: string) => void; // ✅ Trigger auto-confirm when all digits filled
}

const AuthCodeInput: React.FC<AuthCodeInputProps> = ({
  length = 6,
  authCode,
  setAuthCode,
  onComplete,
}) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    // Auto-focus first input on mount
    inputRefs.current[0]?.focus();
  }, []);

  /** ✅ Handles single-digit change */
  const handleChange = (idx: number, value: string) => {
    if (!/^\d*$/.test(value)) return; // Only allow numbers

    const updated = [...authCode];
    updated[idx] = value.slice(0, 1);
    setAuthCode(updated);

    // Move to next input if value exists
    if (value && idx < length - 1) {
      inputRefs.current[idx + 1]?.focus();
    }

    // Auto-confirm when all filled
    if (updated.every((digit) => digit !== "") && onComplete) {
      onComplete(updated.join(""));
    }
  };

  /** ✅ Handles backspace to previous input */
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    idx: number
  ) => {
    if (e.key === "Backspace" && !authCode[idx] && idx > 0) {
      inputRefs.current[idx - 1]?.focus();
    }
  };

  /** ✅ Handles pasting full code */
  const handleInputPaste = (
    e: React.ClipboardEvent<HTMLInputElement>,
    idx: number
  ) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("Text").replace(/\D/g, "");
    if (!pastedData) return;

    const updated = [...authCode];
    for (let i = 0; i < length; i++) {
      updated[i] = pastedData[i] || "";
    }

    setAuthCode(updated);

    // Focus last filled input
    const lastFilled = Math.min(pastedData.length - 1, length - 1);
    inputRefs.current[lastFilled]?.focus();

    // Auto-confirm if pasted full code
    if (pastedData.length === length && onComplete) {
      onComplete(pastedData);
    }
  };

  return (
    <div
      className="authenticationcode-inputs"
      style={{ display: "flex", justifyContent: "center" }}
    >
      {Array.from({ length }).map((_, idx) => (
        <input
          key={idx}
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={1}
          value={authCode[idx] ?? ""}
          ref={(el) => {
            inputRefs.current[idx] = el; // ✅ Fixed: no return value
          }}
          onFocus={(e) => {
            setTimeout(() => e.currentTarget.select(), 0);
          }}
          onChange={(e) => handleChange(idx, e.target.value)}
          onInput={(e) =>
            handleChange(idx, (e.target as HTMLInputElement).value)
          }
          onPaste={(e) => handleInputPaste(e, idx)}
          onKeyDown={(e) => handleKeyDown(e, idx)}
          aria-label={`Digit ${idx + 1}`}
          style={{
            width: "2rem",
            textAlign: "center",
            fontSize: "1.2rem",
            margin: "0 0.25rem",
          }}
        />
      ))}
    </div>
  );
};

export default AuthCodeInput;
