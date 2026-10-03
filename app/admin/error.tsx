"use client";

import { useEffect } from "react";
import { PageHeader, AdminButton, EmptyState } from "@/components/admin/admin-primitives";

/** Catches a stale or revoked admin session (and any other render-time failure) without leaking details. */
export default function AdminError({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  useEffect(() => {
    console.error("[admin]", error.digest ?? error.message);
  }, [error]);

  return (
    <>
      <PageHeader eyebrow="ADMIN / ERROR" title="Something needs another look." />
      <EmptyState
        title="This screen couldn't load."
        body="Your session may have changed, or the request failed. Try again, or sign in again if the problem continues."
        action={
          <div style={{ display: "flex", gap: "12px" }}>
            <AdminButton type="button" variant="dark" onClick={retry}>Try again</AdminButton>
            <AdminButton type="button" variant="line" onClick={() => { window.location.href = "/admin/login"; }}>Sign in again</AdminButton>
          </div>
        }
      />
    </>
  );
}
