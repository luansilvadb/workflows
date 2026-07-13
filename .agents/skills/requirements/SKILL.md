---
name: requirements
description: Extrair a intenção do usuário, criar regras de negócio binárias e desenhar a topologia do sistema (interfaces, structs, schemas).
---
* **REQUIRES**
  - Exigir um prompt com a descrição da funcionalidade. `question` se estiver vazio.
* **OBJETIVO:** Transformar a intenção do usuário em regras de negócio claras e desenhar a topologia estrutural do sistema através de interfaces limpas.
* **EXECUÇÃO:**
  - Avaliar detalhadamente o escopo fornecido em `$ARGUMENTS`.
  - Pesquisar padrões arquiteturais e conformidades técnicas relevantes utilizando a ferramenta `web_search`.
  - Mapear de forma precisa todos os atores, entidades e fluxos do sistema.
  - Criar regras de negócio binárias (Sim/Não) e definir claramente os critérios de aceite.
  - Listar explicitamente todos os itens e funcionalidades que estão fora de escopo.
  - Gerar o documento de requisitos estruturado em `.docs/requirements/req_{timestamp}.md`.
  - Desenhar as interfaces do sistema baseando-se estritamente nas regras mapeadas.
  - Gerar as structs, métodos e schemas necessários, utilizando nomenclatura clara e semântica.
  - Gerar o documento de design estruturado em `.docs/design/design_{timestamp}.md`.
* **RESTRIÇÕES:**
  - Não inclua nenhum código de implementação (forneça apenas interfaces, assinaturas e blocos vazios).
  - Não utilize padrões genéricos ou modelos acoplados de banco de dados (DB).
  - Não adicione comentários em linguagem natural dentro dos blocos de código gerados.
* **PASSAGEM DE BASTÃO (ROTEAMENTO):**
  - **Sucesso:** Executar a rota `/code`.
  - **Falha:** Interromper o processo e solicitar esclarecimentos adicionais caso o prompt seja ambíguo ou incompleto.