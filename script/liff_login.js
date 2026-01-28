"use client";

import { liff_init } from "@/helper/liff_Init";
import { Loading } from "@/app/components/loading";

export default function LiffLogin({ children }) {
  const { loading, profile } = liff_init();

  if (loading) return <Loading />;

  if (!profile) {
    return null; 
  }

  return <>{children}</>;
}