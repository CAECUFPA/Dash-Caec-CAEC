import React, { useState, useMemo, useEffect } from 'react';
import {
  Calendar, Filter, Download, RefreshCcw,
  ChevronDown, Layers, Target, X, Info, Menu, HardHat // Adicionados Menu e HardHat
} from 'lucide-react';
import { parseDate, toISODate, formatDateBR } from '../utils/dataHandlers';

const Btn = ({ children, onClick, active, icon: Icon }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all duration-200
      ${active
        ? 'bg-atena-yellow border-atena-yellow text-black shadow-[0_5px_15px_rgba(251,191,36,0.2)]'
        : 'text-slate-400 border-transparent hover:bg-white/5 hover:text-white'}`}
  >
    {Icon && <Icon size={14} className={active ? 'text-black' : 'text-atena-yellow'} />}
    <span className="truncate">{children}</span>
  </button>
);

export default function Sidebar({
  dateRange, setDateRange, filters, setFilters,
  categories = [], rawData = [], onExport, onSync, isLoading,
  isOpen, setIsOpen
}) {
  const [catOpen, setCatOpen] = useState(false);
  const isAll = !filters.categoria || filters.categoria.length === 0;

  // Lógica de limites de data (inalterada)
  const dbLimits = useMemo(() => {
    if (!rawData || rawData.length === 0) return null;
    const validDates = rawData
      .map(item => parseDate(item.date))
      .filter(d => d !== null)
      .sort((a, b) => a - b);
    if (validDates.length === 0) return null;
    return {
      min: toISODate(validDates[0]),
      max: toISODate(validDates[validDates.length - 1]),
      displayMin: formatDateBR(validDates[0]),
      displayMax: formatDateBR(validDates[validDates.length - 1])
    };
  }, [rawData]);

  useEffect(() => {
    if (dbLimits && !dateRange.start && !dateRange.end) {
      setDateRange({ start: dbLimits.min, end: dbLimits.max });
    }
  }, [dbLimits, dateRange.start, dateRange.end, setDateRange]);

  return (
    <>
      {/* GATILHO MOBILE: Aparece quando a barra está fechada */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed top-6 left-6 z-40 md:hidden p-3 bg-atena-yellow text-black rounded-xl shadow-lg active:scale-90 transition-transform hover:shadow-[0_0_20px_rgba(251,191,36,0.2)]"
        >
          <Menu size={24} strokeWidth={3} />
        </button>
      )}

      {/* OVERLAY: Escurece o fundo no mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/80 z-40 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={`
        fixed md:relative z-50 h-screen w-80 bg-[#030712] border-r border-white/5 flex flex-col font-mono transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>

        {/* HEADER MODIFICADO */}
        <div className="relative flex items-center gap-4 px-8 h-32 border-b border-white/5 shrink-0">
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-6 right-6 text-slate-500 md:hidden hover:text-white"
          >
            <X size={20} />
          </button>

          {/* NOVO ÍCONE DE CAPACETE (HardHat) */}
          <div className="p-3 bg-atena-yellow/10 rounded-2xl border border-atena-yellow/20 shadow-[0_0_30px_rgba(251,191,36,0.05)] text-atena-yellow">
            <HardHat size={32} />
          </div>

          <div className="flex flex-col">
            <h1 className="text-2xl font-black text-white italic leading-none uppercase tracking-tighter">
              ADM <span className="text-atena-yellow">/ FIN</span>
            </h1>
            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.4em] mt-2">
              — CAEC UFPA
            </p>
          </div>
        </div>

        {/* CONTEÚDO SCROLLABLE (inalterado) */}
        <div className="flex-1 overflow-y-auto px-6 py-8 space-y-10 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">

          {/* SEÇÃO CRONOGRAMA */}
          <section className="space-y-5">
            <div className="flex items-center gap-3 px-1">
              <Calendar size={12} className="text-atena-yellow" />
              <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Cronograma</h4>
            </div>

            <div className="space-y-4">
              <div className="relative group cursor-pointer">
                <label className="absolute -top-2 left-4 px-2 bg-[#030712] text-[8px] text-atena-yellow font-black uppercase tracking-widest z-10">Início</label>
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={e => setDateRange(p => ({ ...p, start: e.target.value }))}
                  className="w-full bg-white/[0.02] border border-white/10 p-4 rounded-2xl text-xs text-white outline-none focus:border-atena-yellow/40 transition-all font-bold"
                />
              </div>

              <div className="relative group cursor-pointer">
                <label className="absolute -top-2 left-4 px-2 bg-[#030712] text-[8px] text-atena-yellow font-black uppercase tracking-widest z-10">Fim</label>
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={e => setDateRange(p => ({ ...p, end: e.target.value }))}
                  className="w-full bg-white/[0.02] border border-white/10 p-4 rounded-2xl text-xs text-white outline-none focus:border-atena-yellow/40 transition-all font-bold"
                />
              </div>
            </div>
          </section>

          {/* SEÇÃO SETORES/CATEGORIAS */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 px-1">
              <Filter size={12} className="text-atena-yellow" />
              <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Setores</h4>
            </div>

            <button
              onClick={() => setCatOpen(!catOpen)}
              className="w-full flex justify-between items-center bg-white/[0.03] border border-white/10 p-4 rounded-2xl text-xs text-white font-black uppercase hover:bg-white/5 transition-all"
            >
              <span className={isAll ? 'text-slate-500' : 'text-atena-yellow'}>
                {isAll ? 'Filtrar Categorias' : `${filters.categoria.length} Selecionados`}
              </span>
              <ChevronDown size={14} className={`text-atena-yellow transition-transform ${catOpen ? 'rotate-180' : ''}`} />
            </button>

            {catOpen && (
              <div className="mt-2 space-y-1.5 max-h-60 overflow-y-auto p-2 bg-black/40 rounded-2xl border border-white/5">
                <Btn onClick={() => setFilters(p => ({ ...p, categoria: [] }))} active={isAll} icon={Target}>Tudo</Btn>
                {categories.map(cat => (
                  <Btn
                    key={cat}
                    onClick={() => {
                      const current = filters.categoria || [];
                      const exists = current.includes(cat);
                      setFilters(p => ({
                        ...p,
                        categoria: exists ? current.filter(c => c !== cat) : [...current, cat]
                      }));
                    }}
                    active={(filters.categoria || []).includes(cat)}
                    icon={Layers}
                  >
                    {cat.replace(/_/g, ' ')}
                  </Btn>
                ))}
              </div>
            )}
          </section>

          <button
            onClick={onExport}
            className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl border border-white/5 text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white/5 hover:text-white transition-all"
          >
            <Download size={14} />
            Exportar Dados
          </button>
        </div>

        {/* FOOTER - SINCRONIZAÇÃO */}
        <div className="p-8 border-t border-white/5">
          <button
            onClick={onSync}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-4 py-5 rounded-2xl bg-atena-yellow text-black text-[11px] font-black uppercase tracking-[0.25em] shadow-[0_10px_30px_rgba(251,191,36,0.2)] active:scale-[0.97] transition-all disabled:opacity-50"
          >
            <RefreshCcw size={18} className={isLoading ? 'animate-spin' : ''} />
            {isLoading ? 'Aguarde...' : 'Sincronizar'}
          </button>
        </div>
      </aside>
    </>
  );
}
