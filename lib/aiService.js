/**
 * AI Pitch Generation Service
 * Gera abordagens personalizadas de vendas para empresas sem site
 */

export async function generateSalesPitch({ companyName, niche, city, neighborhood, phone, instagramHandle, rating }) {
  const geminiKey = process.env.GEMINI_API_KEY;
  const groqKey = process.env.GROQ_API_KEY;

  const prompt = `
Você é um especialista sênior em vendas e prospecção comercial para desenvolvimento de websites modernos e páginas de alta conversão.

Gere 3 abordagens comerciais personalizadas, persuasivas e prontas para envio no WhatsApp para a seguinte empresa que NÃO POSSUI SITE:

- Nome da Empresa: "${companyName}"
- Nicho de Atuação: "${niche}"
- Localização: "${neighborhood ? neighborhood + ', ' : ''}${city}"
- Telefone/WhatsApp: "${phone}"
- Perfil Instagram: "${instagramHandle || 'Não informado'}"
- Avaliação no Google: "${rating ? rating + ' estrelas' : 'Boa reputação'}"

Instruções importantes:
1. As mensagens devem ser curtas, diretas, respeitosas e formatadas para WhatsApp (usando negrito com asteriscos *exemplo*, emojis com moderação).
2. Não soe como spam genérico. Cite especificamente o nicho deles e como um site próprio vai aumentar os agendamentos/vendas e passar mais credibilidade do que depender apenas de mensagens no privado.
3. Responda em formato JSON estrito com a seguinte estrutura:
{
  "option1": {
    "title": "Abordagem Direta & Amigável",
    "text": "texto da mensagem..."
  },
  "option2": {
    "title": "Foco em Perda de Vendas & Autoridade",
    "text": "texto da mensagem..."
  },
  "option3": {
    "title": "Amostra Gratuita / Demonstração sem Compromisso",
    "text": "texto da mensagem..."
  }
}
`;

  // 1. Tentar via Google Gemini (Gemini 3.6 Flash Oficial)
  if (geminiKey && geminiKey.trim() !== "") {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${geminiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              responseMimeType: "application/json",
              temperature: 0.7,
            },
          }),
        }
      );

      const data = await response.json();
      const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (rawText) {
        const parsed = JSON.parse(rawText);
        return parsed;
      }
    } catch (err) {
      console.warn("Erro no Gemini, tentando fallback:", err.message);
    }
  }

  // 2. Tentar via Groq API (Gratuito com Llama 3)
  if (groqKey && groqKey.trim() !== "") {
    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${groqKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [{ role: "user", content: prompt }],
          response_format: { type: "json_object" },
          temperature: 0.7,
        }),
      });

      const data = await response.json();
      const rawText = data?.choices?.[0]?.message?.content;
      if (rawText) {
        return JSON.parse(rawText);
      }
    } catch (err) {
      console.warn("Erro no Groq, usando gerador inteligente padrão:", err.message);
    }
  }

  // 3. Fallback Inteligente Nativo
  return generateIntelligentFallbackPitch({ companyName, niche, city, neighborhood });
}

function generateIntelligentFallbackPitch({ companyName, niche, city, neighborhood }) {
  const local = neighborhood ? `${neighborhood}, ${city}` : city;

  return {
    option1: {
      title: "Abordagem Direta & Amigável",
      text: `Olá equipe da *${companyName}*! Tudo bem?\n\nAcompanho o vosso trabalho em *${local}* e vejo que têm um excelente serviço em *${niche}*. Notei que quando as pessoas procuram por vocês no Google, ainda não encontram um site oficial para ver a tabela de serviços e horários.\n\nDesenvolvemos sites rápidos e modernos que funcionam no telemóvel e convertem visitantes diretamente em clientes no WhatsApp.\n\nPosso partilhar convosco uma prévia de 1 minuto de como ficaria o vosso site, sem qualquer compromisso?`,
    },
    option2: {
      title: "Foco em Perda de Vendas & Autoridade",
      text: `Olá! Falo com o responsável pela *${companyName}*?\n\nEstava a analisar empresas de *${niche}* em *${city}* e notei que a vossa empresa tem óptima reputação, mas os clientes que vos encontram na internet não conseguem aceder a um catálogo/site próprio para tirar dúvidas rápidas.\n\nHoje, ter um site próprio passa 3x mais autoridade e poupa o vosso tempo a responder sempre às mesmas perguntas.\n\nCriámos uma solução acessível e sob medida para o vosso setor. Gostaria de ver uma demonstração prática?`,
    },
    option3: {
      title: "Amostra Visual / Demonstração sem Compromisso",
      text: `Olá, equipe da *${companyName}*! Espero que estejam bem.\n\nSou desenvolvedor web especializado no setor de *${niche}*. Estava a desenhar um modelo de website interativo com agendamento online e botões directos para WhatsApp focado no público de *${local}*.\n\nGostaria de vos enviar um link com uma prévia exclusiva pensada para a vossa marca, para verem como ficaria no telemóvel. Têm 2 minutos para dar uma olhadela hoje?`,
    },
  };
}
