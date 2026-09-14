import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(
    localStorage.getItem("patient_language") || "en"
  );

  useEffect(() => {
    localStorage.setItem(
      "patient_language",
      language
    );

    window.dispatchEvent(
      new Event("patient-language-change")
    );
  }, [language]);

  function changeLanguage(newLanguage) {
    setLanguage(newLanguage);
  }

  return (
    <LanguageContext.Provider
      value={{
        language,
        changeLanguage,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error(
      "useLanguage must be used inside LanguageProvider"
    );
  }

  return context;
}