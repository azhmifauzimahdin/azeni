import { ResponseJson } from "./response";

type FieldErrors = Record<string, string[]>;

export function validationError(errors: FieldErrors, status: number = 422) {
  return ResponseJson(
    {
      message: "Validasi gagal",
      errors,
    },
    { status }
  );
}
