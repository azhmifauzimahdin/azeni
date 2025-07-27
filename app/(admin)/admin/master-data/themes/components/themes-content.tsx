"use client";

import React from "react";
import { Heading } from "@/components/ui/heading";
import ThemesForm from "./themes-form";
import useAdminThemes from "@/hooks/use-admin-theme";
import useAdminThemeCategories from "@/hooks/use-admin-theme-category";
import useAdminMusics from "@/hooks/use-admin-music";

const ThemesContent: React.FC = () => {
  const { themes, isFetching } = useAdminThemes();
  const { themeCategories } = useAdminThemeCategories();
  const { musics } = useAdminMusics();

  return (
    <>
      <div>
        <Heading title="Tema" />
      </div>
      <div>
        <ThemesForm
          initialData={themes}
          filter={themeCategories}
          musics={musics}
          isFetching={isFetching}
        />
      </div>
    </>
  );
};

export default ThemesContent;
