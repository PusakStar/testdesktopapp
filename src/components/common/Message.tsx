interface MessageProps {
  visible: boolean;
  title: string;
  content: string;
}

export default function Message({ visible, title, content }: MessageProps) {
  return (
    <div className={`message ${visible ? "message--visible" : ""}`}>
      <div className="message-header">
        <h3>{title}</h3>
      </div>
      <div className="message-content">
        <p>{content}</p>
      </div>
    </div>
  );
}