import NotFound from "@/components/screens/not-found";
import { SampleComponents } from "@/components/template/sample";
// import { fetchSampleByname } from "@/lib/services/sample";
// import { Sample } from "@prisma/client";

type SamplePageProps = {
  params: {
    name: string;
  };
};
const SamplePage = async ({ params }: SamplePageProps) => {
  // let sample: Sample | null = null;

  // try {
  //   sample = await fetchSampleByname(params.name);
  // } catch (error: unknown) {
  //   if (error instanceof Error) {
  //     console.error("Failed to fetch sample:", error.message);
  //   } else {
  //     console.error("Failed to fetch sample: Unknown error");
  //   }
  // }

  // if (!sample) {
  //   return <NotFound message="Sampel undangan tidak ditemukan" />;
  // }

  // const ThemeComponent = SampleComponents[sample.name];

  const theme = ["premium-001"];
  if (!theme.includes(params.name)) {
    return <NotFound message="Sampel undangan tidak ditemukan" />;
  }

  const ThemeComponent = SampleComponents[params.name];
  return <ThemeComponent />;
};

export default SamplePage;
