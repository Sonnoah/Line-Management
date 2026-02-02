"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loading } from "../app/components/loading";

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const to = searchParams.get("to");

    if (to) {
      router.replace(`/${to}`);
    }
  }, [searchParams, router]);

    return <Loading />;
}

