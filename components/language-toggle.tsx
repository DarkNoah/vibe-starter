"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  changeLanguage,
  getCurrentLanguage,
  languages,
  type Language,
} from "@/lib/i18n";
import { ChevronDown, Globe } from "lucide-react";

export function LanguageToggle() {
  const { t } = useTranslation();
  const [currentLang, setCurrentLang] = useState<Language>("en");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setCurrentLang(getCurrentLanguage());
  }, []);

  const handleLanguageChange = (language: Language) => {
    changeLanguage(language);
    setCurrentLang(language);
    // 刷新页面以确保所有翻译都更新
    // 如果不想刷新，可以移除这行
    // window.location.reload();
  };

  if (!mounted) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1">
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline">
            {t(`language.${currentLang}`)}
          </span>
          <ChevronDown className="h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang}
            onClick={() => handleLanguageChange(lang)}
            className={currentLang === lang ? "font-semibold" : ""}
          >
            {t(`language.${lang}`)}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
