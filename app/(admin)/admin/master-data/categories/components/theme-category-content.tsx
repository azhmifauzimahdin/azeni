"use client";

import React from "react";
import { Heading } from "@/components/ui/heading";
import ThemeCategoryForm from "./theme-category-form";
import useAdminThemeCategories from "@/hooks/use-admin-theme-category";

const ThemeCategoryContent: React.FC = () => {
  const { themeCategories, isFetching } = useAdminThemeCategories();

  return (
    <>
      <div>
        <Heading title="Kategori Tema" />
      </div>
      <div>
        <ThemeCategoryForm
          initialData={themeCategories}
          isFetching={isFetching}
        />
      </div>
    </>
  );
};

export default ThemeCategoryContent;
