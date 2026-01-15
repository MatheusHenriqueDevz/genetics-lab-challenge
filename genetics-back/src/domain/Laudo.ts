import { Variante } from './Variante';

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