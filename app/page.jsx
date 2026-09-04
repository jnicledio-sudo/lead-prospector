"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import SearchBar from "@/components/SearchBar";
import LeadCard from "@/components/LeadCard";
import PitchModal from "@/components/PitchModal";
import StatsSummary from "@/components/StatsSummary";
import ExportButton from "@/components/ExportButton";
import { Sparkles, MapPin, Target, Layers, HelpCircle, ShieldCheck } from "lucide-react";

export default function HomePage() {
  const [leads, setLeads] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLeadForPitch, setSelectedLeadForPitch] = useState(null);
  const [filterType, setFilterType] = useState("ALL"); // ALL, NO_WEBSITE, WITH_INSTA
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async ({ niche, city, neighborhood, onlyWithoutWebsite }) => {
    setIsLoading(true);
    setHasSearched(true);
    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ niche, city, neighborhood, onlyWithoutWebsite }),
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.leads)) {
        setLeads(data.leads);
      } else {
        alert(data.error || "Erro ao buscar empresas.");
      }
    } catch (err) {
      console.error("Erro na busca:", err);
      alert("Falha na comunicação com o servidor.");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredLeads = leads.filter((lead) => {
    if (filterType === "NO_WEBSITE") return !lead.hasWebsite;
    if (filterType === "WITH_INSTA") return lead.instagram && lead.instagram.found;
    return true;
  });

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-3 sm:px-4 py-6 space-y-6">
        {/* Hero Section */}
        <div className="text-center space-y-2.5 max-w-2xl mx-auto pt-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Prospecção Inteligente de Websites</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Descubra empresas que <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">precisam de um site</span> hoje
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Filtre por nicho, cidade e bairro. Cruze com dados do Instagram e gere propostas prontas para o WhatsApp com Inteligência Artificial.
          </p>
        </div>

        {/* Formulário de Busca */}
        <SearchBar onSearch={handleSearch} isLoading={isLoading} />

        {/* Estatísticas e Resultados */}
        {hasSearched && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <StatsSummary leads={leads} />

            {/* Barra de Filtros e Exportação */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                <button
                  onClick={() => setFilterType("ALL")}
                  className={`text-xs px-3 py-1.5 rounded-xl font-medium transition ${
                    filterType === "ALL"
                      ? "bg-slate-800 text-white border border-slate-600"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  Todos ({leads.length})
                </button>
                <button
                  onClick={() => setFilterType("NO_WEBSITE")}
                  className={`text-xs px-3 py-1.5 rounded-xl font-medium transition ${
                    filterType === "NO_WEBSITE"
                      ? "bg-rose-500/20 text-rose-300 border border-rose-500/40"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  🎯 Apenas Sem Site ({leads.filter((l) => !l.hasWebsite).length})
                </button>
                <button
                  onClick={() => setFilterType("WITH_INSTA")}
                  className={`text-xs px-3 py-1.5 rounded-xl font-medium transition ${
                    filterType === "WITH_INSTA"
                      ? "bg-pink-500/20 text-pink-300 border border-pink-500/40"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  📸 Com Instagram ({leads.filter((l) => l.instagram?.found).length})
                </button>
              </div>

              <ExportButton leads={filteredLeads} />
            </div>

            {/* Grid de Leads */}
            {filteredLeads.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4 pt-1">
                {filteredLeads.map((lead) => (
                  <LeadCard
                    key={lead.id}
                    lead={lead}
                    onGeneratePitch={(l) => setSelectedLeadForPitch(l)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-slate-900/40 border border-slate-800 rounded-2xl p-6">
                <Target className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                <h4 className="text-sm font-semibold text-slate-300">Nenhum resultado com o filtro selecionado</h4>
                <p className="text-xs text-slate-500 mt-1">Tente alternar o filtro ou pesquisar outro bairro/nicho.</p>
              </div>
            )}
          </div>
        )}

        {/* Guia Rápido de Uso Inicial */}
        {!hasSearched && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-4">
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-sm">
                1
              </div>
              <h4 className="font-bold text-sm text-white">1. Encontre os Alvos</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Digite um nicho comercial e a sua cidade. O sistema localiza as empresas e detecta quais não possuem site próprio.
              </p>
            </div>

            <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-pink-500/10 text-pink-400 flex items-center justify-center font-bold text-sm">
                2
              </div>
              <h4 className="font-bold text-sm text-white">2. Contexto do Instagram</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                O cruzamento de dados busca o perfil público com índice de confiança para entender a identidade visual e serviços do cliente.
              </p>
            </div>

            <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-400 flex items-center justify-center font-bold text-sm">
                3
              </div>
              <h4 className="font-bold text-sm text-white">3. Pitch com IA no WhatsApp</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                A IA gera 3 opções de abordagens de alta conversão. Em 1 toque, o seu WhatsApp abre com o texto pronto para enviar.
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Modal de Pitch IA */}
      <PitchModal
        isOpen={!!selectedLeadForPitch}
        lead={selectedLeadForPitch}
        onClose={() => setSelectedLeadForPitch(null)}
      />

      {/* Rodapé */}
      <footer className="border-t border-slate-800/80 py-4 text-center text-xs text-slate-500">
        <p>LeadProspector 2026 • Otimizado para Mobile & Hospedagem Gratuita na Vercel</p>
      </footer>
    </div>
  );
}
