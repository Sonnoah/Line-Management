"use client";

export const dynamic = "force-dynamic";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loading } from "../components/loading";

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const page = searchParams.get("page");

    if (!page) return;

    router.replace(`/${page}`);
  }, [searchParams, router]);

  return <Loading />;
}
