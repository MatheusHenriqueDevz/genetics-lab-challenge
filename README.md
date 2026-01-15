# Laboratory of Genetics & Molecular Cardiology - Desafio Técnico

Este projeto é uma aplicação Full Stack desenvolvida como parte do processo seletivo para a bolsa de desenvolvimento. O sistema gerencia amostras genômicas, permitindo a criação, listagem e geração de laudos médicos (Prévias e Finais) com análise de variantes.

## 🚀 Tecnologias Utilizadas

### Backend (Porta 3333)
- **Node.js** (v22+): Ambiente de execução JavaScript.
- **Fastify**: Framework web focado em performance e baixo overhead.
- **TypeScript**: Tipagem estática para maior robustez e manutenibilidade.
- **UUID**: Geração de identificadores únicos universais para amostras e variantes.
- **Arquitetura**: Separação clara em Camadas (Service, Repository, Controller).
- **Persistência**: In-Memory (Map) conforme solicitado no desafio.

### Frontend (Porta 5173)
- **React (Vite)**: Build tool moderna para desenvolvimento ágil.
- **TypeScript**: Segurança de tipos nos componentes e integrações.
- **Axios**: Cliente HTTP para comunicação com a API.
- **CSS Modules**: Estilização limpa, organizada e responsiva (Layout Master-Detail).

## ⚙️ Funcionalidades Implementadas

1.  **Gestão de Amostras**:
    * Criação de amostras com gerador de dados aleatórios (Genes e Classificações).
    * Listagem de amostras cadastradas.
2.  **Geração de Laudos**:
    * **Prévia**: Cálculo estatístico de variantes (Patogênicas, Benignas, VUS) em tempo real.
    * **Persistência**: Funcionalidade para salvar o laudo final no sistema.
3.  **Visualização de Laudos Salvos**:
    * Recuperação automática de laudos previamente gerados ao selecionar uma amostra na lista.
4.  **UX/UI (Experiência do Usuário)**:
    * Interface de "Tela Única" com lista lateral e detalhes ao centro.
    * Feedback visual de carregamento (Loading states).
    * Prevenção de *Race Conditions* (Requisições antigas canceladas automaticamente).

## 🛠️ Como Rodar o Projeto

Pré-requisito: Tenha o **Node.js** instalado em sua máquina.

### 1. Clonar o repositório

    git clone <URL_DO_SEU_REPOSITORIO_AQUI>
    cd <NOME_DA_PASTA>

### 2. Iniciar o Backend
Abra um terminal, navegue até a pasta do backend e rode:

    cd genetics-back
    npm install
    npm run dev

*O servidor iniciará em `http://localhost:3333`*

### 3. Iniciar o Frontend
Abra **outro** terminal, navegue até a pasta do frontend e rode:

    cd genetics-front
    npm install
    npm run dev

*Acesse a aplicação no navegador em `http://localhost:5173`*

## 🧠 Decisões Técnicas e Arquiteturais

* **AbortController (Frontend)**: Implementado no hook de consumo da API para cancelar requisições "stale" (antigas) caso o usuário troque de amostra rapidamente. Isso atende ao requisito crítico de consistência de estado.
* **Repository Pattern (Backend)**: O acesso aos dados foi abstraído em uma camada de repositório (`AmostraRepository`). Isso facilita testes e permite uma futura migração de "Memória" para um banco SQL real (como PostgreSQL) sem quebrar as regras de negócio.
* **Tipagem Estrita**: O uso de `any` foi estritamente evitado. Interfaces como `Laudo`, `Amostra` e `Variante` são compartilhadas para garantir contratos sólidos entre Front e Back.

---
**Desenvolvido por Matheus.**