import { ReactNode } from "react";

interface HeadingProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  isFetching?: boolean;
}

function HeadingSkeleton() {
  return (
    <div className="animate-pulse space-y-2">
      <div className="h-6 w-1/2 bg-skeleton rounded" />
      <div className="h-4 w-2/3 bg-skeleton rounded" />
    </div>
  );
}
export const Heading: React.FC<HeadingProps> = ({
  icon,
  title,
  description,
  isFetching,
}) => {
  if (isFetching) {
    return <HeadingSkeleton />;
  }
  return (
    <>
      <div>
        <h2 className="text-2xl font-semibold text-slate-800 flex items-center gap-2.5">
          {icon ? (
            <div className="text-green-app-primary font-bold">{icon}</div>
          ) : null}
          {title}
        </h2>
        {description && (
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        )}
      </div>
    </>
  );
};
