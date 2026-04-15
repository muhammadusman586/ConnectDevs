/* eslint-disable react/prop-types */
const timeAgo = (dateStr) => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "now";
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  const days = Math.floor(hrs / 24);
  return `${days}d`;
};

const MessageBubble = ({ message, isMine }) => {
  return (
    <div className={`flex ${isMine ? "justify-end" : "justify-start"} mb-2`}>
      <div
        className={`max-w-[75%] px-3.5 py-2 rounded-xl ${
          isMine
            ? "bg-accent/15 border border-accent/25 text-body rounded-br-md"
            : "bg-surface border border-border text-body rounded-bl-md"
        }`}
      >
        <p className="text-sm leading-relaxed break-words whitespace-pre-wrap">
          {message.text}
        </p>
        <p
          className={`font-mono text-[10px] mt-1 ${
            isMine ? "text-accent/40 text-right" : "text-muted/40"
          }`}
        >
          {timeAgo(message.createdAt)}
        </p>
      </div>
    </div>
  );
};

export default MessageBubble;
