import { useEffect, useState } from "react";

export default function UserAvatar({ user, className = "", label }) {
  const [imageFailed, setImageFailed] = useState(false);
  const metadata = user?.user_metadata ?? {};
  const avatarUrl = metadata.avatar_url || metadata.picture || null;
  const displayName = metadata.full_name || metadata.name || user?.email?.split("@")[0] || "User";
  const initials = displayName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  useEffect(() => setImageFailed(false), [avatarUrl]);

  return (
    <span className={`user-avatar ${className}`.trim()} title={label || displayName}>
      {avatarUrl && !imageFailed ? (
        <img
          src={avatarUrl}
          alt={label || `${displayName} profile`}
          referrerPolicy="no-referrer"
          onError={() => setImageFailed(true)}
        />
      ) : initials}
    </span>
  );
}
