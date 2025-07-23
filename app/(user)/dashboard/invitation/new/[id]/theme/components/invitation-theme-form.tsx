"use client";

import React, { useMemo, useState } from "react";
import useUserInvitations from "@/hooks/use-user-invitation";
import useThemes from "@/hooks/use-theme";
import Stepper from "@/components/ui/stepper";
import { Img } from "@/components/ui/Img";
import useInvitationStore from "@/stores/invitation-store";
import ThemeCard from "./invitation-theme-card";
import { Pagination } from "@/components/ui/pagination";
import { TransactionService } from "@/lib/services";
import { handleError } from "@/lib/utils/handle-error";
import { useRouter } from "next/navigation";
import { Alert } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import clsx from "clsx";
import useTransactionStore from "@/stores/transaction-store";

interface InvitationThemeFormProps {
  params: {
    id: string;
  };
}

const InvitationThemeForm: React.FC<InvitationThemeFormProps> = ({
  params,
}) => {
  const { getInvitationById, isFetching } = useUserInvitations();
  const invitation = getInvitationById(params.id);
  const { themes } = useThemes();
  const router = useRouter();

  const [selectedThemeId, setSelectThemeId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("Semua");

  const updateThemeInInvitation = useInvitationStore(
    (state) => state.updateThemeInInvitation
  );
  const updateTransactionInInvitation = useInvitationStore(
    (state) => state.updateTransactionInInvitation
  );

  const caddTransactionAtFirstc = useTransactionStore(
    (state) => state.addTransactionAtFirst
  );

  const onActiveTheme = async (themeId: string) => {
    try {
      setSelectThemeId(themeId);
      const res = await TransactionService.selectThemeByInvitationId(
        params.id,
        {
          themeId,
        }
      );
      updateThemeInInvitation(params.id, res.data.theme);
      updateTransactionInInvitation(params.id, res.data.transaction);
      caddTransactionAtFirstc(res.data.transaction);
      router.push("checkout");
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
  const [currentPage, setCurrentPage] = useState<number>(1);

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
      <Stepper currentStep={1} />
      <Alert variant="default">
        Tema undangan dapat diubah melalui menu Kelola Undangan, selama harga
        tema sama.
      </Alert>

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
          <button
            key={cat}
            onClick={() => {
              setActiveCategory(cat);
              setCurrentPage(1);
            }}
            className={clsx(
              "px-4 py-1 text-sm rounded-full border transition whitespace-nowrap",
              activeCategory === cat
                ? "bg-teal-600 text-white border-teal-600"
                : "bg-white text-gray-600 border-gray-300 hover:bg-gray-100"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="space-y-4">
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
                <div className="absolute top-0 right-0 m-3 h-6 w-20 bg-skeleton rounded-full" />
              </div>
            ))
          ) : currentThemes.length > 0 ? (
            currentThemes.map((theme) => (
              <ThemeCard
                key={theme.id}
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
                src="https://res.cloudinary.com/dxtqjuvcg/image/upload/v1751291610/theme-green_zbl4vc.png"
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

export default InvitationThemeForm;
