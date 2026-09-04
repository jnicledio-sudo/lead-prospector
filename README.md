# 🚀 LeadProspector (Edição 2026)

**Plataforma Inteligente de Prospecção de Empresas Locais sem Website**  
Desenvolvida com Next.js (App Router), Tailwind CSS e APIs de IA gratuitas. Projetada especificamente para **desenvolvedores e agências que vendem criação de websites e páginas de vendas para negócios locais.**

---

## 📱 Recursos Principais

1. **🔍 Busca Inteligente por Nicho, Cidade e Bairro:**
   * Localiza comércios, clínicas, barbearias, oficinas, restaurantes e prestadores de serviços.
2. **🎯 Filtro de Oportunidades (Sem Website):**
   * Destaca em vermelho as empresas que ainda não possuem site próprio.
3. **📸 Cruzamento Seguro com Instagram Público:**
   * Identifica o perfil social da empresa com **Score de Confiança (Alta / Média)** sem violar nenhuma política da Meta.
4. **🤖 Gerador de Propostas com IA (WhatsApp Pitch):**
   * Cria instantaneamente 3 estilos de abordagens comerciais persuasivas e personalizadas com base no ramo da empresa.
5. **📲 Disparo em 1 Toque para WhatsApp:**
   * Abre a conversa com a mensagem formatada pronta para envio (100% seguro contra banimentos).
6. **📊 Exportação de Leads:**
   * Exporte a lista completa de oportunidades filtradas para planilha **CSV / Excel**.

---

## 🛠️ Como Rodar Localmente

1. Entre na pasta do projeto:
```bash
cd lead-prospector
```

2. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

3. Abra no navegador:
```
http://localhost:3000
```

*(No celular conectado à mesma rede Wi-Fi, acesse pelo seu IP local, ex: `http://192.168.x.x:3000`)*.

---

## 🌐 Como Hospedar Gratuitamente na Vercel

1. Suba esta pasta para um repositório no seu **GitHub**.
2. Acesse [vercel.com](https://vercel.com) e clique em **"Add New Project"**.
3. Selecione o repositório do GitHub.
4. No campo **Environment Variables** (opcional, caso queira dados em tempo real do Google e Gemini):
   * `GOOGLE_PLACES_API_KEY`: Sua chave do Google Cloud (com \$200 mensais grátis).
   * `GEMINI_API_KEY`: Sua chave gratuita do Google AI Studio ([aistudio.google.com](https://aistudio.google.com/)).
5. Clique em **Deploy**.
6. Pronto! A sua aplicação estará no ar com link seguro `https://seu-projeto.vercel.app` para acessar do celular onde estiver.

---

## 🔑 Onde Conseguir as Chaves Gratuitas (Opcional)

* **Google Gemini AI (100% Gratuito):** [https://aistudio.google.com/](https://aistudio.google.com/) -> Criar API Key.
* **Google Maps / Places (\$200/mês Grátis):** [https://console.cloud.google.com/](https://console.cloud.google.com/) -> Ativar Places API.
* **Groq API (Opcional - Grátis com Llama 3):** [https://console.groq.com/](https://console.groq.com/)

> **Nota:** Se você não configurar nenhuma chave, a aplicação continuará funcionando perfeitamente com os algoritmos inteligentes nativos e dados estruturados!
