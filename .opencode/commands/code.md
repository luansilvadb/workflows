---
name: code
description: Implementar a lógica de negócios respeitando estritamente os contratos arquiteturais e interfaces fornecidas.
---
* **Requires**
  - Identificar a existência de interfaces ou structs válidas no contexto. Abortar se não existirem ou se as definições não forem claras.
* **Tools**
  - [read, write, edit, glob, grep, question]
* **OBJETIVO:** 
  - Implementar a lógica de negócios de forma robusta, respeitando estritamente os contratos arquiteturais definidos na etapa anterior.
* **EXECUÇÃO:**
  - Implementar a lógica de negócios seguindo rigorosamente as especificações contidas em $ARGUMENTS.
  - Desenvolver o código-fonte garantindo que esteja devidamente formatado e alinhado aos padrões do projeto.
  - Retornar única e exclusivamente o código-fonte implementado e limpo.
* **RESTRIÇÕES:**
  - Não altere nomes de funções, assinaturas de métodos ou tipos pré-definidos nos contratos arquiteturais.
  - Extraia blocos de código com mais de 3 níveis de aninhamento para funções privadas dedicadas.
  - Não adicione comentários explicativos ou redundantes no corpo das funções.
* **PASSAGEM DE BASTÃO (ROTEAMENTO):**
  - **Sucesso:** Executar a rota `/test`.
  - **Falha:** Se a implementação divergir das especificações de `.docs/design/`, interromper a execução e chamar `/requirements --update` detalhando as divergências encontradas.