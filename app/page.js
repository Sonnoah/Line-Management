"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loading } from "../app/components/loading";

const ALLOW_ROUTES = ["main", "check_in", "profile", "admin"];

function RedirectLogic() {
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

export default function Home() {
  return (
    <Suspense fallback={<Loading />}>
      <RedirectLogic />
    </Suspense>
  );
}
