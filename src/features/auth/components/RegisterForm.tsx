import React from "react";
import FormInput from "../../../components/forms/FormInput";

interface RegisterFormProps {
  formData: any;
  setFormData: (val: any) => void;
  googleLogin: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ formData, setFormData, googleLogin }) => (
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
      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
    />
    <hr />
    <button type="submit">Register</button>
    <button type="button" className="google-login-btn" onClick={googleLogin}>
      <img src="/src/assets/googleicon.png" alt="Google" style={{ width: "20px", marginRight: "8px" }} />
      Register with Google
    </button>
    <span>
      Already have an account?{" "}
      <a
        href="#login"
        onClick={(e) => {
          e.preventDefault();
          setFormData({ email: "", password: "", confirmPassword: "" });
        }}
      >
        Login
      </a>
    </span>
  </>
);

export default RegisterForm;
