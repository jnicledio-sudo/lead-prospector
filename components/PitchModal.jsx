"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Sparkles,
  Copy,
  Check,
  MessageCircle,
  Loader2,
  RefreshCw,
  Lightbulb,
} from "lucide-react";

export default function PitchModal({ isOpen, onClose, lead }) {
  const [pitches, setPitches] = useState(null);
  const [activeTab, setActiveTab] = useState("option1");
  const [editedText, setEditedText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen && lead) {
      fetchPitch();
    }
  }, [isOpen, lead]);

  const fetchPitch = async () => {
    setIsLoading(true);
    setPitches(null);
    try {
      const res = await fetch("/api/pitch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName: lead.name,
          niche: lead.niche,
          city: lead.city,
          neighborhood: lead.neighborhood,
          phone: lead.phone,
          instagramHandle: lead.instagram?.handle,
          rating: lead.rating,
        }),
      });
      const data = await res.json();
      if (data.success && data.pitches) {
        setPitches(data.pitches);
        setEditedText(data.pitches.option1?.text || "");
        setActiveTab("option1");
      }
    } catch (err) {
      console.error("Erro ao gerar pitch:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTabChange = (tabKey) => {
    setActiveTab(tabKey);
    if (pitches && pitches[tabKey]) {
      setEditedText(pitches[tabKey].text);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(editedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen || !lead) return null;

  const cleanPhone = lead.rawPhone || lead.phone.replace(/\D/g, "");
  const whatsappUrl = cleanPhone
    ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(editedText)}`
    : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Cabeçalho do Modal */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-800/50">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-white">
                Proposta Personalizada com IA
              </h3>
              <p className="text-xs text-slate-400">
                Alvo: <span className="text-emerald-400 font-medium">{lead.name}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Conteúdo do Modal */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
          {isLoading ? (
            <div className="py-12 flex flex-col items-center justify-center space-y-3 text-center">
              <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
              <div className="space-y-1">
                <p className="text-sm font-semibold text-white">
                  Analisando o negócio e criando abordagens...
                </p>
                <p className="text-xs text-slate-400">
                  Cruzando nicho ({lead.niche}), localização e falta de website
                </p>
              </div>
            </div>
          ) : pitches ? (
            <>
              {/* Abas de Abordagens */}
              <div className="grid grid-cols-3 gap-1.5 bg-slate-950/60 p-1.5 rounded-xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => handleTabChange("option1")}
                  className={`text-xs py-2 px-2 rounded-lg font-medium transition text-center line-clamp-1 ${
                    activeTab === "option1"
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  1. Amigável
                </button>
                <button
                  type="button"
                  onClick={() => handleTabChange("option2")}
                  className={`text-xs py-2 px-2 rounded-lg font-medium transition text-center line-clamp-1 ${
                    activeTab === "option2"
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  2. Autoridade
                </button>
                <button
                  type="button"
                  onClick={() => handleTabChange("option3")}
                  className={`text-xs py-2 px-2 rounded-lg font-medium transition text-center line-clamp-1 ${
                    activeTab === "option3"
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  3. Amostra Grátis
                </button>
              </div>

              {/* Título da Abordagem Ativa */}
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span className="font-semibold flex items-center gap-1.5 text-emerald-400">
                  <Lightbulb className="w-3.5 h-3.5" />
                  {pitches[activeTab]?.title || "Abordagem Selecionada"}
                </span>
                <button
                  onClick={fetchPitch}
                  className="text-slate-400 hover:text-slate-200 flex items-center gap-1 text-[11px]"
                >
                  <RefreshCw className="w-3 h-3" />
                  Regerar
                </button>
              </div>

              {/* Editor de Mensagem WhatsApp */}
              <div className="relative">
                <textarea
                  value={editedText}
                  onChange={(e) => setEditedText(e.target.value)}
                  rows={8}
                  className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl p-3.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-mono leading-relaxed"
                  placeholder="Texto da mensagem de abordagem..."
                />
              </div>

              <div className="bg-emerald-950/20 border border-emerald-800/30 rounded-xl p-3 text-[11px] text-emerald-300 flex items-start gap-2">
                <span className="text-base">💡</span>
                <span>
                  Você pode editar o texto livremente acima antes de enviar. O link do WhatsApp já levará a mensagem digitada!
                </span>
              </div>
            </>
          ) : (
            <div className="py-8 text-center text-slate-400 text-xs">
              Não foi possível gerar a proposta. Clique em tentar novamente.
              <button
                onClick={fetchPitch}
                className="mt-3 block mx-auto text-emerald-400 font-bold underline"
              >
                Tentar novamente
              </button>
            </div>
          )}
        </div>

        {/* Rodapé do Modal com Ações */}
        {pitches && (
          <div className="p-4 border-t border-slate-800 bg-slate-850 flex items-center justify-end gap-2.5">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copiar</span>
                </>
              )}
            </button>

            {whatsappUrl ? (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 text-xs font-bold px-5 py-2.5 rounded-xl shadow-lg shadow-emerald-500/20 transition active:scale-95"
              >
                <MessageCircle className="w-4 h-4 font-bold" />
                <span>Abrir no WhatsApp</span>
              </a>
            ) : (
              <button
                disabled
                className="opacity-50 cursor-not-allowed bg-slate-800 text-slate-400 text-xs px-4 py-2.5 rounded-xl"
              >
                Telefone Indisponível
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
