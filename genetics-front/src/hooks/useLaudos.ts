import { useState, useEffect } from 'react';
import axios, { AxiosError} from 'axios';
import { type Laudo } from '../types';

const API_URL = 'http://localhost:3333';

export const useLaudoPrevia = (sampleId: string | null, observacoes: string) => {
    const [laudo, setLaudo] = useState<Laudo | null>(null);
    const [loading, setLoading] = useState(false);
    const [erro, setErro] = useState<string | null>(null);

    useEffect(() => {
        if (!sampleId) {
            setLaudo(null);
            return;
        }

        const controller = new AbortController();
        
        const carregar = async () => {
            setLoading(true);
            setErro(null);
            
            try {
                const response = await axios.post<Laudo>(`${API_URL}/reports/previa`, {
                    sampleId,
                    notes: observacoes
                }, {
                    signal: controller.signal
                });

                setLaudo(response.data);
            } catch (err: unknown) {
                if (axios.isCancel(err)) {
                    console.log('Requisição antiga cancelada:', sampleId);
                    return;
                }
                console.error(err);
                const axiosError = err as AxiosError;
                setErro(axiosError.message || 'Erro ao carregar prévia');
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        };

        carregar();

        return () => {
            controller.abort();
        };

    }, [sampleId, observacoes]);

    return { laudo, loading, erro };
};