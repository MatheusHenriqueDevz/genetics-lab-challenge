import { useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios';
import './App.css';
import type { Laudo } from './types';

interface Amostra {
  id: string;
  name: string;
}

const randomItem = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];

function App() {
  const [amostras, setAmostras] = useState<Amostra[]>([]);
  const [selecionadaId, setSelecionadaId] = useState<string | null>(null);
  const [observacoes, setObservacoes] = useState('');
  
  const [laudo, setLaudo] = useState<Laudo | null>(null);
  const [loadingLaudo, setLoadingLaudo] = useState(false);

  useEffect(() => {
    carregarAmostras();
  }, []);

  const carregarAmostras = async () => {
    try {
      const res = await axios.get('http://localhost:3333/samples');
      setAmostras(res.data);
    } catch (err) {
      console.error("Erro ao listar", err);
    }
  };

  const buscarLaudoSalvo = async (id: string) => {
    setLoadingLaudo(true);
    setLaudo(null);
    setObservacoes('');

    try {
      const res = await axios.get<Laudo>(`http://localhost:3333/reports/${id}`);
      setLaudo(res.data);
      setObservacoes(res.data.notes);
      
    } catch (error) { 
      const err = error as AxiosError;

      if (err.response && err.response.status === 404) {
        console.log("Nenhum laudo salvo encontrado (isso é normal).");
      } else {
        console.error("Erro ao buscar laudo salvo", error);
      }
    } finally {
      setLoadingLaudo(false);
    }
  };

  const criarAmostraTeste = async () => {
    const idAleatorio = Math.floor(Math.random() * 1000);
    const nome = prompt("Nome da amostra:", `Paciente ${idAleatorio}`);
    if (!nome) return;

    const genesPossiveis = ['BRCA1', 'TP53', 'EGFR', 'MTHFR', 'CFTR', 'BRAF'];
    const classificacoesPossiveis = ['Patogênico', 'Benigno', 'VUS'];
    const qtdVariantes = Math.floor(Math.random() * 6) + 1;
    const variantesGeradas = [];

    for (let i = 0; i < qtdVariantes; i++) {
        variantesGeradas.push({
            id: `chr${Math.floor(Math.random() * 22)}-${Math.floor(Math.random() * 99999)}-A-T`,
            gene: randomItem(genesPossiveis),
            classification: randomItem(classificacoesPossiveis)
        });
    }

    try {
      await axios.post('http://localhost:3333/samples', {
        name: nome,
        variants: variantesGeradas
      });
      await carregarAmostras();
    } catch (error) {
      console.error(error);
      alert("Erro ao criar amostra.");
    }
  };

  const handleGerarPrevia = async () => {
    if (!selecionadaId) return;
    setLoadingLaudo(true);
    setLaudo(null);

    try {
      const res = await axios.post<Laudo>('http://localhost:3333/reports/previa', {
        sampleId: selecionadaId,
        notes: observacoes
      });
      setLaudo(res.data);
    } catch (error) {
      console.error(error);
      alert("Erro ao gerar prévia.");
    } finally {
      setLoadingLaudo(false);
    }
  };

  const handleSalvarLaudo = async () => {
    if (!selecionadaId) return;

    try {
      await axios.post('http://localhost:3333/reports', {
        sampleId: selecionadaId,
        notes: observacoes
      });
      alert("Laudo salvo no sistema!");
    } catch (error) {
      console.error(error);
      alert("Erro ao salvar laudo.");
    }
  };

  return (
    <div className="container">
      <div className="sidebar">
        <div className="sidebar-header">
          <h3>Laboratório Genômico</h3>
          <button className="btn" style={{marginTop: 10, width: '100%'}} onClick={criarAmostraTeste}>
            + Nova Amostra
          </button>
        </div>
        
        <div className="sample-list">
          {amostras.map(amostra => (
            <div 
              key={amostra.id}
              className={`sample-item ${selecionadaId === amostra.id ? 'active' : ''}`}
              onClick={() => {
                setSelecionadaId(amostra.id);
                buscarLaudoSalvo(amostra.id);
              }}
            >
              <strong>{amostra.name}</strong>
              <br/>
              <small style={{fontSize: '0.75em', color: '#666'}}>ID: {amostra.id.slice(0,8)}...</small>
            </div>
          ))}
        </div>
      </div>

      <div className="main-content">
        {!selecionadaId ? (
          <div style={{textAlign: 'center', marginTop: 100, color: '#888'}}>
            <h2>Selecione uma amostra ao lado</h2>
          </div>
        ) : (
          <div>
            <h2>Detalhes da Amostra</h2>
            <div className="card">
              <label style={{fontWeight: 'bold', display: 'block', marginBottom: 8}}>
                Observações:
              </label>
              <textarea 
                rows={4} 
                style={{width: '100%', padding: 10, marginBottom: 15}}
                value={observacoes}
                onChange={(e) => setObservacoes(e.target.value)}
                placeholder="Observações clínicas..."
              />
              
              <div style={{display: 'flex', gap: '10px'}}>
                <button className="btn" onClick={handleGerarPrevia} disabled={loadingLaudo}>
                  {loadingLaudo ? 'Carregando...' : 'Gerar Prévia'}
                </button>

                {laudo && (
                    <button 
                        className="btn" 
                        style={{backgroundColor: '#28a745'}} 
                        onClick={handleSalvarLaudo}
                    >
                        Salvar
                    </button>
                )}
              </div>
            </div>

            {laudo && (
              <div className="laudo-box animate-fade-in">
                <h3 style={{color: '#2c3e50'}}>{laudo.summary}</h3>
                <hr style={{margin: '15px 0'}}/>
                <ul>
                  <li style={{color: '#e74c3c'}}>Patogênicas: {laudo.statistics.pathogenic}</li>
                  <li style={{color: '#27ae60'}}>Benignas: {laudo.statistics.benign}</li>
                  <li style={{color: '#f39c12'}}>VUS: {laudo.statistics.vus}</li>
                </ul>
                <p><strong>Notas:</strong> {laudo.notes || '-'}</p>
                <br/>
                <small style={{color: '#95a5a6'}}>Gerado em: {new Date(laudo.generatedAt).toLocaleString()}</small>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;