"use client";

import React, { useMemo, useState } from "react";
import useThemes from "@/hooks/use-theme";
import Stepper from "@/components/ui/stepper";
import { Img } from "@/components/ui/Img";
import { Pagination } from "@/components/ui/pagination";
import { useRouter } from "next/navigation";
import { Alert } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ThemeCard, { ThemeCardSkeleton } from "@/components/ui/theme-card";
import NavigationBack from "@/components/ui/navigation-back";

const InvitationThemeForm: React.FC = () => {
  const { themes, isFetching } = useThemes();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  const [activeCategory, setActiveCategory] = useState("Semua");

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
      <NavigationBack href="/dashboard/invitation" />
      <Stepper currentStep={0} />
      <Alert variant="default">
        Tema undangan dapat diubah melalui menu Kelola Undangan, dengan syarat
        tema memiliki harga sama.
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

      <div className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {isFetching ? (
            [...Array(5)].map((_, i) => <ThemeCardSkeleton key={i} />)
          ) : currentThemes.length > 0 ? (
            currentThemes.map((theme) => (
              <ThemeCard
                key={theme.id}
                buttonText="Pilih"
                data={theme}
                loading={isLoading}
                onActivate={(id) => {
                  setIsLoading(true);
                  router.push(`/dashboard/invitation/new?theme_id=${id}`);
                }}
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

export default InvitationThemeForm;
