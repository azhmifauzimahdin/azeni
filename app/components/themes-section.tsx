"use client";

import React, { useMemo, useState } from "react";
import useThemes from "@/hooks/use-theme";
import { Img } from "@/components/ui/Img";
import { Pagination } from "@/components/ui/pagination";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ThemeCard, { ThemeCardSkeleton } from "@/components/ui/theme-card";
import { useRouter } from "next/navigation";

const ThemesSection: React.FC = () => {
  const router = useRouter();
  const { themes, isFetching } = useThemes();

  const [search, setSearch] = useState("");
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
    <section className="py-16 px-6 bg-white" id="tema">
      <div className="max-w-6xl mx-auto ">
        <div className="text-center mb-12" data-aos="fade-up">
          <h2 className="relative inline-block text-3xl font-bold tracking-tight text-green-app-primary">
            Pilih Tema Undangan
            <span className="absolute left-1/2 -bottom-2 -translate-x-1/2 w-16 h-1 bg-green-app-primary/60 rounded-full" />
          </h2>
        </div>

        <div
          className="flex flex-col items-center gap-4 mb-6"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          <Input
            id="search"
            placeholder="Cari tema..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            type="search"
            className="w-full max-w-md"
            autoComplete="off"
          />

          <div className="flex gap-2 flex-wrap justify-center">
            {categoryList.map((cat) => (
              <Button
                variant={activeCategory === cat ? "primary" : "outline"}
                key={cat}
                onClick={() => {
                  setActiveCategory(cat);
                  setCurrentPage(1);
                }}
                className="rounded-full text-sm px-4 py-1.5 shadow-sm transition"
              >
                {cat}
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {isFetching ? (
              [...Array(5)].map((_, i) => (
                <div key={i} data-aos="zoom-in-up" data-aos-delay={i * 50}>
                  <ThemeCardSkeleton />
                </div>
              ))
            ) : currentThemes.length > 0 ? (
              currentThemes.map((theme, i) => (
                <div
                  key={theme.id}
                  data-aos="zoom-in-up"
                  data-aos-delay={i * 50}
                >
                  <ThemeCard
                    data={theme}
                    onActivate={(id) =>
                      router.push(`/dashboard/invitation/new?theme_id=${id}`)
                    }
                    demoHref={`/${theme.invitation?.slug}/${theme.invitation?.guest.code}`}
                  />
                </div>
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
      </div>
    </section>
  );
};

export default ThemesSection;
