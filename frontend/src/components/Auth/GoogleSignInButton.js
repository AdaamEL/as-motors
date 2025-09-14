import React, { useEffect, useRef } from "react";

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

export default function GoogleSignInButton({ onCredential }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!window.google || !ref.current || !CLIENT_ID) return;

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

  return (
    <div className="w-full flex justify-center">
      <div ref={ref} />
    </div>
  );
}
