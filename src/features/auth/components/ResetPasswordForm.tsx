import React from "react";
import FormInput from "../../../components/forms/FormInput";

interface ResetPasswordFormProps {
  formData: any;
  setFormData: (val: any) => void;
}

const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({ formData, setFormData }) => (
  <>
    <FormInput
      type="password"
      placeholder="New Password"
      value={formData.newPassword}
      onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
    />
    <FormInput
      type="password"
      placeholder="Confirm New Password"
      value={formData.confirmNewPassword}
      onChange={(e) => setFormData({ ...formData, confirmNewPassword: e.target.value })}
    />
    <button type="submit">Confirm</button>
  </>
);

export default ResetPasswordForm;
