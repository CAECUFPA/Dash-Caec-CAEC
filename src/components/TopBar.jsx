import React from 'react';
import { Database, Activity, Cpu, Wifi } from 'lucide-react';

/**
 * TopBar: Versão DashBoard Financeiro CAEC
 * Polimento Extremo: Efeitos de brilho, tipografia high-density e telemetria viva.
 */
export default function TopBar({ recordCount, lastSyncTime }) {
  return (
    <header className="
      sticky top-0 z-40
      flex flex-col md:flex-row items-start md:items-center justify-between
      border-b border-white/[0.05]
      bg-[#030712]/80 backdrop-blur-2xl
      px-6 py-6 lg:px-12 lg:py-8
      transition-all duration-300
      gap-6 md:gap-0
      shadow-[0_4px_30px_rgba(0,0,0,0.5)]
    ">
      {/* SEÇÃO ESQUERDA: Identificação e Status de Rede */}
      <div className="flex flex-col gap-5 w-full md:w-auto">
        <div className="flex items-center gap-5">
          <div className="relative group">
            <div className="absolute -inset-1 bg-atena-yellow/20 rounded-xl blur-md group-hover:opacity-100 transition duration-1000"></div>
            <div className="relative bg-[#0a0f1a] p-2.5 rounded-xl border border-atena-yellow/40 shadow-[inset_0_0_10px_rgba(251,191,36,0.1)]">
              <Cpu size={22} className="text-atena-yellow animate-[pulse_3s_infinite]" />
            </div>
          </div>

          <div className="flex flex-col">
            <h2 className="text-2xl font-black uppercase tracking-[-0.05em] text-white sm:text-3xl lg:text-4xl leading-none">
              DASHBOARD <span className="text-atena-yellow/90">FINANCEIRO</span>
            </h2>
            <p className="text-[8px] font-black text-slate-500 uppercase tracking-[0.6em] mt-1.5 ml-0.5">
              CAEC • Admin Control Panel
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 md:gap-8 ml-0.5">
          {/* BADGE STATUS: API ENCRYPTED */}
          <div className="
            flex items-center gap-2.5
            rounded-full px-4 py-1.5
            bg-emerald-500/5 border border-emerald-500/20
            shadow-[0_0_15px_rgba(16,185,129,0.05)]
          ">
            <Wifi size={10} className="text-emerald-500" />
            <span className="text-[9px] font-black uppercase tracking-[0.25em] text-emerald-500/80">
              CAEC API ATIVA
            </span>
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse" />
          </div>

          {/* CONTADOR DE REGISTROS (ESTILO ANALÍTICO) */}
          <div className="flex items-center gap-3 h-4">
            <Database size={13} className="text-slate-600" />
            <div className="flex items-baseline gap-2">
              <span className="text-white font-mono text-sm font-black leading-none">{recordCount}</span>
              <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-slate-500">Datasets Detectados</span>
            </div>
          </div>
        </div>
      </div>

      {/* SEÇÃO DIREITA: Módulo de Telemetria e Tempo Real */}
      <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto gap-4 md:gap-3">
        <div className="flex items-center gap-2.5 px-2">
          <Activity size={12} className="text-atena-yellow/70" />
          <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-500">
            Última Sincronização
          </p>
        </div>

        <div className="flex items-center gap-4">
          {/* DISPLAY DE HORA ESTILO RACK SERVER */}
          <div className="
            bg-black/60 border border-white/[0.08]
            px-5 py-2.5 rounded-2xl
            shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)]
            group hover:border-atena-yellow/30 transition-colors
          ">
            <p className="
              font-mono text-lg md:text-xl font-black tabular-nums
              text-atena-yellow tracking-[0.15em] drop-shadow-[0_0_10px_rgba(251,191,36,0.3)]
            ">
              {lastSyncTime}
            </p>
          </div>

          {/* STATUS INDICATOR */}
          <div className="flex flex-col items-end border-l-2 border-white/5 pl-5 gap-1">
            <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Protocol</span>
            <div className="flex items-center gap-1.5">
              <span className="text-[9px] font-black text-emerald-500 uppercase italic tracking-[0.2em] brightness-125">Live</span>
              <div className="w-1 h-3 bg-emerald-500/20 rounded-full overflow-hidden">
                <div className="w-full h-full bg-emerald-500 animate-[bounce_1.5s_infinite]" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* LINHA DE LUZ INFRAVERMELHA/TECNOLÓGICA */}
      <div className="absolute bottom-0 left-0 h-[1.5px] w-full bg-gradient-to-r from-transparent via-atena-yellow/40 to-transparent opacity-20" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[1px] w-1/3 bg-atena-yellow shadow-[0_0_15px_#fbbf24] opacity-40" />
    </header>
  );
}
