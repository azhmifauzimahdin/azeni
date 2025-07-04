type FieldErrors = Record<string, string[]>;

export function validationError(errors: FieldErrors, status: number = 422) {
  return {
    message: "Validasi gagal",
    errors,
    status,
  };
}
