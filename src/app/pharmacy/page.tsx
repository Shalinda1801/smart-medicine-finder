import { redirect } from "next/navigation";

export default function PharmacyPortalRedirect() {
  redirect("/pharmacy/dashboard");
}