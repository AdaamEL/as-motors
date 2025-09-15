import React, { useEffect, useRef } from "react";

// CRA: les env sont dans process.env et doivent commencer par REACT_APP_
const CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID || "";

export default function GoogleSignInButton({ onCredential }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!CLIENT_ID) return;                // pas de client → pas d'init
    if (!window.google || !ref.current) return;

    window.google.accounts.id.initialize({
      client_id: CLIENT_ID,
      callback: (response) => {
        if (response?.credential) onCredential?.(response.credential);
      },
      auto_select: false,
      ux_mode: "popup",
    });

    window.google.accounts.id.renderButton(ref.current, {
      theme: "filled_black",
      size: "large",
      shape: "pill",
      text: "continue_with",
      logo_alignment: "left",
      width: 320,
    });
  }, []);

  if (!CLIENT_ID) return null;

  return (
    <div className="w-full flex justify-center">
      <div ref={ref} />
    </div>
  );
}
