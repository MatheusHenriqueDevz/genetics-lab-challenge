export enum ClassificacaoVariante {
    PATOGENICO = 'Patogênico',
    BENIGNO = 'Benigno',
    VUS = 'VUS',
}

export interface Variante {
    id: string;
    gene: string;
    classification: ClassificacaoVariante;
}

/* export class Variante {
    constructor(
        public id: string,
        public gene: string,
        public classificacao: ClassificacaoVariante
    ) {
        if (!this.validarId(id)) {
            throw new Error('Id inválido: ${id}. Formato esperado: chrX-pos-ref-alt')
        }
    }

    private validarId(id: string): boolean {
        const regex = /^chr[0-9XYMT]+-\d+-[ACGTN]+-[ACGTN]+$/;
        return regex.test(id);
    }
}
*/