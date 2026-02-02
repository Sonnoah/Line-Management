"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loading } from "../app/components/loading";

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();

 useEffect(() => {
  const page = searchParams.get("page");

  const allowPages = [
    "check_in",
    "profile",
    "request_for_leave",
    "main",
  ];

  if (!page) return;

  if (!allowPages.includes(page)) {
    router.replace("/main");
    return;
  }

  router.replace(`/${page}`);
}, [searchParams]);


  return <Loading />;
}
