import React from "react";

const Footer = () => {
  return (
    <footer className="mt-auto w-full bg-white dark:bg-[#111] border-t border-gray-300 dark:border-gray-700 text-sm text-center text-gray-700 dark:text-gray-400 py-6 px-4">
      <p>© {new Date().getFullYear()} <span className="font-semibold text-[#6B1E1E]">AS Motors</span>. Tous droits réservés.</p>
      <p className="mt-1 text-xs">
        Développé avec <span className="text-red-500">❤</span> en <span className="font-medium">React</span> + <span className="font-medium">Tailwind CSS</span>
      </p>
    </footer>
  );
};

export default Footer;
