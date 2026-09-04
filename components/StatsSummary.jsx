"use client";

import React from "react";
import { Building, Target, XCircle, Globe } from "lucide-react";

export default function StatsSummary({ leads = [] }) {
  const totalLeads = leads.length;
  const noWebsiteLeads = leads.filter((l) => !l.hasWebsite).length;
  const withWebsiteLeads = leads.filter((l) => l.hasWebsite).length;
  const highConfidenceIg = leads.filter((l) => l.instagram?.confidence === "ALTA").length;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 my-4">
      {/* Total de Empresas */}
      <div className="bg-slate-800/50 border border-slate-700/60 rounded-xl p-3 flex items-center space-x-3">
        <div className="w-9 h-9 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20">
          <Building className="w-4 h-4" />
        </div>
        <div>
          <p className="text-[11px] text-slate-400 font-medium">Empresas</p>
          <p className="text-base sm:text-lg font-bold text-white">{totalLeads}</p>
        </div>
      </div>

      {/* Alvos sem Website (Oportunidades) */}
      <div className="bg-slate-800/50 border border-rose-500/20 rounded-xl p-3 flex items-center space-x-3">
        <div className="w-9 h-9 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center border border-rose-500/20">
          <XCircle className="w-4 h-4" />
        </div>
        <div>
          <p className="text-[11px] text-rose-300 font-medium">Sem Website</p>
          <p className="text-base sm:text-lg font-bold text-rose-400">{noWebsiteLeads}</p>
        </div>
      </div>

      {/* Com Website */}
      <div className="bg-slate-800/50 border border-slate-700/60 rounded-xl p-3 flex items-center space-x-3">
        <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
          <Globe className="w-4 h-4" />
        </div>
        <div>
          <p className="text-[11px] text-slate-400 font-medium">Com Site</p>
          <p className="text-base sm:text-lg font-bold text-slate-300">{withWebsiteLeads}</p>
        </div>
      </div>

      {/* Instagram 95% Match */}
      <div className="bg-slate-800/50 border border-slate-700/60 rounded-xl p-3 flex items-center space-x-3">
        <div className="w-9 h-9 rounded-lg bg-pink-500/10 text-pink-400 flex items-center justify-center border border-pink-500/20">
          <Target className="w-4 h-4" />
        </div>
        <div>
          <p className="text-[11px] text-pink-300 font-medium">Insta Verificado</p>
          <p className="text-base sm:text-lg font-bold text-pink-400">{highConfidenceIg}</p>
        </div>
      </div>
    </div>
  );
}
