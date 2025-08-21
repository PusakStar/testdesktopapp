const useAPI = (showMessage: (title: string, content: string) => void) => {
  const loginAPI = async (email: string, password: string) => {
    try {
      const response = await fetch("http://localhost:3001/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        showMessage("✅ Success", "Logged in successfully!");
        return true;
      } else {
        showMessage("❌ Login Failed", data.message || "Invalid credentials.");
        return false;
      }
    } catch {
      showMessage("🚨 Network Error", "Could not connect to backend.");
      return false;
    }
  };

  const registerAPI = async (email: string, password: string) => {
    try {
      const response = await fetch("http://localhost:3001/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        showMessage("✅ Success", data.message);
        return true;
      } else {
        showMessage("⚠️ Warning", data.message || "Something went wrong");
        return false;
      }
    } catch {
      showMessage("🚨 Network Error", "Backend might be offline.");
      return false;
    }
  };

  const registerGoogleAPI = async (email: string, name: string, googleId: string) => {
    try {
      await fetch("http://localhost:3001/api/register-google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, googleId }),
      });

      showMessage("✅ Success", "Google account registered.");
      return true;
    } catch {
      showMessage("❌ Error", "Google Sign-In failed.");
      return false;
    }
  };

  return { loginAPI, registerAPI, registerGoogleAPI };
};

export default useAPI;
