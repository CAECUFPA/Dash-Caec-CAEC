import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import axios from 'axios';
import { toISODate } from '../utils/dataHandlers';

// ✅ Configuração para o Vercel (Caminho Relativo)
const API_URL = '/api/data';

export const useDashboardData = () => {
  const [rawData, setRawData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [filters, setFilters] = useState({ categoria: [], tipo: 'ALL' });

  const abortRef = useRef(null);

  // --- BUSCA DE DADOS ---
  const fetchData = useCallback(async () => {
    setLoading(true);

    // Cancela requisição anterior se houver
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const { data } = await axios.get(API_URL, { signal: controller.signal });
      const rows = Array.isArray(data) ? data : [];

      const processed = rows.map(item => {
        const tipoLimpo = String(item.tipo || '').trim().toUpperCase();
        const valorNumerico = Math.abs(Number(item.valor) || 0);
        const isoDate = toISODate(item.date);

        return {
          ...item,
          valor: valorNumerico,
          tipo: tipoLimpo,
          valor_real: tipoLimpo === 'RECEITA' ? valorNumerico : -valorNumerico,
          dateISO: isoDate,
          categoria: item.categoria || 'Sem Categoria'
        };
      });

      setRawData(processed);
    } catch (e) {
      if (!axios.isCancel(e)) console.error("❌ Erro na API:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  // --- EFEITOS ---
  useEffect(() => {
    fetchData();
    return () => abortRef.current?.abort();
  }, [fetchData]);

  // Define o range de data inicial baseado nos dados recebidos
  useEffect(() => {
    if (rawData.length > 0 && !dateRange.start) {
      const sorted = [...rawData]
        .filter(d => d.dateISO)
        .sort((a, b) => a.dateISO.localeCompare(b.dateISO));

      if (sorted.length > 0) {
        setDateRange({
          start: sorted[0].dateISO,
          end: sorted[sorted.length - 1].dateISO
        });
      }
    }
  }, [rawData, dateRange.start]);

  // --- LÓGICA DE FILTROS (MEMOIZADA) ---
  const filteredData = useMemo(() => {
    return rawData.filter(item => {
      const matchesDate = (!dateRange.start || item.dateISO >= dateRange.start) &&
        (!dateRange.end || item.dateISO <= dateRange.end);
      const matchesType = filters.tipo === 'ALL' || item.tipo === filters.tipo;
      const matchesCat = filters.categoria.length === 0 || filters.categoria.includes(item.categoria);

      return matchesDate && matchesType && matchesCat;
    });
  }, [rawData, dateRange, filters]);

  // --- CÁLCULOS PARA O DASHBOARD ---

  // 1. Estatísticas Gerais (Cards)
  const stats = useMemo(() => {
    return filteredData.reduce((acc, item) => {
      if (item.tipo === 'RECEITA') acc.in += item.valor;
      else acc.out += item.valor;
      acc.total = acc.in - acc.out;
      return acc;
    }, { in: 0, out: 0, total: 0 });
  }, [filteredData]);

  // 2. Dados da Linha do Tempo (Gráfico de Saldo/Evolução)
  const timelineData = useMemo(() => {
    let balanceAcc = 0;
    return [...filteredData]
      .sort((a, b) => a.dateISO.localeCompare(b.dateISO))
      .map(d => {
        balanceAcc += d.valor_real;
        return {
          ...d,
          saldo: balanceAcc,
          receita: d.tipo === 'RECEITA' ? d.valor : 0,
          despesa: d.tipo === 'DESPESA' ? d.valor : 0
        };
      });
  }, [filteredData]);

  // 3. Distribuição por Categoria (Gráfico de Pizza/Barras)
  const categoryData = useMemo(() => {
    const agg = {};
    filteredData.forEach(item => {
      agg[item.categoria] = (agg[item.categoria] || 0) + item.valor_real;
    });

    return Object.entries(agg)
      .map(([name, total]) => ({
        name,
        value: Math.abs(total),
        tipo: total < 0 ? 'DESPESA' : 'RECEITA',
        isNegative: total < 0
      }))
      .sort((a, b) => b.value - a.value);
  }, [filteredData]);

  return {
    loading,
    fetchData,
    dateRange,
    setDateRange,
    filters,
    setFilters,
    stats,
    categoryData,
    timelineData,
    filteredData,
    rawData
  };
};
