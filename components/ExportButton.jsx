"use client";

import React from "react";
import { Download } from "lucide-react";

export default function ExportButton({ leads = [] }) {
  const handleExportCSV = () => {
    if (!leads.length) return;

    // Cabeçalhos CSV
    const headers = [
      "Nome da Empresa",
      "Nicho",
      "Cidade",
      "Bairro",
      "Telefone",
      "Possui Website",
      "Link Website",
      "Instagram",
      "Confiança Instagram",
      "Avaliação Google",
      "Endereço",
    ];

    // Linhas de dados
    const rows = leads.map((lead) => [
      `"${(lead.name || "").replace(/"/g, '""')}"`,
      `"${(lead.niche || "").replace(/"/g, '""')}"`,
      `"${(lead.city || "").replace(/"/g, '""')}"`,
      `"${(lead.neighborhood || "").replace(/"/g, '""')}"`,
      `"${(lead.phone || "").replace(/"/g, '""')}"`,
      lead.hasWebsite ? "Sim" : "Não",
      `"${(lead.website || "").replace(/"/g, '""')}"`,
      `"${(lead.instagram?.handle || "").replace(/"/g, '""')}"`,
      `"${(lead.instagram?.confidence || "").replace(/"/g, '""')}"`,
      lead.rating || 0,
      `"${(lead.address || "").replace(/"/g, '""')}"`,
    ]);

    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `leads_prospeccao_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <button
      onClick={handleExportCSV}
      disabled={!leads.length}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-750 text-slate-300 hover:text-white text-xs font-semibold transition disabled:opacity-40 disabled:cursor-not-allowed"
    >
      <Download className="w-3.5 h-3.5" />
      <span>Exportar CSV</span>
    </button>
  );
}
