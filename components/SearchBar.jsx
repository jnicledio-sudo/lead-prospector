"use client";

import React, { useState } from "react";
import { Search, MapPin, Building2, Filter, Loader2, Globe } from "lucide-react";

const POPULAR_NICHES = [
  "Barbearias",
  "Clínicas Dentárias",
  "Restaurantes",
  "Oficinas Mecânicas",
  "Salões de Beleza",
  "Imobiliárias",
  "Academias",
  "Pet Shops",
];

const COUNTRIES = [
  { code: "MZ", name: "Moçambique", flag: "🇲🇿" },
  { code: "AO", name: "Angola", flag: "🇦🇴" },
  { code: "PT", name: "Portugal", flag: "🇵🇹" },
  { code: "BR", name: "Brasil", flag: "🇧🇷" },
  { code: "OTHER", name: "Outro País", flag: "🌍" },
];

export default function SearchBar({ onSearch, isLoading }) {
  const [niche, setNiche] = useState("");
  const [country, setCountry] = useState("Moçambique");
  const [city, setCity] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [onlyWithoutWebsite, setOnlyWithoutWebsite] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!niche.trim() || !city.trim()) {
      alert("Por favor, preencha pelo menos o Nicho e a Cidade.");
      return;
    }
    onSearch({ niche, country, city, neighborhood, onlyWithoutWebsite });
  };

  const handleQuickNiche = (selectedNiche) => {
    setNiche(selectedNiche);
  };

  return (
    <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-4 sm:p-6 shadow-xl backdrop-blur-sm">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Campo de Nicho */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-emerald-400" />
              Nicho / Ramo
            </label>
            <input
              type="text"
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
              placeholder="Ex: Barbearias, Clínicas..."
              className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
              required
            />
          </div>

          {/* Campo de País */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-emerald-400" />
              País
            </label>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all cursor-pointer"
            >
              {COUNTRIES.map((c) => (
                <option key={c.code} value={c.name}>
                  {c.flag} {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Campo de Cidade */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              Cidade
            </label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Ex: Maputo, Luanda, Lisboa..."
              className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
              required
            />
          </div>

          {/* Campo de Bairro */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-emerald-400" />
              Bairro / Região (Opcional)
            </label>
            <input
              type="text"
              value={neighborhood}
              onChange={(e) => setNeighborhood(e.target.value)}
              placeholder="Ex: Boane, Polana, Talatona..."
              className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
            />
          </div>
        </div>

        {/* Tags de nichos populares rápidos */}
        <div>
          <span className="text-[11px] font-medium text-slate-400 mr-2">Sugestões rápidas:</span>
          <div className="flex flex-wrap gap-1.5 mt-1.5">
            {POPULAR_NICHES.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => handleQuickNiche(item)}
                className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${
                  niche === item
                    ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/50"
                    : "bg-slate-900/50 text-slate-400 border-slate-700/50 hover:border-slate-600 hover:text-slate-200"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* Filtro e Botão de Ação */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2 border-t border-slate-700/40">
          <label className="flex items-center space-x-2.5 cursor-pointer select-none bg-slate-900/50 px-3 py-2 rounded-xl border border-slate-700/40 hover:border-slate-600 transition">
            <input
              type="checkbox"
              checked={onlyWithoutWebsite}
              onChange={(e) => setOnlyWithoutWebsite(e.target.checked)}
              className="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-500 focus:ring-offset-slate-900 bg-slate-800 border-slate-600"
            />
            <span className="text-xs font-medium text-emerald-400">
              🎯 Filtrar apenas empresas SEM website (Oportunidades)
            </span>
          </label>

          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center justify-center space-x-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold px-6 py-3 rounded-xl shadow-lg shadow-emerald-500/20 active:scale-[0.98] transition disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Buscando Empresas Reais...</span>
              </>
            ) : (
              <>
                <Search className="w-4 h-4 font-bold" />
                <span>Localizar Clientes</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
