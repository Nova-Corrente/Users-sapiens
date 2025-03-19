import { revalidateTag } from 'next/cache'
import prisma from "@/lib/prisma";

export async function ListUsers() {

    revalidateTag('sapiens')
    
    const users = await prisma.r911sec.findMany({
        select: {
            r911mod: {
                select: {
                    numsec: true,
                    modnam: true,
                },
            },
            numsec: true,
            dattim: true,
            comnam: true,
            usrnam: true,
            appnam: true,
            appusr: true,
            idinst: true,
            admmsg: true,
            appknd: true
        },
        where: {
            appnam: {
                equals: 'SAPIENS'
            }
        },
        orderBy: {
            dattim: 'asc'
        }
    });

    return users;
}
