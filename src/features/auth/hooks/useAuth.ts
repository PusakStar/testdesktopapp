import { useState, useCallback } from "react";

interface AuthFormData {
  email: string;
  password: string;
  confirmPassword: string;
  newPassword?: string;
  confirmNewPassword?: string;
}

const useAuth = (initialEmail = "") => {
  const [formData, setFormData] = useState<AuthFormData>({
    email: initialEmail,
    password: "",
    confirmPassword: "",
    newPassword: undefined,
    confirmNewPassword: undefined,
  });

  const [authCode, setAuthCode] = useState(["", "", "", "", "", ""]);
  const [msgVisible, setMsgVisible] = useState(false);
  const [msgTitle, setMsgTitle] = useState("");
  const [msgContent, setMsgContent] = useState("");

  const showMessage = useCallback((title: string, content: string) => {
    setMsgTitle(title);
    setMsgContent(content);
    setMsgVisible(true);
    setTimeout(() => setMsgVisible(false), 3000);
  }, []);

  const clearForm = () =>
    setFormData({
      email: "",
      password: "",
      confirmPassword: "",
      newPassword: undefined,
      confirmNewPassword: undefined,
    });

  return {
    formData,
    setFormData,
    authCode,
    setAuthCode,
    msgVisible,
    msgTitle,
    msgContent,
    showMessage,
    clearForm,
  };
};

export default useAuth;
