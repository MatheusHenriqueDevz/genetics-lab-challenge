import Fastify from 'fastify';
import cors from '@fastify/cors';
import { AmostraService } from './service/AmostraService';
import { LaudoService } from './service/LaudoService';
import { AmostraMemoryRepository } from './repository/AmostraRepository';
import { NotFoundError } from './errors/NotFoundError';

const app = Fastify({ logger: true });

app.register(cors, { 
    origin: true 
});

// INJEÇÃO DE DEPENDÊNCIAS

const repositorio = new AmostraMemoryRepository();

const amostraService = new AmostraService(repositorio);
const laudoService = new LaudoService(repositorio);

// --- ENDPOINTS AMOSTRA ---

app.post('/samples', async (request, reply) => {
    try {
        const dados = request.body as any;
        const amostraCriada = await amostraService.criarAmostra(dados);
        return reply.status(201).send(amostraCriada);
    } catch (error: any) {
        return reply.status(400).send({ error: error.message });
    }
});

app.get('/samples', async (request, reply) => {
    return await amostraService.listarTodas();
});

// --- ENDPOINTS LAUDO ---

// POST/PREVIA
app.post('/reports/previa', async (request, reply) => {
    try {
        const { sampleId, notes } = request.body as { sampleId: string, notes: string };
        
        if (!sampleId) {
            return reply.status(400).send({ error: 'sampleId é obrigatório' });
        }

        const laudo = await laudoService.gerarPrevia(sampleId, notes);
        return reply.send(laudo);

    } catch (error: any) {
        if (error instanceof NotFoundError) {
            return reply.status(404).send({ error: error.message });
        }
        return reply.status(500).send({ error: error.message });
    }
});

app.post('/reports', async (request, reply) => {
    try {
        const { sampleId, notes } = request.body as { sampleId: string, notes: string };
        
        if (!sampleId) {
            return reply.status(400).send({ error: 'sampleId é obrigatório' });
        }

        const laudoSalvo = await laudoService.gerarLaudoFinal(sampleId, notes);
        
        return reply.status(201).send(laudoSalvo);

    } catch (error: any) {
        if (error instanceof NotFoundError) {
            return reply.status(404).send({ error: error.message });
        }
        return reply.status(500).send({ error: error.message });
    }
});

// GET/BUSCAR LAUDO SALVO
app.get('/reports/:sampleId', async (request, reply) => {
    try {
        const { sampleId } = request.params as { sampleId: string };
        
        const laudo = await laudoService.buscarLaudo(sampleId);
        return reply.send(laudo);

    } catch (error: any) {
        if (error instanceof NotFoundError) {
            return reply.status(404).send({ error: error.message });
        }
        return reply.status(500).send({ error: error.message });
    }
});

const start = async () => {
    try {
        await app.listen({ port: 3333 });
        console.log('🚀 Servidor rodando em http://localhost:3333');
    } catch (err) {
        app.log.error(err);
        process.exit(1);
    }
};

start();