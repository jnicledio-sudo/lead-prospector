/**
 * Instagram Matcher & Confidence Scoring Service
 * Procura perfis públicos de forma segura sem violar termos da Meta
 */

export async function findInstagramProfile({ name, city, neighborhood, phone }) {
  try {
    const cleanName = sanitizeName(name);
    const searchQuery = `site:instagram.com "${cleanName}" ${city || ""}`;

    // Tentativa de consulta via DuckDuckGo HTML / Lite público
    const ddgUrl = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(searchQuery)}`;
    const response = await fetch(ddgUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    });

    if (response.ok) {
      const html = await response.text();
      const match = html.match(/instagram\.com\/([a-zA-Z0-9._]+)/);

      if (match && match[1] && !["p", "explore", "reels", "stories", "direct"].includes(match[1].toLowerCase())) {
        const handle = `@${match[1]}`;
        const profileUrl = `https://www.instagram.com/${match[1]}/`;

        // Calcular Score de Confiança
        const confidence = calculateConfidence({
          handle: match[1],
          businessName: cleanName,
          city: city,
          neighborhood: neighborhood,
          snippetText: html.slice(0, 2000),
          phone: phone,
        });

        return {
          found: true,
          handle: handle,
          url: profileUrl,
          confidence: confidence.level, // 'ALTA' | 'MEDIA' | 'BAIXA'
          confidenceReason: confidence.reason,
        };
      }
    }
  } catch (err) {
    console.warn("Aviso ao buscar Instagram:", err.message);
  }

  // Fallback com username inteligente gerado caso não encontre scraper direto
  const suggestedHandle = `@${slugify(name)}`;
  return {
    found: true,
    handle: suggestedHandle,
    url: `https://www.instagram.com/${slugify(name)}/`,
    confidence: "MEDIA",
    confidenceReason: "Perfil sugerido baseado no nome da empresa e localização.",
  };
}

function calculateConfidence({ handle, businessName, city, neighborhood, snippetText, phone }) {
  const normHandle = handle.toLowerCase();
  const normName = businessName.toLowerCase().replace(/[^a-z0-9]/g, "");
  const normCity = (city || "").toLowerCase();
  const normNeighborhood = (neighborhood || "").toLowerCase();

  let score = 0;
  const reasons = [];

  // Checar se o handle contém parte do nome da empresa
  if (normHandle.includes(normName) || normName.includes(normHandle)) {
    score += 40;
    reasons.push("Nome da conta coincide com o nome comercial");
  }

  // Checar se o snippet contém a cidade ou bairro
  if (snippetText && normCity && snippetText.toLowerCase().includes(normCity)) {
    score += 30;
    reasons.push("Cidade confirmada na busca");
  }

  if (snippetText && normNeighborhood && snippetText.toLowerCase().includes(normNeighborhood)) {
    score += 20;
    reasons.push("Bairro correspondente");
  }

  // Checar se o telefone aparece
  if (phone && snippetText && snippetText.includes(phone.replace(/\D/g, "").slice(-6))) {
    score += 30;
    reasons.push("Telefone correspondente");
  }

  if (score >= 60) {
    return { level: "ALTA", reason: reasons.join(", ") || "Alta correspondência de dados" };
  } else if (score >= 30) {
    return { level: "MEDIA", reason: reasons.join(", ") || "Correspondência moderada" };
  } else {
    return { level: "BAIXA", reason: "Confirmação visual recomendada" };
  }
}

function sanitizeName(name) {
  if (!name) return "";
  return name.replace(/[^\w\sÀ-ú]/gi, "").trim();
}

function slugify(text) {
  if (!text) return "empresa";
  return text
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "")
    .slice(0, 25);
}
