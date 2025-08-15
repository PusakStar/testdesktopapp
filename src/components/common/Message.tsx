import React from "react";

interface MessageProps {
  visible: boolean;
  title: string;
  content: string;
}

const Message: React.FC<MessageProps> = ({ visible, title, content }) => {
  if (!visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: "20px",
        right: "20px",
        background: "#fff",
        border: "1px solid #ccc",
        padding: "12px 16px",
        borderRadius: "8px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        zIndex: 9999,
      }}
    >
      <strong>{title}</strong>
      <div>{content}</div>
    </div>
  );
};

export default Message;
