import { PAGINATION_PAGE_SIZE } from "@/lib/constants/config";
import { request } from "http";

const Joi = require("joi");
import { ObjectId } from "mongodb";

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

export async function PUT(req: Request) {
    const body = await req.json();

    const schema = Joi.object({
        requestorName: Joi.string().required(),
        itemRequested: Joi.string().required(),
    });

    const { error } = schema.validate(body);
    if (error) {
        return new Response(`Missing fields: ${error.message}`, {
            status: 400,
        });
    }

    const dateObj = new Date();
    const month = (dateObj.getMonth() + 1).toString().padStart(2, "0");
    const day = dateObj.getDate().toString().padStart(2, "0");
    const year = dateObj.getFullYear().toString().padStart(4, "0");
    const date = `${year}${month}${day}`;

    const item = {
        requestorName: body.requestorName,
        itemRequested: body.itemRequested,
        createdDate: date,
        lastEditedDate: date,
        status: "pending",
    };

    await client.connect();
    await client.db("CrisisCompass").collection("requests").insertOne(item);
    return new Response("Added!");
}

export async function GET(req: Request) {
    const urlParams = new URL(req.url);
    const page = urlParams.searchParams.get("page");
    const status = urlParams.searchParams.get("status");

    if (!page) {
        return new Response("Missing fields: page is missing.", {
            status: 400,
        });
    }

    try {
        parseInt(page);
    } catch (e) {
        return new Response("Invalid page number.", { status: 400 });
    }

    if (
        status &&
        !["pending", "completed", "approved", "rejected"].includes(status)
    ) {
        return new Response(
            "Invalid status. Must be pending, completed, approved, rejected",
            { status: 400 }
        );
    }

    await client.connect();
    const documents = await client
        .db("CrisisCompass")
        .collection("requests")
        .find(status ? { status: status } : {})
        .sort({
            createdDate: 1,
        })
        .skip((parseInt(page) - 1) * PAGINATION_PAGE_SIZE)
        .limit(PAGINATION_PAGE_SIZE)
        .toArray();

    return new Response(JSON.stringify(documents));
}

export async function PATCH(req: Request) {
    const body = await req.json();

    const schema = Joi.object({
        id: Joi.alternatives()
            .try(Joi.string(), Joi.array().items(Joi.string()))
            .required(),
        status: Joi.string().required(),
    });

    const { error } = schema.validate(body);
    if (error) {
        return new Response(`Missing fields: ${error.message}`, {
            status: 400,
        });
    }

    const dateObj = new Date();
    const month = (dateObj.getMonth() + 1).toString().padStart(2, "0");
    const day = dateObj.getDate().toString().padStart(2, "0");
    const year = dateObj.getFullYear().toString().padStart(4, "0");
    const date = `${year}${month}${day}`;

    await client.connect();

    if (body.id instanceof Array) {
        await client
            .db("CrisisCompass")
            .collection("requests")
            .updateMany(
                { _id: { $in: body.id.map((id: string) => new ObjectId(id)) } },
                { $set: { status: body.status, lastEditedDate: date } }
            );
    } else {
        await client
            .db("CrisisCompass")
            .collection("requests")
            .updateOne(
                { _id: new ObjectId(body.id) },
                {
                    $set: { status: body.status, lastEditedDate: date },
                }
            );
    }

    return new Response("Completed!");
}

export async function DELETE(req: Request) {
    const body = await req.json();

    const schema = Joi.object({
        id: Joi.alternatives().try(Joi.array().items(Joi.string())).required(),
    });

    const { error } = schema.validate(body);
    if (error) {
        return new Response(`Missing fields: ${error.message}`, {
            status: 400,
        });
    }

    await client.connect();

    await client
        .db("CrisisCompass")
        .collection("requests")
        .deleteMany({
            _id: { $in: body.id.map((id: string) => new ObjectId(id)) },
        });

    return new Response("Completed!");
}
