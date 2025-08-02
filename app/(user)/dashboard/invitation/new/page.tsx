import { redirect } from "next/navigation";
import InvitationForm from "./components/invitation-form";
import { generatePageMetadata } from "@/lib/metadata";
import { prisma } from "@/lib/prisma";

export const generateMetadata = () =>
  generatePageMetadata({ fallbackTitle: "Buat Undangan" });

interface InvitationFormProps {
  searchParams: { theme_id?: string };
}

export default async function InvitationPage({
  searchParams,
}: InvitationFormProps) {
  const theme = searchParams.theme_id
    ? await prisma.theme.findUnique({ where: { id: searchParams.theme_id } })
    : null;

  if (!theme) {
    redirect("new/theme");
  }
  return (
    <div className="space-y-4">
      <InvitationForm searchParams={searchParams} />
    </div>
  );
}
