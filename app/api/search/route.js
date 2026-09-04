import { NextResponse } from "next/server";
import { searchBusinesses } from "@/lib/googlePlaces";

export async function POST(req) {
  try {
    const body = await req.json();
    const { niche, city, neighborhood, onlyWithoutWebsite = true } = body;

    if (!niche || !city) {
      return NextResponse.json(
        { error: "Nicho e Cidade são campos obrigatórios para a busca." },
        { status: 400 }
      );
    }

    // Buscar empresas (Instagram já vem integrado no motor de busca)
    const businesses = await searchBusinesses({
      niche,
      city,
      neighborhood,
      onlyWithoutWebsite,
    });

    return NextResponse.json({
      success: true,
      count: businesses.length,
      leads: businesses,
    });
  } catch (error) {
    console.error("Erro na rota de busca:", error);
    return NextResponse.json(
      { error: "Falha ao processar a busca de empresas." },
      { status: 500 }
    );
  }
}
