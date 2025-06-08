import axios from "axios";

export async function fetchSampleByname(name: string) {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/samples/${name}`
  );
  return res.data;
}
