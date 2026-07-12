# 🤖 Gerenciador de Workflows de Agentes

Este repositório contém a configuração e os scripts de gerenciamento de workflows orientados a papéis executados por agentes inteligentes. Cada agente possui um escopo delimitado e um fluxo sequencial de passagem de bastão, garantindo consistência, qualidade e rastreabilidade no ciclo de desenvolvimento de software.

O projeto utiliza o paradigma **Design by Contract (Design por Contrato)**, onde os requisitos e testes ditam a implementação.

---

## 🔄 Fluxo de Trabalho (Pipeline)

Abaixo está o ciclo de vida sequencial de passagem de bastão (handoff) dos agentes inteligentes:

```mermaid
graph TD
    REQ[/requirements] -->|Sucesso| CODE[/code]
    CODE -->|Sucesso| TEST[/test]
    CODE -->|Falha| REQ
    TEST -->|Sucesso| COMMIT[/commit]
    TEST -->|Falha 1ª e 2ª vez| CODE
    TEST -->|Falha persistente 3ª vez| EXPLORE[/explore]
    EXPLORE -->|Erro de Contrato| REQ
    EXPLORE -->|Erro de Lógica| CODE
```

---

## 🛠️ Workflows Disponíveis

### 1. 📋 [Requirements](file:///d:/gen/.agents/workflows/requirements.md) (`/requirements`)
* **Objetivo:** Extrair a intenção do usuário, criar regras de negócio binárias e desenhar a topologia do sistema (interfaces, structs, schemas).
* **Entregáveis:** 
  * Requisitos em `.docs/requirements/req_{timestamp}.md`
  * Design em `.docs/design/design_{timestamp}.md`
* **Próxima etapa:** `/code` (Sucesso).

### 2. 💻 [Code](file:///d:/gen/.agents/workflows/code.md) (`/code`)
* **Objetivo:** Implementar a lógica de negócios respeitando estritamente os contratos arquiteturais e interfaces fornecidas.
* **Restrição:** Proibido alterar assinaturas de métodos ou tipos pré-definidos.
* **Próxima etapa:** `/test` (Sucesso).

### 3. 🧪 [Test](file:///d:/gen/.agents/workflows/test.md) (`/test`)
* **Objetivo:** Escrever cenários de teste abrangentes e executar validações rigorosas de qualidade e cobertura de código (mínimo de 80%).
* **Próxima etapa:** `/commit` (Sucesso) ou `/code --fix` (Falha). Caso falhe 2 vezes consecutivas, aciona `/explore`.

### 4. 🔍 [Explore](file:///d:/gen/.agents/workflows/explore.md) (`/explore`)
* **Objetivo:** Atuar na análise de causa raiz (RCA - Root Cause Analysis), identificando a origem de falhas complexas através de logs e direcionando o fluxo para correção.
* **Roteamento:** `/requirements` (se erro arquitetural/requisito) ou `/code` (se erro de lógica/sintaxe).

### 5. 🚀 [Commit](file:///d:/gen/.agents/workflows/commit.md) (`/commit`)
* **Objetivo:** Analisar o estado atual do repositório Git, empacotar as alterações realizadas e documentar a entrega estrutural de forma limpa seguindo *Conventional Commits*.
* **Validação:** Garante o cumprimento do *Definition of Done (DoD)*.

---

## ⌨️ Comandos e Uso no Chat

Para invocar as rotas de workflow no chat com os agentes inteligentes, utilize as seguintes barras de comando:

* `/requirements` - Inicia a análise de requisitos.
* `/code` - Solicita a implementação do código baseado nas especificações.
* `/test` - Executa e valida a suite de testes.
* `/explore` - Inicia a análise de RCA sobre falhas nos logs.
* `/commit` - Consolida o desenvolvimento e realiza o commit padronizado.
