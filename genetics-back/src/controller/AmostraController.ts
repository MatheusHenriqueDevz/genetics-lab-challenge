import { FastifyRequest, FastifyReply } from 'fastify';
import { AmostraService } from '../service/AmostraService';

export class AmostraController {
    constructor(private amostraService: AmostraService) {}

    async create(request: FastifyRequest, reply: FastifyReply) {
        try {
            const dados = request.body as any;
            const amostraCriada = await this.amostraService.criarAmostra(dados);
            return reply.status(201).send(amostraCriada);
        } catch (error: any) {
            return reply.status(400).send({ error: error.message });
        }
    }

    async list(request: FastifyRequest, reply: FastifyReply) {
        return await this.amostraService.listarTodas();
    }
}