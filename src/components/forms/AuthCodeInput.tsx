// AuthCodeInput.tsx
import React, { useRef, useEffect } from "react";

interface AuthCodeInputProps {
  authCode: string[]; // controlled values from parent
  setAuthCode: (val: string[]) => void; // setter from parent
  length?: number; // default 6
  onComplete?: (code: string) => void; // optional
}

const AuthCodeInput: React.FC<AuthCodeInputProps> = ({
  authCode,
  setAuthCode,
  length = 6,
  onComplete,
}) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>(
    Array(length).fill(null)
  );

  useEffect(() => {
    console.log("🔧 AuthCodeInput mounted");
    // keep inputRefs array length in sync if length prop changes
    inputRefs.current = inputRefs.current.slice(0, length);
  }, [length]);

  // distribute pasted digits into the authCode array starting at startIdx
  const distributePaste = (raw: string, startIdx: number) => {
    const digits = (raw ?? "").replace(/\D/g, "");
    if (!digits) return;

    const updated = [...authCode];
    const maxFill = Math.min(digits.length, length - startIdx);

    for (let i = 0; i < maxFill; i++) {
      updated[startIdx + i] = digits[i];
    }

    console.log(
      "📋 distributePaste ->",
      digits,
      "startIdx:",
      startIdx,
      "result:",
      updated.join("")
    );
    setAuthCode(updated);

    // focus next empty or blur last
    const nextEmpty = updated.findIndex((d) => !d);
    if (nextEmpty !== -1) {
      inputRefs.current[nextEmpty]?.focus();
    } else {
      inputRefs.current[length - 1]?.blur();
      if (onComplete && updated.every((c) => c && c.length === 1)) {
        onComplete(updated.join(""));
      }
    }
  };

  // input-level paste (works in many browsers)
  const handleInputPaste = (
    e: React.ClipboardEvent<HTMLInputElement>,
    idx: number
  ) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text");
    console.log("onPaste (input) received:", pasted, "at", idx);

    // ✅ FIX: start distributing from the *current index*, not 0
    distributePaste(pasted, idx);
  };

  // document-level paste fallback (catches cases where input onPaste doesn't fire)
  useEffect(() => {
    const handler = (e: ClipboardEvent) => {
      const pasted = e.clipboardData?.getData("text") ?? "";
      if (!pasted) return;
      console.log("🌍 GLOBAL paste detected:", pasted);

      // Try to derive the index from the event target (better than activeElement for context-menu paste)
      const findIndexFromTarget = (target: EventTarget | null) => {
        if (!target || !(target instanceof Element)) return -1;
        return inputRefs.current.findIndex((el) => {
          if (!el) return false;
          return el === target || el.contains(target as Node);
        });
      };

      // 1) prefer the actual event target
      let focusedIdx = findIndexFromTarget(e.target);

      // 2) fall back to document.activeElement if target didn't match
      if (focusedIdx === -1) {
        focusedIdx = findIndexFromTarget(document.activeElement);
      }

      // 3) fallback: first empty or 0
      const firstEmpty = authCode.findIndex((d) => !d);
      const startIdx =
        focusedIdx >= 0 ? focusedIdx : firstEmpty !== -1 ? firstEmpty : 0;

      e.preventDefault();
      distributePaste(pasted, startIdx);
    };

    document.addEventListener("paste", handler);
    return () => document.removeEventListener("paste", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authCode, length]);

  const handleChange = (idx: number, raw: string) => {
    const digits = raw.replace(/\D/g, "");
    if (digits.length > 1) {
      console.log("Detected multi-char in onChange:", digits, "at", idx);
      distributePaste(digits, idx);
      return;
    }

    const updated = [...authCode];
    updated[idx] = digits ? digits[0] : "";
    setAuthCode(updated);

    if (digits && idx < length - 1) {
      inputRefs.current[idx + 1]?.focus();
    }

    if (onComplete && updated.every((c) => c && c.length === 1)) {
      onComplete(updated.join(""));
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    idx: number
  ) => {
    if (e.key === "Backspace") {
      if (authCode[idx]) {
        const updated = [...authCode];
        updated[idx] = "";
        setAuthCode(updated);
      } else if (idx > 0) {
        inputRefs.current[idx - 1]?.focus();
        const updated = [...authCode];
        updated[idx - 1] = "";
        setAuthCode(updated);
      }
    } else if (e.key === "ArrowLeft" && idx > 0) {
      inputRefs.current[idx - 1]?.focus();
    } else if (e.key === "ArrowRight" && idx < length - 1) {
      inputRefs.current[idx + 1]?.focus();
    }
  };

  return (
    <div className="authenticationcode-inputs" style={{ display: "flex" }}>
      {Array.from({ length }).map((_, idx) => (
        <input
          key={idx}
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={1}
          value={authCode[idx] ?? ""}
          ref={(el: HTMLInputElement | null) => {
            inputRefs.current[idx] = el;
          }}
          onFocus={(e) => {
            setTimeout(() => e.currentTarget.select(), 0);
          }}
          onChange={(e) => handleChange(idx, e.target.value)}
          onInput={(e) =>
            handleChange(idx, (e.target as HTMLInputElement).value)
          }
          onPaste={(e) => handleInputPaste(e, idx)} // ✅ fixed
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
