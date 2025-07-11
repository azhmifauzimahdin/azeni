import { Input } from "@/components/ui/input";

type Props = {
  search: string;
  setSearch: (val: string) => void;
};

export function DataTableToolbar({ search, setSearch }: Props) {
  return (
    <div className="mb-4 flex justify-between">
      <Input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Cari nama tamu..."
        className="w-full sm:max-w-xs"
      />
    </div>
  );
}
