"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import {Toaster} from "sonner";
export function Providers({ children }) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="light">
      {children}
      <Toaster richColors position ="top-center"/>
    </NextThemesProvider>
  );
}