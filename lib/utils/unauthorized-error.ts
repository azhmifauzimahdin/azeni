import { ResponseJson } from "./response-with-wib";

export function unauthorizedError() {
  return ResponseJson(
    {
      message: "Unauthorized",
      errors: {
        userId: ["Akses tidak diizinkan"],
      },
    },
    { status: 401 }
  );
}
