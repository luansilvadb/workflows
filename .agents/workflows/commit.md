---
name: commit
description: Analisar o estado atual do repositório Git, empacotar as alterações realizadas e documentar a entrega estrutural de forma limpa.
---
* **REQUIRES**
  - Verificar se todos os testes unitários e de integração passaram com sucesso. Abortar imediatamente se houver qualquer falha ativa.
* **TOOLS**
  - `read, bash, glob, question`
* **OBJETIVO:** Validar o progresso final do desenvolvimento, auditar os critérios de qualidade e estruturar a entrega do release de forma profissional.
* **EXECUÇÃO:**
  - Analisar minuciosamente o delta (diff) de arquivos modificados e criados no repositório.
  - Agrupar as mudanças de forma lógica por contexto isolado de responsabilidade.
  - Gerar mensagens de commit padronizadas utilizando a convenção de Conventional Commits (ex: feat:, fix:, chore:).
  - Listar explicitamente novas variáveis de ambiente ou dependências introduzidas no projeto.
  - Validar rigorosamente o Definition of Done (portão obrigatório antes de efetivar o commit):
    - Todos os testes devem estar passando e a cobertura deve ser >= 80% no código alterado.
    - O código deve estar 100% livre de erros de linter ou de análise estática.
    - Todas as funções, métodos e tipos públicos devem estar devidamente documentados.
    - Garantir a total ausência de segredos hardcoded (chaves, senhas) ou vulnerabilidades conhecidas.
    - Certificar-se de que a documentação técnica foi devidamente atualizada.
  - Garantir a auditabilidade via Git Notes, anexando ao commit um resumo contendo o nome da tarefa, arquivos afetados e a justificativa central da mudança.
* **RESTRIÇÕES:**
  - Não assuma ou adicione intenções que vão além do escopo estrito do código alterado.
  - Não agrupe responsabilidades ou contextos distintos em um único commit (mantenha commits atômicos).
  - Não ignore em hipótese alguma os alertas ou avisos emitidos pelo linter.
  - Não prossiga com o commit sem que todos os critérios do Definition of Done tenham sido integralmente satisfeitos.
* **PASSAGEM DE BASTÃO (ROTEAMENTO):**
  - **Sucesso:** Finalizar a entrega com sucesso e concluir o fluxo de trabalho.
  - **Falha:** Se qualquer critério do Definition of Done não for atendido, interromper o processo (PARE) e retornar o motivo detalhado da falha.