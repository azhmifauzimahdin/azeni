export {};
export type Roles = "admin" | "user";

declare module "@tanstack/react-table" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData = unknown, TValue = unknown> {
    className?: string;
  }
}
