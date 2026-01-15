import { Laudo } from '../domain/Laudo';
import { ClassificacaoVariante } from '../domain/Variante';
import { AmostraRepository } from '../repository/AmostraRepository';
import { NotFoundError } from '../errors/NotFoundError';

export class LaudoService {
    constructor(private readonly amostraRepo: AmostraRepository) {}

    async gerarPrevia(sampleId: string, observacoes: string = ''): Promise<Laudo> {

        const amostra = await this.amostraRepo.findById(sampleId);

        if(!amostra) {
            throw new NotFoundError(`Amostra com id ${sampleId} não encontrada.`);
        }

        let patogenico = 0;
        let benigno = 0;
        let vus = 0;
        const destaque = [];

        for (const v of amostra.variants) {
            if (v.classification === ClassificacaoVariante.PATOGENICO){
                patogenico++;
                destaque.push(v);
            } else if (v.classification === ClassificacaoVariante.BENIGNO){
                benigno++;
            } else if(v.classification === ClassificacaoVariante.VUS){
                vus++;
                destaque.push(v);
            }
        }

        const resumo = `Foram encontradas ${amostra.variants.length} variantes: ${patogenico} Patogênicas, ${benigno} Benignas e ${vus} VUS.`;

        return {
            sampleId: amostra.id,
            summary: resumo,
            statistics: {
                pathogenic: patogenico,
                benign: benigno,
                vus: vus
            },
            highlightedVariants: destaque,
            notes: observacoes,
            generatedAt: new Date().toISOString()
        };
    }

    async gerarLaudoFinal(sampleId: string, observacoes: string): Promise<Laudo> {
        const laudo = await this.gerarPrevia(sampleId, observacoes);
        await this.amostraRepo.saveLaudo(laudo);
        return laudo;
    }

    async buscarLaudo(sampleId: string): Promise<Laudo> {
        const laudo = await this.amostraRepo.findLaudoBySampleId(sampleId);

        if (!laudo) {
            throw new NotFoundError(`Laudo para amostra com id ${sampleId} não encontrado.`);
        }

        return laudo;
    }
}