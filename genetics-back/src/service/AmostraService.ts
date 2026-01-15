import { randomUUID } from 'node:crypto';
import { Amostra } from '../domain/Amostra';
import { Variante, ClassificacaoVariante } from '../domain/Variante';
import { AmostraRepository } from '../repository/AmostraRepository';

interface CriarAmostraDTO {
    name: string;
    variants: {
        id: string;
        gene: string;
        classification: ClassificacaoVariante
    }[];
}

export class AmostraService {
    constructor(private repo: AmostraRepository) {}

    async criarAmostra(dados: CriarAmostraDTO): Promise<Amostra> {
        const variantesProcessadas: Variante[] = [];

        for (const v of dados.variants) {
            const Valido = Object.values(ClassificacaoVariante).includes(v.classification as ClassificacaoVariante);

            if (!Valido) {
                throw new Error(`Classificação inválida: ${v.classification}`);
            }

            variantesProcessadas.push({
                id: v.id,
                gene: v.gene,
                classification: v.classification as ClassificacaoVariante
            });
        }
        const novaAmostra: Amostra = {
            id: randomUUID(),
            name: dados.name,
            variants: variantesProcessadas
        };

        await this.repo.save(novaAmostra);
        return novaAmostra;
    }

    async listarTodas(): Promise<Amostra[]> {
        return this.repo.findAll();
    }
}