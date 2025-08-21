import { useState, useCallback } from "react";

export function useMessage() {
  const [msgVisible, setMsgVisible] = useState(false);
  const [msgTitle, setMsgTitle] = useState("");
  const [msgContent, setMsgContent] = useState("");

  const showMessage = useCallback((title: string, content: string) => {
    setMsgTitle(title);
    setMsgContent(content);
    setMsgVisible(true);
    setTimeout(() => setMsgVisible(false), 3000);
  }, []);

  return { msgVisible, msgTitle, msgContent, showMessage };
}
