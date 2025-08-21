import { Invitation } from "@/types";
import Premium1Page from "./premium/premium1";
import Luxury1Page from "./luxury/luxury1";
import Luxury2Page from "./luxury/luxury2";

export const SampleComponents: Record<string, React.FC<Invitation>> = {
  "premium-001": Premium1Page,
  "luxury-001": Luxury1Page,
  "luxury-002": Luxury2Page,
};
