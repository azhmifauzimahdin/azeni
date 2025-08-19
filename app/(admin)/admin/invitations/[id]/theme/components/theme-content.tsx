"use client";

import { Heading } from "@/components/ui/heading";
import React, { useMemo, useState } from "react";
import NavigationBack from "@/components/ui/navigation-back";
import toast from "react-hot-toast";
import { handleError } from "@/lib/utils/handle-error";
import { InvitationService } from "@/lib/services";
import { Pagination } from "@/components/ui/pagination";
import { Img } from "@/components/ui/Img";
import useUserThemes from "@/hooks/use-user-theme";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import useAdminInvitations from "@/hooks/use-admin-invitation";
import ThemeCard, { ThemeCardSkeleton } from "@/components/ui/theme-card";
import useAdminInvitationStore from "@/stores/admin-invitation-store";

interface ThemeContentProps {
  params: {
    id: string;
  };
}

const ThemeContent: React.FC<ThemeContentProps> = ({ params }) => {
  const { getInvitationById, isFetching } = useAdminInvitations();
  const invitation = getInvitationById(params.id);
  const { themes } = useUserThemes(params.id);

  const [selectedThemeId, setSelectThemeId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("Semua");

  const updateThemeInInvitation = useAdminInvitationStore(
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

  const categoryList = useMemo(() => {
    const categories = themes.map((t) => t.category?.name || "Tanpa Kategori");
    return ["Semua", ...Array.from(new Set(categories))];
  }, [themes]);

  const filteredThemes = useMemo(() => {
    return themes.filter((theme) => {
      const matchesSearch = theme.name
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesCategory =
        activeCategory === "Semua" ||
        (theme.category?.name || "Tanpa Kategori") === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [themes, search, activeCategory]);

  const themesPerPage = 12;
  const totalPages = Math.ceil(filteredThemes.length / themesPerPage);
  const [currentPage, setCurrentPage] = useState(1);

  const currentThemes = useMemo(() => {
    return filteredThemes.slice(
      (currentPage - 1) * themesPerPage,
      currentPage * themesPerPage
    );
  }, [filteredThemes, currentPage]);

  function handlePageChange(page: number) {
    setCurrentPage(page);
  }

  return (
    <>
      <NavigationBack href={`/admin/invitations/${params.id}`} />
      <div>
        <Heading
          title="Tema"
          description="Temukan desain terbaik yang mencerminkan momen istimewa Anda"
        />
      </div>
      <Alert>
        Mengganti tema akan secara otomatis mengubah musik sesuai tema yang
        dipilih.
      </Alert>
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
            <Img
              src={invitation.theme.thumbnail}
              alt={invitation.theme.name}
              wrapperClassName="w-1/5 aspect-square flex-none"
              sizes="32px"
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
        <div className="my-4">
          <Input
            id="search"
            placeholder="Cari tema..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            type="search"
            className="mb-4 max-w-md"
            isFetching={isFetching}
            autoComplete="off"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
          {categoryList.map((cat) => (
            <Button
              variant={activeCategory === cat ? "primary" : "outline"}
              key={cat}
              onClick={() => {
                setActiveCategory(cat);
                setCurrentPage(1);
              }}
              className="rounded-full whitespace-nowrap shadow-sm"
            >
              {cat}
            </Button>
          ))}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {isFetching ? (
            [...Array(5)].map((_, i) => <ThemeCardSkeleton key={i} />)
          ) : currentThemes.length > 0 ? (
            currentThemes.map((theme, index) => (
              <ThemeCard
                key={index}
                showPrice={false}
                buttonText="Aktifkan"
                data={theme}
                loading={theme.id === selectedThemeId}
                isActive={theme.id === invitation?.theme?.id}
                onActivate={onActiveTheme}
                demoHref={`/${theme.invitation?.slug}/${theme.invitation?.guest.code}`}
              />
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-10 text-center text-muted-foreground gap-5">
              <Img
                src="/assets/img/theme-green.png"
                alt="Icon Tema"
                wrapperClassName="w-20 aspect-square"
                sizes="80px"
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
