interface HeadingProps {
  title: string;
  description: string;
}
export const Heading: React.FC<HeadingProps> = ({ title, description }) => {
  return (
    <>
      <div>
        <h2 className="text-2xl font-medium text-green-app-primary tracking-tight">
          {title}
        </h2>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </>
  );
};
