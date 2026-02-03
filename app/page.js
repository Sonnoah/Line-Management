"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loading } from "../app/components/loading";

const ALLOW_ROUTES = ["main", "check_in", "profile", "admin"];

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const to = searchParams.get("to") || "main";

    if (ALLOW_ROUTES.includes(to)) {
      router.replace(`/${to}`);
    } else {
      router.replace("/main");
    }
  }, [router, searchParams]);

  return <Loading />;
}

