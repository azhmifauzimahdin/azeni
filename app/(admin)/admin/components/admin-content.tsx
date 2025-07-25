"use client";

import { Heading } from "@/components/ui/heading";
import Stepper from "@/components/ui/stepper";
import React from "react";

const AdminContent: React.FC = () => {
  return (
    <>
      <div>
        <Heading title="Dashboard" />
        <Stepper currentStep={3} />
      </div>
    </>
  );
};

export default AdminContent;
