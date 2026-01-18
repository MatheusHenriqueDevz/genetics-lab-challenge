import { FastifyRequest, FastifyReply } from 'fastify';
import { LaudoService } from '../service/LaudoService';
import { NotFoundError } from '../errors/NotFoundError';

export class LaudoController {
    constructor(private laudoService: LaudoService) {}

    async preview(request: FastifyRequest, reply: FastifyReply) {
        try {
            const { sampleId, notes } = request.body as { sampleId: string, notes: string };
            
            if (!sampleId) {
                return reply.status(400).send({ error: 'sampleId é obrigatório' });
            }

            const laudo = await this.laudoService.gerarPrevia(sampleId, notes);
            return reply.send(laudo);

        } catch (error: any) {
            if (error instanceof NotFoundError) {
                return reply.status(404).send({ error: error.message });
            }
            return reply.status(500).send({ error: error.message });
        }
    }

    async create(request: FastifyRequest, reply: FastifyReply) {
        try {
            const { sampleId, notes } = request.body as { sampleId: string, notes: string };
            
            if (!sampleId) {
                return reply.status(400).send({ error: 'sampleId é obrigatório' });
            }

            const laudoSalvo = await this.laudoService.gerarLaudoFinal(sampleId, notes);
            return reply.status(201).send(laudoSalvo);

        } catch (error: any) {
            if (error instanceof NotFoundError) {
                return reply.status(404).send({ error: error.message });
            }
            return reply.status(500).send({ error: error.message });
        }
    }

    async get(request: FastifyRequest, reply: FastifyReply) {
        try {
            const { sampleId } = request.params as { sampleId: string };
            
            const laudo = await this.laudoService.buscarLaudo(sampleId);
            return reply.send(laudo);

        } catch (error: any) {
            if (error instanceof NotFoundError) {
                return reply.status(404).send({ error: error.message });
            }
            return reply.status(500).send({ error: error.message });
        }
    }
}