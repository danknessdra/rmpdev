import { json } from "@sveltejs/kit";
import { Client } from "@elastic/elasticsearch";
const client = new Client({
  node: "http://localhost:9200",
  // no auth for now
  // auth: {
  //   username: "elastic",
  //   password: "",
  // },
  tls: {
    // ca: fs.readFileSync("something from the elastic container"),
    rejectUnauthorized: false,
  },
});

export async function POST({ request }: { request: Request }) {
  const searchParams = await request.json();
  console.log("searchParams", searchParams);
  client.indices.refresh({ index: "schools" });
  // type of SearchRequest
  const res = await client.search(searchParams);
  return json(res, { status: 201 });
}
