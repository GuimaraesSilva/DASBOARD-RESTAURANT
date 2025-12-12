"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Loading } from "./Loading";

interface LoadingContextType {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    // Mostrar loading no primeiro carregamento
    if (isFirstLoad) {
      setIsLoading(true);
      const timer = setTimeout(() => {
        setIsLoading(false);
        setIsFirstLoad(false);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [isFirstLoad]);

  useEffect(() => {
    // Não mostrar loading no primeiro load (já está sendo mostrado acima)
    if (isFirstLoad) return;

    // Mostrar loading quando a rota mudar
    setIsLoading(true);
    
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [pathname, isFirstLoad]);

  return (
    <LoadingContext.Provider value={{ isLoading, setIsLoading }}>
      {isLoading ? (
        <div className="w-full h-screen bg-[#CDDBC8] flex flex-col items-center justify-center gap-4">
          <Loading />
        </div>
      ) : (
        children
      )}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }
  return context;
}