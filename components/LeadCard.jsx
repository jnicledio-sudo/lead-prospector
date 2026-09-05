"use client";

import React, { useState } from "react";
import {
  Phone,
  Globe,
  MapPin,
  Star,
  ExternalLink,
  Sparkles,
  MessageCircle,
  XCircle,
  Search,
} from "lucide-react";

// Ícone limpo e padronizado do Instagram em SVG
function InstagramIcon({ className = "w-3.5 h-3.5" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

export default function LeadCard({ lead, onGeneratePitch }) {
  const [status, setStatus] = useState("NOVO");

  // Validar se o telefone é real e tem pelo menos 8 dígitos
  const cleanPhone = (lead.rawPhone || "").replace(/\D/g, "");
  const hasValidPhone = cleanPhone.length >= 8;
  const whatsappUrl = hasValidPhone ? `https://wa.me/${cleanPhone}` : null;

  // URL segura para o Instagram: se não for 100% verificado, faz busca no Google pelo perfil real
  // Isso EVITA o erro 404 de "Ocorreu um erro" no app do Instagram
  const safeInstagramUrl =
    lead.instagram?.url && lead.instagram?.confidence === "VERIFICADO"
      ? lead.instagram.url
      : `https://www.google.com/search?q=${encodeURIComponent(`site:instagram.com "${lead.name}" ${lead.city}`)}`;

  const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(`"${lead.name}" ${lead.city} telefone contacto`)}`;

  return (
    <div className="bg-slate-800/60 border border-slate-700/70 rounded-2xl p-4 sm:p-5 hover:border-slate-600 transition-all flex flex-col justify-between shadow-lg relative overflow-hidden group">
      {/* Top Banner Oportunidade */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h3 className="font-bold text-base text-white group-hover:text-emerald-400 transition-colors">
              {lead.name}
            </h3>
            {lead.rating > 0 && (
              <span className="flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Star className="w-3 h-3 fill-amber-400" />
                {lead.rating} ({lead.reviewsCount || 0})
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 flex items-center gap-1.5 line-clamp-1">
            <MapPin className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
            {lead.address}
          </p>
        </div>

        {/* Status Tag de Website */}
        <div>
          {!lead.hasWebsite ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-rose-500/15 text-rose-400 border border-rose-500/30 animate-pulse">
              <XCircle className="w-3 h-3" />
              SEM SITE
            </span>
          ) : (
            <a
              href={lead.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-full bg-slate-700/50 text-slate-300 border border-slate-600 hover:bg-slate-700 transition"
            >
              <Globe className="w-3 h-3 text-emerald-400" />
              Ver Site
              <ExternalLink className="w-2.5 h-2.5" />
            </a>
          )}
        </div>
      </div>

      {/* Detalhes de Contacto e Instagram */}
      <div className="bg-slate-900/60 rounded-xl p-3 my-2 space-y-2 border border-slate-800/80">
        {/* Telefone */}
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-400 flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5 text-emerald-400" />
            Contacto:
          </span>
          {hasValidPhone ? (
            <span className="font-semibold text-slate-200">{lead.phone}</span>
          ) : (
            <a
              href={googleSearchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-emerald-300 underline flex items-center gap-1 text-[11px]"
            >
              Localizar no Google
              <ExternalLink className="w-2.5 h-2.5" />
            </a>
          )}
        </div>

        {/* Instagram Seguro */}
        <div className="flex items-center justify-between text-xs pt-1.5 border-t border-slate-800">
          <span className="text-slate-400 flex items-center gap-1.5">
            <InstagramIcon className="w-3.5 h-3.5 text-pink-400" />
            Instagram:
          </span>
          <div className="flex items-center gap-2">
            <a
              href={safeInstagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-pink-400 hover:text-pink-300 font-medium underline flex items-center gap-1"
            >
              <span>Ver Perfil</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Barra de Status & Ações Rápidas */}
      <div className="pt-3 flex flex-col gap-2">
        {/* Seletor de Estado do Funil */}
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-slate-400">Status do Lead:</span>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-xs text-slate-200 rounded-lg px-2 py-1 focus:outline-none focus:border-emerald-500 cursor-pointer"
          >
            <option value="NOVO">⚪ Novo</option>
            <option value="CONTACTADO">🟡 Contactado</option>
            <option value="NEGOCIANDO">🔵 Em Negociação</option>
            <option value="FECHADO">🟢 Proposta Fechada!</option>
          </select>
        </div>

        {/* Botões de Ação */}
        <div className="grid grid-cols-2 gap-2 mt-1">
          {/* Botão de IA Pitch */}
          <button
            onClick={() => onGeneratePitch(lead)}
            className="flex items-center justify-center gap-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold py-2.5 px-3 rounded-xl shadow transition active:scale-95 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Gerar Pitch IA
          </button>

          {/* Botão WhatsApp ou Busca de Contacto */}
          {whatsappUrl ? (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/30 text-xs font-bold py-2.5 px-3 rounded-xl transition active:scale-95"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              WhatsApp
            </a>
          ) : (
            <a
              href={googleSearchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 bg-slate-700/50 hover:bg-slate-700 text-slate-300 text-xs font-semibold py-2.5 px-3 rounded-xl transition"
            >
              <Search className="w-3.5 h-3.5" />
              Buscar Contacto
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
