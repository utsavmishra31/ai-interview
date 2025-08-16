// app/page.js
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default function HomePage() {
  const { userId } = auth();

  if (userId) {
    redirect("/dashboard");
  } else {
    redirect("/sign-in");
  }

  return null;
}
