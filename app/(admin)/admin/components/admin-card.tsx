import { Calendar, CreditCard, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const DashboardSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-pulse">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="w-1/3 h-4 bg-muted rounded" />
          <div className="h-4 w-4 bg-muted rounded" />
        </CardHeader>
        <CardContent>
          <div className="h-6 w-1/4 bg-muted rounded mb-2" />
          <div className="h-3 w-2/3 bg-muted rounded" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="w-1/3 h-4 bg-muted rounded" />
          <div className="h-4 w-4 bg-muted rounded" />
        </CardHeader>
        <CardContent>
          <div className="h-6 w-1/2 bg-muted rounded mb-2" />
          <div className="h-3 w-2/3 bg-muted rounded" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="w-1/3 h-4 bg-muted rounded" />
          <div className="h-4 w-4 bg-muted rounded" />
        </CardHeader>
        <CardContent>
          <div className="h-5 w-2/3 bg-muted rounded mb-2" />
          <div className="h-3 w-3/4 bg-muted rounded" />
        </CardContent>
      </Card>
    </div>
  );
};

interface AdminCardProps {
  data: {
    totalActiveInvitations: number;
    totalTransactions: number;
    nextEvent: {
      coupleName: string;
      date: Date;
    } | null;
  };
  isFetching: boolean;
}

const AdminCard: React.FC<AdminCardProps> = ({ data, isFetching }) => {
  if (isFetching) return <DashboardSkeleton />;
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Undangan Aktif</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {data.totalActiveInvitations}
          </div>
          <p className="text-xs text-muted-foreground">
            Total undangan yang aktif saat ini
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Transaksi</CardTitle>
          <CreditCard className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            Rp {data.totalTransactions.toLocaleString("id-ID")}
          </div>
          <p className="text-xs text-muted-foreground">Total nilai transaksi</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Acara Terdekat</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {data.nextEvent ? (
            <>
              <div className="text-xl font-semibold">
                {data.nextEvent.coupleName}
              </div>
              <p className="text-sm text-muted-foreground">
                {data.nextEvent.date.toLocaleDateString("id-ID", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">
              Belum ada acara terdekat
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminCard;
