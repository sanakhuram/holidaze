// src/hooks/useSession.ts
"use client";

import useSWR from "swr";

const fetcher = (url: string) => fetch(url, { cache: "no-store" }).then((r) => r.json());

export function useSession() {
  const { data, error, isLoading, mutate } = useSWR("/auth/session", fetcher, {
    revalidateOnFocus: false,
    shouldRetryOnError: false,
  });

  return {
    authenticated: !!data?.authenticated,
    user: data?.user ?? null,
    isLoading,
    error,
    refresh: () => mutate(),
  };
}
