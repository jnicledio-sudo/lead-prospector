import { NextResponse } from "next/server";
import { generateSalesPitch } from "@/lib/aiService";

export async function POST(req) {
  try {
    const body = await req.json();
    const { companyName, niche, city, neighborhood, phone, instagramHandle, rating } = body;

    if (!companyName) {
      return NextResponse.json(
        { error: "O nome da empresa é obrigatório." },
        { status: 400 }
      );
    }

    const pitches = await generateSalesPitch({
      companyName,
      niche,
      city,
      neighborhood,
      phone,
      instagramHandle,
      rating,
    });

    return NextResponse.json({
      success: true,
      pitches,
    });
  } catch (error) {
    console.error("Erro na rota de geração de pitch:", error);
    return NextResponse.json(
      { error: "Falha ao gerar abordagem com IA." },
      { status: 500 }
    );
  }
}
