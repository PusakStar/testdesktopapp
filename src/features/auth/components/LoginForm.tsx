import React from "react";

interface LoginFormProps {
  formData: {
    email: string;
    password: string;
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
  loginHandler: (e: React.FormEvent) => void;
  googleLogin: () => void;
  setIsRecovery: React.Dispatch<React.SetStateAction<boolean>>;
  setIsRegister: React.Dispatch<React.SetStateAction<boolean>>;
  clearForm: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({
  formData,
  setFormData,
  loginHandler,
  googleLogin,
  setIsRecovery,
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
          setFormData((prev) => ({ ...prev, email: e.target.value }))
        }
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={formData.password}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, password: e.target.value }))
        }
        required
      />
      <hr />
      <button type="submit">Login</button>
      <button
        type="button"
        className="google-login-btn"
        onClick={() => googleLogin()}
      >
        <img
          src="/src/assets/googleicon.png"
          alt="Google"
          style={{ width: "20px" }}
        />
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
  );
};

export default LoginForm;
