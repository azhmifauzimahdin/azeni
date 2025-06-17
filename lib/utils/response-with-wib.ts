/* eslint-disable @typescript-eslint/no-explicit-any */
import { format, toZonedTime } from "date-fns-tz";
import { NextResponse } from "next/server";

const timeZone = "Asia/Jakarta";

function convertDates(obj: any): any {
  if (obj instanceof Date) {
    const zoned = toZonedTime(obj, timeZone);
    return format(zoned, "yyyy-MM-dd HH:mm:ss", { timeZone });
  }

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

export function ResponseJson(data: any, init?: ResponseInit) {
  const converted = convertDates(data);
  return NextResponse.json(converted, init);
}
