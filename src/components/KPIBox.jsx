import React, { memo } from 'react';

/**
 * KPIBox: Edição Industrial CAEC (IDG) - Versão Otimizada e Responsiva
 */
export const KPIBox = memo(({
  label,
  val,
  icon: Icon,
  type = 'liquidez', // entrada, saida, liquidez
  border
}) => {
  const displayValue = Math.abs(val);

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
      group relative overflow-hidden
      p-4 sm:p-6 lg:p-8
      rounded-[1.5rem] sm:rounded-[2rem]
      bg-[#0a0f1a]
      border ${border || 'border-white/5'}
      transition-all duration-500
      hover:border-white/10 hover:bg-[#0f172a]
      hover:shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)]
      font-mono w-full
    `}>

      {/* Grid de Engenharia */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:20px_20px]" />

      {/* Ícone de Fundo Responsivo */}
      <Icon className={`
        absolute -right-4 -bottom-4
        w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28
        ${style.text}
        opacity-[0.03] group-hover:opacity-[0.08]
        group-hover:scale-110 group-hover:-rotate-12
        transition-all duration-1000 ease-out
      `} />

      {/* Header: Label + Pulso */}
      <div className="flex items-center justify-between mb-4 sm:mb-6 lg:mb-8 relative z-10">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${style.dot} shadow-[0_0_12px] shadow-current animate-pulse`} />
          <p className={`text-[8px] sm:text-[10px] font-black uppercase tracking-[0.2em] sm:tracking-[0.4em] ${style.text} brightness-125 truncate`}>
            {label.replace(/\(IN\)|\(OUT\)/gi, '')}
          </p>
        </div>
      </div>

      {/* Valor Principal: Ajustado para não quebrar ou vazar */}
      <div className="relative z-10 flex flex-col">
        <div className="flex items-baseline gap-1 sm:gap-2 flex-wrap">
          <span className={`text-xs sm:text-sm lg:text-lg font-bold opacity-20 ${style.text}`}>
            BRL
          </span>
          <h3 className={`
            text-2xl sm:text-3xl lg:text-4xl xl:text-5xl
            font-black tracking-tighter tabular-nums
            ${style.text} brightness-110
            group-hover:brightness-150 transition-all duration-500
            break-all sm:break-normal
          `}>
            {style.symbol}
            {displayValue.toLocaleString('pt-BR', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })}
          </h3>
        </div>
      </div>

      {/* Rodapé Técnico */}
      <div className="mt-4 sm:mt-6 lg:mt-8 flex justify-between items-end border-t border-white/[0.05] pt-4 sm:pt-5 relative z-10">
        <div className="flex flex-col gap-0.5 sm:gap-1">
          <span className="text-[6px] sm:text-[7px] text-slate-500 uppercase tracking-[0.1em] font-black opacity-50">Operational Status</span>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="w-1 h-1 rounded-full bg-emerald-500 group-hover:animate-ping" />
            <span className="text-[8px] sm:text-[9px] text-white/60 font-bold uppercase tracking-wider">Ativo</span>
          </div>
        </div>

        <div className="text-right flex flex-col items-end gap-0.5 sm:gap-1">
          <span className="text-[6px] sm:text-[7px] text-slate-500 uppercase font-black opacity-50">Data Sync</span>
          <span className="text-[8px] sm:text-[9px] text-atena-yellow/60 font-bold uppercase tracking-tighter group-hover:text-atena-yellow transition-all">Real-Time</span>
        </div>
      </div>

      {/* Friso Superior Dinâmico */}
      <div className={`
        absolute top-0 left-0 h-[2px] sm:h-[3px]
        transition-all duration-700 ease-in-out
        group-hover:w-full w-8 sm:w-12
        ${style.bar} shadow-[0_0_15px_-2px] shadow-current
      `} />
    </div>
  );
});

KPIBox.displayName = 'KPIBox';
