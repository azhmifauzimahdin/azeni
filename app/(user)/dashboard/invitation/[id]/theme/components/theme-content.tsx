"use client";

import { Heading } from "@/components/ui/heading";
import React, { useState } from "react";
import NavigationBack from "@/components/ui/navigation-back";
import useUserInvitations from "@/hooks/use-user-invitation";
import ThemeCard from "./theme-card";
import useThemes from "@/hooks/use-theme";
import Image from "@/components/ui/image";
import toast from "react-hot-toast";
import { handleError } from "@/lib/utils/handle-error";
import { InvitationService } from "@/lib/services";
import useInvitationStore from "@/stores/invitation-store";
import { Pagination } from "@/components/ui/pagination";

interface ThemeContentProps {
  params: {
    id: string;
  };
}

const ThemeContent: React.FC<ThemeContentProps> = ({ params }) => {
  const { getInvitationById, isFetching } = useUserInvitations();
  const invitation = getInvitationById(params.id);
  const { themes } = useThemes();

  const [selectedThemeId, setSelectThemeId] = useState<string | null>(null);
  const updateThemeInInvitation = useInvitationStore(
    (state) => state.updateThemeInInvitation
  );

  const onActiveTheme = async (themeId: string) => {
    try {
      setSelectThemeId(themeId);
      const res = await InvitationService.updateThemeByUserId(params.id, {
        themeId,
      });
      updateThemeInInvitation(params.id, res.data);
      toast.success("Tema berhasil diaktifkan.");
    } catch (error: unknown) {
      handleError(error, "theme");
    } finally {
      setSelectThemeId(null);
    }
  };

  const themesPerPage = 12;
  const totalPages = Math.ceil(themes.length / themesPerPage);
  const [currentPage, setCurrentPage] = useState(1);

  const currentthemes = themes.slice(
    (currentPage - 1) * themesPerPage,
    currentPage * themesPerPage
  );

  function handlePageChange(page: number) {
    setCurrentPage(page);
  }

  return (
    <>
      <NavigationBack href={`/dashboard/invitation/${params.id}`} />
      <div>
        <Heading
          title="Tema"
          description="Temukan desain terbaik yang mencerminkan momen istimewa Anda"
        />
      </div>
      <div className="space-y-4">
        {isFetching ? (
          <div className="flex max-w-md bg-white rounded-lg shadow overflow-hidden animate-pulse">
            <div className="w-1/5 bg-skeleton aspect-square" />
            <div className="p-3 flex-1 space-y-2">
              <div className="h-4 w-24 bg-skeleton rounded" />
              <div className="h-5 w-32 bg-skeleton rounded" />
            </div>
          </div>
        ) : invitation?.theme ? (
          <div className="flex max-w-md bg-white rounded-lg shadow overflow-hidden">
            <Image
              src={invitation.theme.thumbnail}
              alt={invitation.theme.name}
              aspectRatio="aspect-square"
              className="w-1/5 flex-none"
            />
            <div className="p-3">
              <h3>Tema Aktif</h3>
              <div className="text-green-app-primary capitalize font-medium">
                {invitation.theme.name}
              </div>
            </div>
          </div>
        ) : null}
        <h2 className="font-medium text-lg mb-2">Pilih Tema</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {isFetching ? (
            [...Array(5)].map((_, i) => (
              <div
                key={i}
                className="relative bg-white rounded-lg shadow-md overflow-hidden animate-pulse"
              >
                <div className="w-full aspect-square bg-skeleton" />
                <div className="p-3 space-y-3">
                  <div className="h-5 w-1/2 bg-skeleton rounded" />
                  <div className="grid grid-cols-1 gap-3">
                    <div className="h-10 bg-skeleton rounded" />
                    <div className="h-10 bg-skeleton rounded" />
                  </div>
                </div>

                {/* Badge Tema Aktif */}
                <div className="absolute top-0 right-0 m-3 h-6 w-20 bg-skeleton rounded-full" />
              </div>
            ))
          ) : currentthemes.length > 0 ? (
            currentthemes.map((theme, index) => (
              <ThemeCard
                key={index}
                data={theme}
                loading={theme.id === selectedThemeId}
                isActive={theme.id === invitation?.theme?.id}
                onActivate={onActiveTheme}
                demoHref={`/${theme.invitation?.slug}/${theme.invitation?.guest.code}`}
              />
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-10 text-center text-muted-foreground gap-5">
              <Image
                src="https://res.cloudinary.com/dxtqjuvcg/image/upload/v1751291610/theme-green_zbl4vc.png"
                alt="Icon Tema"
                aspectRatio="aspect-square"
                className="w-20"
              />
              <p className="text-sm font-medium">Tema tidak ditemukan</p>
            </div>
          )}
        </div>
        {totalPages > 1 && (
          <div className="mt-8 flex-center">
            <Pagination
              totalPages={totalPages}
              currentPage={currentPage}
              onPageChange={handlePageChange}
              siblingCount={1}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default ThemeContent;
