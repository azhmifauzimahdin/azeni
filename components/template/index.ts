import { Guest, Invitation } from "@/types";
import Premium1 from "./premium1";

export const SampleComponents: Record<
  string,
  React.FC<Invitation & { currentGuest: Guest }>
> = {
  "premium-001": Premium1,
};
