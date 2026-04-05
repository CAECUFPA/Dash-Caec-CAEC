import React, { memo } from 'react';
import { ChevronLeft, ChevronRight, Layers, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { formatDateBR, formatCurrency } from '../utils/dataHandlers';

const sanitizeName = (str) => {
  if (!str) return "";
  return str.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
};

const TableRow = memo(({ item }) => {
  const isReceita = item.tipo === 'RECEITA';
  const safeDate = item.dateRaw ? new Date(item.dateRaw) : new Date();

  return (
    <tr className="group border-b border-white/5 last:border-0 font-mono transition-colors hover:bg-white/[0.02]">
      {/* Detalhe lateral de acionamento */}
      <td className="w-1 p-0 relative hidden sm:table-cell">
        <div className={`absolute inset-y-3 left-0 w-[2px] ${isReceita ? 'bg-emerald-500' : 'bg-rose-500'} scale-y-0 group-hover:scale-y-100 transition-transform duration-300 shadow-[0_0_8px_rgba(255,255,255,0.2)]`} />
      </td>

      <td className="px-4 sm:px-6 py-4 text-[10px] sm:text-[11px] text-slate-400 whitespace-nowrap">
        {formatDateBR(safeDate)}
      </td>

      <td className="px-4 sm:px-6 py-4">
        <div className="flex items-center gap-2">
          {/* Indicador de Status Industrial */}
          <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${isReceita ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-rose-500 shadow-[0_0_8px_#f43f5e]'}`} />
          <span className="text-[9px] sm:text-[10px] font-black text-atena-yellow uppercase tracking-wider truncate max-w-[80px] sm:max-w-none">
            {sanitizeName(item.categoria)}
          </span>
        </div>
      </td>

      <td className="hidden md:table-cell px-6 py-4 text-[11px] text-slate-500 max-w-xs lg:max-w-md truncate font-sans group-hover:text-slate-300 transition-colors">
        {item.observacao && item.observacao !== 'N/D' ? (
          item.observacao
        ) : (
          <span className="text-slate-700 italic text-[10px] opacity-40 uppercase tracking-tighter">Telemetria sem log</span>
        )}
      </td>

      <td className={`px-4 sm:px-8 py-4 text-right font-bold text-xs sm:text-sm tabular-nums whitespace-nowrap ${isReceita ? 'text-emerald-400' : 'text-rose-500'}`}>
        <div className="flex items-center justify-end gap-2 sm:gap-4">
          <span className="hidden xs:inline text-[7px] opacity-30 font-black uppercase tracking-[0.2em]">
            {isReceita ? 'Credit' : 'Debit'}
          </span>
          <div className="flex items-center tracking-tighter brightness-110">
            <span className="mr-0.5 sm:mr-1 opacity-60">{isReceita ? '+' : '−'}</span>
            {formatCurrency(item.valor).replace('R$', '').trim()}
          </div>
          {/* Ícone com cor semântica e hover animado */}
          <div className={`opacity-20 group-hover:opacity-100 group-hover:scale-110 transition-all hidden sm:block ${isReceita ? 'text-emerald-500' : 'text-rose-500'}`}>
            {isReceita ? <ArrowUpRight size={14} strokeWidth={3} /> : <ArrowDownLeft size={14} strokeWidth={3} />}
          </div>
        </div>
      </td>
    </tr>
  );
});

export const DataTable = memo(({ data, page, totalPages, onPrev, onNext }) => (
  <section className="panel-base rounded-[2rem] overflow-hidden border border-white/5 bg-[#0a0f1a]/60 backdrop-blur-xl w-full shadow-2xl">

    <div className="px-4 sm:px-8 py-5 border-b border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 bg-white/[0.01]">
      <div className="flex items-center gap-4 w-full md:w-auto">
        <div className="p-2 sm:p-2.5 bg-atena-yellow/5 rounded-xl border border-atena-yellow/10 shrink-0">
          <Layers className="text-atena-yellow w-4 h-4 sm:w-5 sm:h-5" />
        </div>
        <div>
          <h3 className="text-[10px] sm:text-xs font-black text-white uppercase tracking-[0.3em] font-mono">
            Log de Transações
          </h3>
          <p className="text-[8px] sm:text-[9px] text-slate-500 uppercase tracking-[0.2em] mt-1 font-mono flex items-center gap-2">
            Status Operacional <span className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_5px_#10b981]" />
          </p>
        </div>
      </div>

      {/* Paginação Estilo Terminal */}
      <div className="flex items-center justify-between md:justify-end gap-2 bg-black/60 p-1.5 rounded-2xl border border-white/5 font-mono w-full md:w-auto">
        <button
          onClick={onPrev}
          disabled={page === 1}
          className="p-2 hover:bg-white/5 rounded-xl hover:text-atena-yellow text-slate-600 disabled:opacity-5 transition-all"
        >
          <ChevronLeft size={16} />
        </button>
        <div className="px-4 text-[9px] sm:text-[10px] font-black whitespace-nowrap tracking-widest">
          <span className="text-atena-yellow">PG {page.toString().padStart(2, '0')}</span>
          <span className="text-white/10 mx-3">|</span>
          <span className="text-slate-600">{totalPages.toString().padStart(2, '0')}</span>
        </div>
        <button
          onClick={onNext}
          disabled={page === totalPages || totalPages === 0}
          className="p-2 hover:bg-white/5 rounded-xl hover:text-atena-yellow text-slate-600 disabled:opacity-5 transition-all"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>

    <div className="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <table className="w-full text-left border-collapse min-w-[700px] md:min-w-full">
        <thead>
          <tr className="bg-white/[0.01]">
            <th className="w-2 hidden sm:table-cell"></th>
            <th className="px-4 sm:px-6 py-5 text-[9px] font-black text-slate-600 uppercase tracking-[0.3em] border-b border-white/5">Timestamp</th>
            <th className="px-4 sm:px-6 py-5 text-[9px] font-black text-slate-600 uppercase tracking-[0.3em] border-b border-white/5">Categoria</th>
            <th className="hidden md:table-cell px-6 py-5 text-[9px] font-black text-slate-600 uppercase tracking-[0.3em] border-b border-white/5">Descrição Operacional</th>
            <th className="px-4 sm:px-8 py-5 text-[9px] font-black text-slate-600 uppercase tracking-[0.3em] border-b border-white/5 text-right">Montante (BRL)</th>
          </tr>
        </thead>
        <tbody>
          {data && data.length > 0 ? (
            data.map((item) => (
              <TableRow key={item.id || `${item.dateRaw}-${item.valor}`} item={item} />
            ))
          ) : (
            <tr>
              <td colSpan="5" className="p-24 text-center">
                <div className="flex flex-col items-center gap-4 opacity-20">
                  <Layers size={32} />
                  <span className="text-[10px] uppercase tracking-[0.5em] font-mono font-black">Null Data Detected</span>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </section>
));

DataTable.displayName = 'DataTable';
