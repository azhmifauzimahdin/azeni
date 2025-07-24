import toast from "react-hot-toast";
import axios from "axios";

export function handleError(error: unknown, contextMessage = "Error occurred") {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const messageFromApi = error.response?.data?.message;

    if ((status === 403 || status === 409) && messageFromApi) {
      toast.error(messageFromApi);
    } else {
      toast.error("Cek kembali data dan koneksi internet.");
    }

    console.error(`Failed to fetch ${contextMessage}:`, error.message);
    throw error;
  }

  if (error instanceof Error) {
    console.error(`Failed to fetch ${contextMessage}:`, error.message);
    toast.error("Cek kembali data dan koneksi internet.");
    throw error;
  } else {
    console.error(`Failed to fetch ${contextMessage}: Unknown error`);
    toast.error("Cek kembali data dan koneksi internet.");
    throw new Error("Unknown error");
  }
}
