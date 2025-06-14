import React, { useEffect, useRef, useState } from "react";
// Assicurati di avere chart.js installato: npm install chart.js
import Chart from 'chart.js/auto';

export default function AndamentoOperatori() {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const [loading, setLoading] = useState(true);
  const [errore, setErrore] = useState(null);

  useEffect(() => {
    async function fetchAndamento() {
      setLoading(true);
      setErrore(null);
      try {
        const token = window.localStorage.getItem('token');
        if (!token) throw new Error('Token di autenticazione mancante');
        const response = await fetch('/api/andamento', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error(`Errore HTTP: ${response.status}`);
        const data = await response.json();
        const labels = data.map(item => item.ANNO_MESE);
        const iliad = data.map(item => item.ILIAD || 0);
        const kena = data.map(item => item.KENA || 0);
        const oneMobile = data.map(item => item['1MOBILE'] || 0);
        const weedoo = data.map(item => item.WEEDOO || 0);
        // Distruggi eventuale grafico precedente
        if (chartInstance.current) {
          chartInstance.current.destroy();
        }
        chartInstance.current = new Chart(chartRef.current, {
          type: 'line',
          data: {
            labels,
            datasets: [
              {
                label: 'ILIAD',
                data: iliad,
                borderColor: '#4e73df',
                backgroundColor: 'rgba(78, 115, 223, 0.05)',
                tension: 0.3,
                fill: true,
              },
              {
                label: 'KENA',
                data: kena,
                borderColor: '#1cc88a',
                backgroundColor: 'rgba(28, 200, 138, 0.05)',
                tension: 0.3,
                fill: true,
              },
              {
                label: '1MOBILE',
                data: oneMobile,
                borderColor: '#f6c23e',
                backgroundColor: 'rgba(246, 194, 62, 0.05)',
                tension: 0.3,
                fill: true,
              },
              {
                label: 'WEEDOO',
                data: weedoo,
                borderColor: '#e74a3b',
                backgroundColor: 'rgba(231, 74, 59, 0.05)',
                tension: 0.3,
                fill: true,
              },
            ],
          },
          options: {
            responsive: true,
            plugins: {
              legend: {
                display: true,
                position: 'bottom',
              },
              title: {
                display: false,
              },
            },
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  precision: 0,
                },
              },
            },
          },
        });
      } catch (err) {
        setErrore(err.message || 'Errore caricamento andamento');
      } finally {
        setLoading(false);
      }
    }
    fetchAndamento();
    // Cleanup chart on unmount
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, []);

  return (
    <div className="andamento-operatori-card">
      <h3>Andamento Operatori</h3>
      {loading ? (
        <div className="text-muted">Caricamento in corso...</div>
      ) : errore ? (
        <div className="text-danger">{errore}</div>
      ) : (
        <canvas ref={chartRef} id="operatorTrendChart" height={260} />
      )}
    </div>
  );
}
