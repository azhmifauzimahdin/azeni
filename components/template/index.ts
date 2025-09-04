import { Invitation } from "@/types";
import Premium1Page from "./premium/premium1";
import Luxury1Page from "./luxury/luxury1";
import Luxury2Page from "./luxury/luxury2";
import Premium2Page from "./premium/premium2";
import React from "react";
import Premium2BasicPage from "./premium/premium2basic";
import Premium1BasicPage from "./premium/premium1basic";
import Luxury1BasicPage from "./luxury/luxury1basic";
import Luxury2BasicPage from "./luxury/luxury2basic";

export const SampleComponents: Record<string, React.FC<Invitation>> = {
  "premium 001": Premium1Page,
  "premium 001 basic": Premium1BasicPage,
  "premium 002": Premium2Page,
  "premium 002 basic": Premium2BasicPage,
  "luxury 001": Luxury1Page,
  "luxury 001 basic": Luxury1BasicPage,
  "luxury 002": Luxury2Page,
  "luxury 002 basic": Luxury2BasicPage,
};
