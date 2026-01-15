import { Amostra } from "../domain/Amostra";
import { Laudo } from "../domain/Laudo";

export interface AmostraRepository {
    save(amostra: Amostra): Promise<void>;
    findAll(): Promise<Amostra[]>;
    findById(id: string): Promise<Amostra | undefined>;
    saveLaudo(laudo: Laudo): Promise<void>;
    findLaudoBySampleId(sampleId: string): Promise<Laudo | undefined>;
}

export class AmostraMemoryRepository implements AmostraRepository{

    private db: Map<string, Amostra> = new Map();

    private laudos: Map<string, Laudo> = new Map();

    async save(amostra: Amostra): Promise<void> {
        this.db.set(amostra.id, amostra);
    }
    async findAll(): Promise<Amostra[]> {
        return Array.from(this.db.values())
    }
    async findById(id: string): Promise<Amostra | undefined> {
        return this.db.get(id);
    }

    async saveLaudo(laudo: Laudo): Promise<void> {
        this.laudos.set(laudo.sampleId, laudo);
    }

    async findLaudoBySampleId(sampleId: string): Promise<Laudo | undefined> {
        return this.laudos.get(sampleId);
    }
}

// Usei o Promise e Async pra caso futuramente a gente queira trocar para um banco de dados real.