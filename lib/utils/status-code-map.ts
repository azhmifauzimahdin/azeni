export type InternalStatus =
  | "CREATED"
  | "PENDING"
  | "SUCCESS"
  | "FAILED"
  | "REFUNDED"
  | "CANCELLED";

export const statusCodeMap: Record<InternalStatus, 200 | 201 | 202> = {
  CREATED: 200,
  SUCCESS: 200,
  REFUNDED: 200,
  CANCELLED: 200,
  PENDING: 201,
  FAILED: 202,
};

export function mapStatusNameToStatusCode(
  status: InternalStatus
): 200 | 201 | 202 {
  return statusCodeMap[status];
}
