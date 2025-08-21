// src/features/auth/components/RegisterForm.tsx
import React from "react";

interface RegisterFormProps {
  formData: {
    email: string;
    password: string;
    confirmPassword: string;
  };
  setFormData: React.Dispatch<
    React.SetStateAction<{
      email: string;
      password: string;
      confirmPassword: string;
      newPassword?: string;
      confirmNewPassword?: string;
    }>
  >;
  registerHandler: (e: React.FormEvent) => void;
  googleLogin: () => void;
  setIsRegister: React.Dispatch<React.SetStateAction<boolean>>;
  clearForm: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({
  formData,
  setFormData,
  registerHandler,
  googleLogin,
  setIsRegister,
  clearForm,
}) => {
  return (
    <>
      <input
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={(e) =>
          setFormData({ ...formData, email: e.target.value })
        }
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={formData.password}
        onChange={(e) =>
          setFormData({ ...formData, password: e.target.value })
        }
        required
      />
      <input
        type="password"
        placeholder="Confirm Password"
        value={formData.confirmPassword}
        onChange={(e) =>
          setFormData({ ...formData, confirmPassword: e.target.value })
        }
        required
      />

      <hr />
      <button type="submit" onClick={registerHandler}>
        Register
      </button>

      <button
        type="button"
        className="google-login-btn"
        onClick={googleLogin}
      >
        <img
          src="/src/assets/googleicon.png"
          alt="Google"
          style={{ width: "20px", marginRight: "8px" }}
        />
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
  );
};

export default RegisterForm;
