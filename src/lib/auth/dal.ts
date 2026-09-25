import "server-only";

import { redirect } from "next/navigation";
import { cache } from "react";
import { getSession } from "./session";

// The authoritative auth check. The proxy only does an optimistic redirect;
// every admin page and every server action must call this, because server
// actions are reachable by direct POST regardless of which page is shown.
export const verifyAdmin = cache(async () => {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  return session;
});
