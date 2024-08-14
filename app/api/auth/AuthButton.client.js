"use client";
import { useSession } from "next-auth/react";

import { Button } from "rizzui";

import { signIn, signOut } from "@/api/auth/helpers";

export default function AuthButton() {
  const session = useSession();

  return session?.data?.user ? (
    <Button
      onClick={async () => {
        await signOut();
        await signIn();
      }}
    >
       Sign Out
    </Button>
  ) : (
    <Button onClick={async () => await signIn()}>Sign In</Button>
  );
}