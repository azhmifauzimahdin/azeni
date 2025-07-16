/* eslint-disable @typescript-eslint/no-explicit-any */
import { format, toZonedTime } from "date-fns-tz";
import { NextResponse } from "next/server";
import { ZodError } from "zod";

const timeZone = "Asia/Jakarta";

function convertDates(obj: any): any {
  if (obj instanceof Date) {
    const zoned = toZonedTime(obj, timeZone);
    return format(zoned, "yyyy-MM-dd HH:mm:ss", { timeZone });
  }

  if (obj === null) return null;

  if (Array.isArray(obj)) {
    return obj.map(convertDates);
  }

  if (obj && typeof obj === "object") {
    const result: any = {};
    for (const key in obj) {
      result[key] = convertDates(obj[key]);
    }
    return result;
  }

  return obj;
}

export function ResponseJson(
  data: {
    success?: boolean;
    message: string;
    data?: any;
    errors?: Record<string, string[]>;
    detail?: any;
  },
  init?: ResponseInit
): NextResponse {
  const status = init?.status;
  const isSuccess =
    data.success !== undefined
      ? data.success
      : status !== undefined
      ? status >= 200 && status < 300
      : false;

  const responseBody = {
    success: isSuccess,
    message: data.message,
    ...(data.data !== undefined ? { data: convertDates(data.data) } : {}),
    ...(data.errors ? { errors: data.errors } : {}),
  };

  return NextResponse.json(responseBody, init);
}

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

export function handleZodError(error: ZodError, message = "Validasi gagal") {
  const { fieldErrors, formErrors } = error.flatten();

  const errors = {
    ...fieldErrors,
    ...(formErrors.length > 0 ? { _global: formErrors } : {}),
  };

  return ResponseJson(
    {
      message,
      errors,
    },
    { status: 422 }
  );
}

export function validationError(
  errors: Record<string, string[]>,
  message = "Validasi gagal"
) {
  return ResponseJson(
    {
      message,
      errors,
    },
    { status: 422 }
  );
}

export function handleError(
  error: unknown,
  customMessage = "Terjadi kesalahan pada server. Silakan coba lagi nanti."
) {
  console.error("Unhandled error:", error);

  const isDev = process.env.NODE_ENV === "development";
  return ResponseJson(
    {
      message: isDev
        ? `${customMessage} Detail: ${
            error instanceof Error ? error.message : String(error)
          }`
        : customMessage,
    },
    { status: 500 }
  );
}

export function forbiddenError(message = "Akses ditolak") {
  return ResponseJson(
    {
      message,
    },
    { status: 403 }
  );
}
