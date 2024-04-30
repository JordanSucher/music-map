import { NextResponse } from "next/server";
import prisma from "../../../prisma/prismaClient";


export async function GET() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 7);
    tomorrow.setHours(0, 0, 0, 0);


    try {
        let concerts = await prisma.show.findMany({
            include: {
                bandShows: {
                    include: {
                        band: {
                            include: {
                                tracks: true
                            }
                        }
                    }
                }
            },
            where: {
                date: {gte : today, lte: tomorrow}
            }
        })
        return NextResponse.json(concerts, { status: 200 });
    }

    catch (error) {
        console.log(error)
        return NextResponse.json(error, error.message, { status: 500 });
    }
}