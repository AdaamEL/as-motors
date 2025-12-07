import React, { useEffect } from "react";
import { Moon, Sun } from "lucide-react"; 
// Note : Le useContext(AuthContext) n'est pas utilisé ici pour la simplicité, mais serait présent dans votre code réel si le ThemeToggle fait partie d'un contexte.

// Logique pour lire/appliquer le thème stocké
const ThemeToggle = () => {
  // Fonction pour définir la classe 'dark' sur le HTML et mettre à jour localStorage
  const applyTheme = (isDark) => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  // Logique d'initialisation (MODIFIÉE pour forcer le thème sombre)
  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    let initialThemeIsDark = false;

    if (storedTheme) {
        initialThemeIsDark = storedTheme === 'dark';
    } else {
        // MODIFICATION: FORCER LE THÈME SOMBRE PAR DÉFAUT SI AUCUNE PRÉFÉRENCE N'EST ENREGISTRÉE
        initialThemeIsDark = true;
        // On enregistre cette préférence par défaut pour ne pas refaire le forçage à chaque chargement
        localStorage.setItem('theme', 'dark');
    }
    
    // Appliquer le thème initial
    if (initialThemeIsDark) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
  }, []);

  const [isDark, setIsDark] = React.useState(() => {
    // L'état initial du composant doit refléter la nouvelle préférence par défaut
    const storedTheme = localStorage.getItem('theme');
    return storedTheme === 'dark';
  });
    

  const toggleTheme = () => {
    setIsDark((prev) => {
      applyTheme(!prev);
      return !prev;
    });
  };
  
  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white transition duration-300 hover:ring-2 hover:ring-brand-primary"
      aria-label="Toggle Theme"
    >
      {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </button>
  );
};

export default ThemeToggle;