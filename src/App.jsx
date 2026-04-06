import React, { useState, useMemo, useEffect } from 'react';
import {
  Wallet, ArrowUpCircle, ArrowDownCircle,
  Globe, Landmark, Camera, ExternalLink, TrendingUp // Trocado Cpu por Landmark e adicionado TrendingUp
} from 'lucide-react';

import { useDashboardData } from './hooks/useDashboardData';
import { formatDateBR, toISODate } from './utils/dataHandlers';
import TopBar from "./components/TopBar";
import Sidebar from './components/Sidebar';
import { KPIBox } from './components/KPIBox';
import { DataTable } from './components/DataTable';
import {
  EvolutionChart, BalanceOverviewChart, DistributionPieChart,
  MonthlyFlowChart
} from './components/DashboardCharts';

const App = () => {
  const {
    loading, fetchData, dateRange, setDateRange,
    filters, setFilters, stats, categoryData, timelineData, rawData, filteredData
  } = useDashboardData();

  const [page, setPage] = useState(1);
  const [lastSyncTime, setLastSyncTime] = useState('--:--:--');

  useEffect(() => {
    if (!loading) {
      setLastSyncTime(new Date().toLocaleTimeString('pt-BR', {
        hour: '2-digit', minute: '2-digit', second: '2-digit'
      }));
    }
  }, [loading]);

  const uniqueCategories = useMemo(() => {
    return [...new Set(rawData.map(item => item.categoria).filter(Boolean))].sort();
  }, [rawData]);

  const tableData = useMemo(() => {
    return [...filteredData].reverse().map(item => ({
      ...item,
      data_formatada: formatDateBR(item.date),
      observacao: item.observacao || item.memo || 'N/D'
    }));
  }, [filteredData]);

  useEffect(() => { setPage(1); }, [filters, dateRange]);

  const handleExport = () => {
    if (!filteredData.length) return;
    const csv = 'Data,Categoria,Tipo,Valor,Observacao\n' +
      filteredData.map(item =>
        `${item.date},${item.categoria},${item.tipo},${item.valor},"${(item.observacao || '').replace(/"/g, '""')}"`
      ).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CAEC_FIN_EXPORT_${toISODate(new Date())}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#030712] font-mono text-slate-300">
      <Sidebar
        dateRange={dateRange} setDateRange={setDateRange}
        filters={filters} setFilters={setFilters}
        categories={uniqueCategories}
        rawData={rawData}
        onSync={fetchData} isLoading={loading}
        onExport={handleExport}
      />

      <main className="relative flex-1 min-w-0 h-screen overflow-y-auto bg-[#030712] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <TopBar
          title="CAEC UFPA / Gestão Financeira"
          recordCount={filteredData.length}
          lastSyncTime={lastSyncTime}
        />

        <div className="mx-auto max-w-[1700px] space-y-16 p-6 lg:p-10 animate-in fade-in duration-700">

          {/* SEÇÃO 1: KPIs */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <KPIBox label="Entradas" val={stats.in} icon={ArrowUpCircle} type="entrada" />
            <KPIBox label="Saídas" val={stats.out} icon={ArrowDownCircle} type="saida" />
            <KPIBox label="Liquidez CAEC" val={stats.total} icon={Wallet} type="liquidez" />
          </div>

          {/* SEÇÃO 2: GRÁFICOS */}
          <div className="space-y-16">
            <section className="space-y-6">
              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-600 px-2 flex items-center gap-3">
                <span className="w-8 h-[1px] bg-slate-800"></span> Crescimento Patrimonial
              </h4>
              <EvolutionChart data={timelineData} />
            </section>

            <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-7">
                <BalanceOverviewChart data={categoryData} />
              </div>
              <div className="lg:col-span-5">
                <DistributionPieChart data={categoryData} />
              </div>
            </section>

            <section className="space-y-6 border-t border-white/5 pt-12">
              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-600 px-2 flex items-center gap-3">
                <span className="w-8 h-[1px] bg-slate-800"></span> Fluxo de Caixa Mensal
              </h4>
              <MonthlyFlowChart data={timelineData} />
            </section>
          </div>

          {/* SEÇÃO 3: TABELA */}
          <section className="pt-12 border-t border-white/5">
            <div className="mb-6 flex items-center justify-between px-2">
              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Histórico Analítico</h4>
              <div className="bg-atena-yellow/10 border border-atena-yellow/20 px-3 py-1 rounded-full">
                <span className="text-[9px] font-bold text-atena-yellow tracking-widest uppercase">Pág {page}</span>
              </div>
            </div>
            <DataTable
              data={tableData.slice((page - 1) * 12, page * 12)}
              page={page}
              totalParticipantes={tableData.length}
              totalPages={Math.max(1, Math.ceil(tableData.length / 12))}
              onNext={() => setPage(p => p + 1)}
              onPrev={() => setPage(p => p - 1)}
            />
          </section>

          {/* FOOTER EXTREME EDITION */}
          <footer className="pt-20 pb-12 border-t border-white/5">
            <div className="flex flex-col md:flex-row items-center justify-between gap-12">

              {/* Lado Esquerdo: Social & Suporte */}
              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-8">
                  <a href="https://www.instagram.com/caecufpa/" target="_blank" rel="noopener noreferrer"
                    className="group flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-pink-500 transition-all">
                    <Camera size={16} className="text-pink-600 group-hover:scale-125 transition-transform" />
                    <span>Instagram</span>
                  </a>

                  <div className="h-4 w-[1px] bg-white/10 hidden md:block" />

                  <a href="https://portfolio-ricardo-v1.vercel.app/" target="_blank" rel="noopener noreferrer"
                    className="group flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-blue-400 transition-all">
                    <Globe size={16} className="text-blue-500 group-hover:rotate-12 transition-transform" />
                    <div className="flex flex-col">
                      <span className="text-[8px] text-slate-600 lowercase tracking-normal font-medium mb-0.5">Suporte Técnico</span>
                      <span className="flex items-center gap-1.5">
                        Dev Responsável: <span className="text-blue-500 group-hover:text-blue-300 underline underline-offset-4">Rick</span>
                        <ExternalLink size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                      </span>
                    </div>
                  </a>
                </div>
              </div>

              {/* Lado Direito: Selo de Autenticidade Financeira (ATUALIZADO) */}
              <div className="relative group">
                {/* Glow de fundo mais sofisticado em dourado/azul */}
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 via-atena-yellow/20 to-blue-600/20 rounded-2xl blur-xl opacity-30 group-hover:opacity-100 transition duration-1000"></div>

                <div className="relative flex items-center gap-5 bg-[#0a0f1a]/80 backdrop-blur-xl border border-white/10 px-8 py-5 rounded-2xl shadow-2xl">
                  <div className="relative">
                    {/* Ícone de Landmark (Instituição/Tesouraria) */}
                    <div className="p-2.5 bg-atena-yellow/10 rounded-xl border border-atena-yellow/20 shadow-[0_0_15px_rgba(251,191,36,0.1)]">
                      <Landmark size={20} className="text-atena-yellow drop-shadow-md" />
                    </div>
                    {/* Badge flutuante de trending */}
                    <div className="absolute -top-1 -right-1 bg-blue-500 rounded-full p-0.5 border border-[#0a0f1a]">
                      <TrendingUp size={8} className="text-white" />
                    </div>
                  </div>

                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <p className="text-[10px] font-black text-white uppercase tracking-[0.3em] leading-tight">
                        CAEC UFPA
                      </p>
                      <span className="h-[1px] w-3 bg-white/20"></span>
                      <span className="text-[9px] font-bold text-slate-500">2026</span>
                    </div>
                    <p className="text-[7px] font-black text-atena-yellow/80 uppercase tracking-[0.15em] mt-1.5">
                      Diretoria de Administração Financeira
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </footer>
        </div>
      </main>
    </div>
  );
};

export default App;
