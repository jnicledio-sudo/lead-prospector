import { NextResponse } from "next/server";
import { searchBusinesses } from "@/lib/googlePlaces";
import { findInstagramProfile } from "@/lib/instagramMatcher";

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

    // 1. Buscar empresas no Google Places / Provedor
    const businesses = await searchBusinesses({
      niche,
      city,
      neighborhood,
      onlyWithoutWebsite,
    });

    // 2. Enriquecer com cruzamento do Instagram em paralelo
    const enrichedLeads = await Promise.all(
      businesses.map(async (business) => {
        const instagramData = await findInstagramProfile({
          name: business.name,
          city: business.city,
          neighborhood: business.neighborhood,
          phone: business.phone,
        });

        return {
          ...business,
          instagram: instagramData,
        };
      })
    );

    return NextResponse.json({
      success: true,
      count: enrichedLeads.length,
      leads: enrichedLeads,
    });
  } catch (error) {
    console.error("Erro na rota de busca:", error);
    return NextResponse.json(
      { error: "Falha ao processar a busca de empresas." },
      { status: 500 }
    );
  }
}
