import React, { memo } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell, PieChart, Pie, Legend, ReferenceLine
} from 'recharts';
import {
  Landmark, HardHat, Compass, Loader2,
  TrendingDown, TrendingUp, Activity
} from 'lucide-react';

/* CONFIGURAÇÕES DE ESTILO IDG */
const ATENA_PALETTE = [
  "#FBBF24", "#3B82F6", "#14B8A6", "#8B5CF6", "#EC4899",
  "#06B6D4", "#F97316", "#84CC16", "#6366F1", "#D946EF"
];
const RED_EXPENSE = "#EF4444";
const TEAL_REVENUE = "#14B8A6";
const AXIS_STYLE = { fill: '#64748b', fontSize: 10, fontFamily: 'var(--font-mono)' };

const formatCurrency = (v) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

/* TOOLTIP INTELIGENTE: SINCRONIZADO COM CORES DE STATUS */
const CustomTooltip = memo(({ active, payload, label }) => {
  if (!active || !payload?.length) return null;

  const data = payload[0].payload;
  const value = payload[0].value;
  const name = payload[0].name;

  // Lógica de Cor: Identifica se o saldo ou a categoria é negativa
  const isNeg = name === 'Saldo' ? value < 0 : (data.isNegative || data.tipo === 'DESPESA' || name === 'Despesa');

  return (
    <div className="bg-slate-900/95 border border-white/10 p-3 rounded-2xl shadow-2xl font-mono backdrop-blur-md">
      <p className="text-[10px] font-bold text-slate-400 uppercase mb-2 border-b border-white/5 pb-1">
        {data.name || data.dateISO || label}
      </p>
      <div className="flex justify-between gap-6 text-[11px]">
        <span className="text-slate-500 flex items-center gap-1 uppercase">
          {isNeg ? <TrendingDown size={12} className="text-red-500" /> : <TrendingUp size={12} className="text-emerald-500" />}
          {name || 'VALOR'}:
        </span>
        <span className="font-bold" style={{ color: isNeg ? RED_EXPENSE : TEAL_REVENUE }}>
          {formatCurrency(value)}
        </span>
      </div>
    </div>
  );
});

/* WRAPPER PADRONIZADO CAEC */
const ChartBox = memo(({ title, subtitle, children, Icon, dataLength = 0 }) => (
  <div className="group bg-slate-950/20 rounded-3xl p-7 relative overflow-hidden border border-white/[0.05] transition-all duration-500 hover:border-atena-yellow/20">
    {Icon && (
      <div className="absolute -right-10 -bottom-10 pointer-events-none opacity-[0.02] transition-all duration-700 group-hover:opacity-20 group-hover:text-atena-yellow group-hover:-translate-y-2">
        <Icon className="w-64 h-64 rotate-12" />
      </div>
    )}

    <div className="relative z-10 mb-8 border-l-4 border-atena-yellow/50 pl-4">
      <h3 className="text-white text-[12px] font-black uppercase tracking-[0.3em]">{title}</h3>
      <p className="text-slate-500 text-[9px] uppercase tracking-widest mt-1">{subtitle}</p>
    </div>

    <div className="relative z-10 h-[280px] w-full">
      {dataLength > 0 ? (
        <ResponsiveContainer width="100%" height="100%">{children}</ResponsiveContainer>
      ) : (
        <div className="flex flex-col items-center justify-center h-full gap-3 text-slate-600 font-mono">
          <Loader2 size={24} className="animate-spin text-atena-yellow/40" />
          <span className="text-[10px] uppercase tracking-widest">Processando telemetria...</span>
        </div>
      )}
    </div>
  </div>
));

/* 1. EVOLUÇÃO PATRIMONIAL (SALDO ACUMULADO) */
export const EvolutionChart = memo(({ data }) => (
  <ChartBox title="Patrimônio" subtitle="Saldo Acumulado no Tempo" Icon={Landmark} dataLength={data?.length}>
    <AreaChart data={data} margin={{ left: -10, right: 10, top: 10 }}>
      <defs>
        <linearGradient id="colorSaldo" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="#FBBF24" stopOpacity={0.3} />
          <stop offset="95%" stopColor="#FBBF24" stopOpacity={0} />
        </linearGradient>
      </defs>
      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
      <XAxis dataKey="dateISO" hide />
      <YAxis
        axisLine={false}
        tickLine={false}
        tick={AXIS_STYLE}
        domain={['dataMin - 500', 'auto']}
      />
      <Tooltip content={<CustomTooltip />} />
      <ReferenceLine y={0} stroke="rgba(255,255,255,0.1)" strokeDasharray="3 3" />
      <Area
        type="monotone"
        dataKey="saldo"
        name="Saldo"
        stroke="#FBBF24"
        fill="url(#colorSaldo)"
        strokeWidth={3}
        dot={{ r: 3, fill: '#FBBF24', strokeWidth: 2, stroke: '#0f172a' }}
        activeDot={{ r: 6, stroke: '#FBBF24', strokeWidth: 2, fill: '#fff' }}
      />
    </AreaChart>
  </ChartBox>
));

/* 2. RANKING DE CATEGORIAS */
export const BalanceOverviewChart = memo(({ data }) => (
  <ChartBox title="Ranking" subtitle="Maiores Movimentações" Icon={HardHat} dataLength={data?.length}>
    <BarChart data={data?.slice(0, 8)} layout="vertical" margin={{ left: 20, right: 30 }}>
      <XAxis type="number" hide />
      <YAxis dataKey="name" type="category" width={100} tick={{ ...AXIS_STYLE, fontSize: 9 }} axisLine={false} tickLine={false} />
      <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
      <Bar dataKey="value" radius={[0, 10, 10, 0]} barSize={12}>
        {data?.slice(0, 8).map((entry, i) => (
          <Cell
            key={i}
            fill={entry.isNegative ? RED_EXPENSE : ATENA_PALETTE[i % ATENA_PALETTE.length]}
          />
        ))}
      </Bar>
    </BarChart>
  </ChartBox>
));

/* 3. PROPORÇÃO (TOP 5) - CORRIGIDO PARA SALDO NEGATIVO */
export const DistributionPieChart = memo(({ data }) => (
  <ChartBox title="Proporção" subtitle="Top 5 Categorias" Icon={Compass} dataLength={data?.length}>
    <PieChart>
      <Pie
        data={data?.slice(0, 5)}
        innerRadius={70}
        outerRadius={90}
        paddingAngle={10}
        cornerRadius={8}
        dataKey="value"
        stroke="none"
        cx="50%" cy="50%"
      >
        {data?.slice(0, 5).map((entry, i) => (
          <Cell
            key={i}
            /* LÓGICA DE COR: Vermelho se for despesa, Atena se for receita */
            fill={entry.isNegative ? RED_EXPENSE : ATENA_PALETTE[i % ATENA_PALETTE.length]}
          />
        ))}
      </Pie>
      <Tooltip content={<CustomTooltip />} />
      <Legend
        verticalAlign="bottom"
        iconType="circle"
        wrapperStyle={{ fontSize: '9px', paddingTop: '20px', textTransform: 'uppercase' }}
      />
    </PieChart>
  </ChartBox>
));

/* 4. FLUXO MENSAL (ATIVIDADE) */
export const MonthlyFlowChart = memo(({ data }) => (
  <ChartBox title="Atividade" subtitle="Fluxo Mensal de Caixa" Icon={Activity} dataLength={data?.length}>
    <BarChart data={data} margin={{ left: -20 }}>
      <CartesianGrid strokeDasharray="2 2" vertical={false} stroke="rgba(255,255,255,0.03)" />
      <XAxis dataKey="dateISO" hide />
      <YAxis axisLine={false} tickLine={false} tick={AXIS_STYLE} />
      <Tooltip content={<CustomTooltip />} />
      <Bar dataKey="receita" name="Receita" fill={TEAL_REVENUE} radius={[4, 4, 0, 0]} barSize={8} />
      <Bar dataKey="despesa" name="Despesa" fill={RED_EXPENSE} radius={[4, 4, 0, 0]} barSize={8} />
    </BarChart>
  </ChartBox>
));
