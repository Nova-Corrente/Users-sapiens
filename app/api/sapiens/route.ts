import { NextResponse } from "next/server";
import { ListUsers } from "@/app/(pages)/actions/listUsers";
import { revalidateTag } from "next/cache";

export const revalidate = 10

export async function GET() {
    revalidateTag('sapiens')

    try {
        const users = await ListUsers();

        const usersWithStringBigInt = users.map(user => ({
            ...user,
            numsec: user.numsec.toString(),
            r911mod: user.r911mod.map(mod => ({
                ...mod,
                numsec: mod.numsec.toString()
            }))
        }));
    
        const data = {
            dateUpdate: new Date().toLocaleDateString('pt-BR'),
            users: usersWithStringBigInt
        }
    
        return NextResponse.json(data);
    } catch (error) {
        console.error('Erro ao buscar dados:', error);
        return NextResponse.json({ error: 'Servidor indisponível!' }, { status: 500 });
    }

}