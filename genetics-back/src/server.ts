import Fastify from 'fastify';
import cors from '@fastify/cors';
import { AmostraMemoryRepository } from './repository/AmostraRepository';
import { AmostraService } from './service/AmostraService';
import { LaudoService } from './service/LaudoService';
import { AmostraController } from './controller/AmostraController';
import { LaudoController } from './controller/LaudoController';

const app = Fastify({ logger: true });

app.register(cors, { origin: true });

// INJEÇÃO DE DEPENDÊNCIA
const repositorio = new AmostraMemoryRepository();
const amostraService = new AmostraService(repositorio);
const laudoService = new LaudoService(repositorio);

const amostraController = new AmostraController(amostraService);
const laudoController = new LaudoController(laudoService);

//ENDPOINTS

// AMOSTRA
app.post('/samples', amostraController.create.bind(amostraController));
app.get('/samples', amostraController.list.bind(amostraController));

// LAUDO
app.post('/reports/previa', laudoController.preview.bind(laudoController));
app.post('/reports', laudoController.create.bind(laudoController));
app.get('/reports/:sampleId', laudoController.get.bind(laudoController));

// MOTOR
    app.get('/', async (request, reply) => {
        return { 
            api: 'Laboratório Genômico', 
            status: 'Online', 
            version: '1.0.0' 
        };
    });
    const start = async () => {
        try {
            await app.listen({ port: 3333 });
            console.log('=========== Servidor rodando em http://localhost:3333 ==============');
        } catch (err) {
            app.log.error(err);
            process.exit(1);
        }
    };

start();