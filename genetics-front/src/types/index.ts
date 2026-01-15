export const ClassificacaoVariante = {
    PATOGENICO: 'Patogênico',
    BENIGNO: 'Benigno',
    VUS: 'VUS',
} as const; 

export type ClassificacaoVariante = typeof ClassificacaoVariante[keyof typeof ClassificacaoVariante];

export interface Variante {
    id: string;
    gene: string;
    classification: ClassificacaoVariante;
}

export interface Laudo {
    sampleId: string;
    summary: string;
    statistics: {
        pathogenic: number;
        benign: number;
        vus: number;
    };
    highlightedVariants: Variante[];
    notes: string;
    generatedAt: string;
}