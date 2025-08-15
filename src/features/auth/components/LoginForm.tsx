import React from "react";
import FormInput from "../../../components/forms/FormInput";

interface LoginFormProps {
  formData: any;
  setFormData: (val: any) => void;
  googleLogin: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ formData, setFormData, googleLogin }) => (
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
    <button type="button" className="google-login-btn" onClick={googleLogin}>
      <img src="/src/assets/googleicon.png" alt="Google" style={{ width: "20px" }} />
      Sign in with Google
    </button>
    <div className="forgot-password-contactus">
      <a href="#">Customer Support</a>
      <a
        href="#recover"
        onClick={(e) => {
          e.preventDefault();
          setFormData((prev: any) => ({ ...prev, password: "" }));
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
          setFormData({ email: "", password: "", confirmPassword: "" });
        }}
      >
        Register now
      </a>
    </span>
  </>
);

export default LoginForm;
