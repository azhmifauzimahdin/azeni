export function handleError(error: unknown, contextMessage = "Error occurred") {
  if (error instanceof Error) {
    console.error(`Failed to fetch ${contextMessage}:`, error.message);
    return error.message;
  } else {
    console.error(`Failed to fetch ${contextMessage}: Unknown error`);
    return "Unknown error";
  }
}
