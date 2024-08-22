"use client";
import { useSession } from "next-auth/react";

import Link from "next/link";
import { signIn, signOut } from "@/api/auth/helpers";

export default function AuthButton() {
  const session = useSession();

  return session?.data?.user ? (
    <Link href="/api/auth/signout">
      <button>Sign Out</button>
    </Link>
  ) : (
    <Button onClick={async () => await signIn()}>Sign In</Button>
  );
}