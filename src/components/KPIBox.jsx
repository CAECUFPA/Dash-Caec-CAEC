import React, { memo } from 'react';

/**
 * KPIBox: Edição Industrial CAEC (IDG) - Versão Final Animada
 * Inclui animações de escala, hover de alta definição e cores sincronizadas.
 */
export const KPIBox = memo(({
  label,
  val,
  icon: Icon,
  type = 'liquidez', // entrada, saida, liquidez
  border
}) => {
  const displayValue = Math.abs(val);

  // MAPEAMENTO ESTRITO DE CORES IDG
  const configs = {
    entrada: {
      text: 'text-emerald-400',
      dot: 'bg-emerald-400 shadow-emerald-500/50',
      bar: 'bg-emerald-500',
      symbol: '+'
    },
    saida: {
      text: 'text-rose-500',
      dot: 'bg-rose-500 shadow-rose-500/50',
      bar: 'bg-rose-500',
      symbol: '−'
    },
    liquidez: {
      text: 'text-blue-500',
      dot: 'bg-blue-500 shadow-blue-500/50',
      bar: 'bg-atena-yellow',
      symbol: val < 0 ? '−' : '+'
    }
  };

  const style = configs[type] || configs.liquidez;

  return (
    <div className={`
      group p-8
      rounded-[2rem]
      bg-[#0a0f1a]
      border ${border || 'border-white/5'}
      relative overflow-hidden
      transition-all duration-500
      hover:border-white/10 hover:bg-[#0f172a]
      hover:shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)]
      font-mono
    `}>

      {/* Grid de Engenharia (Estética Radar) */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:24px_24px]" />

      {/* ÍCONE COM HOVER CARACTERÍSTICO: Cresce e rotaciona levemente */}
      <Icon className={`
        absolute -right-4 -bottom-4 w-28 h-28 ${style.text}
        opacity-[0.03] group-hover:opacity-[0.08]
        group-hover:scale-110 group-hover:-rotate-12
        transition-all duration-1000 ease-out
      `} />

      {/* Header: Label + Telemetria de Pulso */}
      <div className="flex items-center justify-between mb-8 relative z-10">
        <div className="flex items-center gap-3">
          {/* O ponto pulsa para indicar que o sistema está "vivo" */}
          <div className={`w-2 h-2 rounded-full ${style.dot} shadow-[0_0_12px] shadow-current animate-pulse`} />
          <p className={`text-[10px] font-black uppercase tracking-[0.4em] ${style.text} brightness-125`}>
            {label.replace(/\(IN\)|\(OUT\)/gi, '')}
          </p>
        </div>
      </div>

      {/* Valor Principal: Tipografia de Alta Densidade */}
      <div className="relative z-10 flex flex-col">
        <div className="flex items-baseline gap-2">
          <span className={`text-lg font-bold opacity-20 ${style.text}`}>
            BRL
          </span>
          <h3 className={`
            text-4xl lg:text-5xl font-black tracking-tighter tabular-nums
            ${style.text} brightness-110
            group-hover:brightness-150 transition-all duration-500
          `}>
            {style.symbol}
            {displayValue.toLocaleString('pt-BR', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })}
          </h3>
        </div>
      </div>

      {/* Rodapé Técnico com Hover de Real-Time */}
      <div className="mt-8 flex justify-between items-end border-t border-white/[0.05] pt-5 relative z-10">
        <div className="flex flex-col gap-1">
          <span className="text-[7px] text-slate-500 uppercase tracking-[0.2em] font-black opacity-50">Operational Status</span>
          <div className="flex items-center gap-2">
            <div className="w-1 h-1 rounded-full bg-emerald-500 group-hover:animate-ping" />
            <span className="text-[9px] text-white/60 font-bold uppercase tracking-wider">Sistema Ativo</span>
          </div>
        </div>

        <div className="text-right flex flex-col items-end gap-1">
          <span className="text-[7px] text-slate-500 uppercase font-black opacity-50">Data Sync</span>
          <span className="text-[9px] text-atena-yellow/60 font-bold uppercase tracking-tighter group-hover:text-atena-yellow group-hover:opacity-100 transition-all">Real-Time</span>
        </div>
      </div>

      {/* FRISO SUPERIOR: A assinatura visual que se expande no hover */}
      <div className={`
        absolute top-0 left-0 h-[3px]
        transition-all duration-700 ease-in-out
        group-hover:w-full w-12
        ${style.bar} shadow-[0_0_15px_-2px] shadow-current
      `} />
    </div>
  );
});

KPIBox.displayName = 'KPIBox';
