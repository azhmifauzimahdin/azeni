import toast from "react-hot-toast";

export function handleError(error: unknown, contextMessage = "Error occurred") {
  if (error instanceof Error) {
    console.error(`Failed to fetch ${contextMessage}:`, error.message);
    toast.error("Cek kembali data dan koneksi internet.");
    return error.message;
  } else {
    console.error(`Failed to fetch ${contextMessage}: Unknown error`);
    toast.error("Cek kembali data dan koneksi internet.");
    return "Unknown error";
  }
}
