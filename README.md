# Gerenciador de Workflows de Agentes

Este repositório contém a configuração e os scripts de gerenciamento de workflows orientados a papéis executados por agentes inteligentes. Cada agente possui um escopo delimitado e um fluxo sequencial de passagem de bastão, garantindo consistência, qualidade e rastreabilidade no ciclo de desenvolvimento de software.

## Descrição do Projeto

O projeto visa gerenciar o ciclo de vida do desenvolvimento de software utilizando agentes especializados que atuam sob o paradigma "Design by Contract" (Design por Contrato). O processo começa com a análise conceitual de requisitos, passa pelo desenho arquitetural e contratos vazios, segue para a implementação limpa e testes rigorosos, e finaliza com a geração de commits padronizados ou investigação e roteamento de falhas.

## Workflows Disponíveis

O sistema é composto por 6 workflows principais documentados e configurados na pasta `.agents/workflows`:

*   **Req ([req.md](file:///d:/gen/.agents/workflows/req.md)):** Responsável pela análise e modelagem de domínio conceitual. Mapeia atores, entidades, regras de negócio binárias e critérios de aceite.
*   **Design ([design.md](file:///d:/gen/.agents/workflows/design.md)):** Responsável pela definição das interfaces, schemas, structs e assinaturas do sistema, sem a implementação da lógica.
*   **Code ([code.md](file:///d:/gen/.agents/workflows/code.md)):** Responsável pela implementação da lógica de negócios satisfazendo estritamente as interfaces criadas pela fase de design.
*   **Test ([test.md](file:///d:/gen/.agents/workflows/test.md)):** Responsável pela escrita de testes automatizados e validações de qualidade (linters e análises estáticas).
*   **Explore ([explore.md](file:///d:/gen/.agents/workflows/explore.md)):** Responsável pelo diagnóstico e análise de causa raiz (RCA) caso ocorram incidentes ou falhas de execução.
*   **Commit ([commit.md](file:///d:/gen/.agents/workflows/commit.md)):** Responsável por consolidar as alterações, analisar o diff e criar uma mensagem de release no padrão Semantic/Conventional Commits.

## Comandos e Uso

*   **`/req`**: Inicia a extração de requisitos a partir de uma funcionalidade descrita. Exige uma especificação textual de entrada.
*   **`/design`**: Desenha a topologia do sistema e cria os arquivos de interface/contrato. Exige aprovação prévia do `/req`.
*   **`/code`**: Codifica as regras de negócio de acordo com a interface do design. Exige a existência do esqueleto gerado pelo `/design`.
*   **`/test`**: Escreve e executa testes rigorosos. Exige que a implementação do `/code` esteja concluída.
*   **`/explore`**: Investigador de causa raiz para falhas de compilação ou falhas de teste. Só deve ser acionado caso ocorram problemas reais.
*   **`/commit`**: Realiza o commit do progresso e empacota o release. Exige que todas as verificações do `/test` passem sem erros.
