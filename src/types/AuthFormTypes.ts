// src/features/auth/types/AuthFormTypes.ts
export interface AuthFormData {
  email: string;
  password: string;
  confirmPassword: string;
  newPassword?: string;
  confirmNewPassword?: string;
}

export interface LoginFormProps {
  formData: AuthFormData;
  setFormData: React.Dispatch<React.SetStateAction<AuthFormData>>;
  loginHandler: (e: React.FormEvent) => void;
  googleLogin: () => void;
  setIsRecovery: React.Dispatch<React.SetStateAction<boolean>>;
  setIsRegister: React.Dispatch<React.SetStateAction<boolean>>;
  clearForm: () => void;
}

export interface RegisterFormProps {
  formData: AuthFormData;
  setFormData: React.Dispatch<React.SetStateAction<AuthFormData>>;
  registerHandler: (e: React.FormEvent) => void;
  googleLogin: () => void;
  setIsRegister: React.Dispatch<React.SetStateAction<boolean>>;
  clearForm: () => void;
}

export interface RecoveryFormProps {
  formData: AuthFormData;
  setFormData: React.Dispatch<React.SetStateAction<AuthFormData>>;
  showMessage: (title: string, content: string) => void;
  setIsRecovery: React.Dispatch<React.SetStateAction<boolean>>;
  authCode: string[];
  setAuthCode: React.Dispatch<React.SetStateAction<string[]>>;
}
