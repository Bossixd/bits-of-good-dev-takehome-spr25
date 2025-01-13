import { PAGINATION_PAGE_SIZE } from "@/lib/constants/config";

const { MongoClient, ServerApiVersion } = require("mongodb");
const uri =
    "mongodb+srv://admin:p%40ssword@pattakitcluster.xdeby.mongodb.net/?retryWrites=true&w=majority&appName=PattakitCluster";

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});

export async function GET(req: Request) {
    const urlParams = new URL(req.url);
    const status = urlParams.searchParams.get("status");
    const statusList = ["all", "pending", "approved", "completed", "rejected"];
    
    await client.connect();
    const count = await client
        .db("CrisisCompass")
        .collection("requests")
        .find((status && statusList.includes(status) ? {"status": status} : {}))
        .count();

    return new Response(count);
}
