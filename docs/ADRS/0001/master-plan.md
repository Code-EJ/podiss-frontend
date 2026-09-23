# Plano de revisão do frontend

Créditos: oEnzoRibas. Data: 2026-09-21. Escopo autorizado: análise, relatórios, documentação de código, nomes internos em inglês, boas práticas e integração com backend novo. Sem tradução do conteúdo editorial, push ou deploy.

| Etapa | Entrega |
| --- | --- |
| 01 | Inventário e baseline antes das mudanças |
| 02 | Nomenclatura, imports e compatibilidade de URLs |
| 03 | Contratos backend e configuração tipada |
| 04 | Fluxos funcionais, paginação, formulários, imagens e erros |
| 05 | ADRs das decisões adotadas |
| 06 | Desenvolvimento, configuração e deploy estático |
| 07 | Segurança e dependências |
| 08 | TSDoc/JSDoc e autoria |
| 09 | Testes automatizados e integração local |
| 10 | Auditoria final, riscos e histórico de commits |

Relatórios em reports. Migrations/JPA/Flyway são responsabilidades do backend; não inventar equivalentes na SPA. A migration histórica pendente foi resolvida antes desta rodada pela ADR 0007 do backend, sem executar SQL.

Registro de branch: a leitura inicial ocorreu em main. Durante a análise o checkout foi mudado externamente para dev, conforme reflog; a implementação e commits permaneceram em dev. A versão 1.0.0 desse checkout foi preservada.

Fechamento local em 2026-09-22: etapas 01–10 documentadas. Consulte [resultado final](reports/10-final-audit.md) para os 28 testes, integração real local, riscos residuais e gates de homologação/produção. Conclusão local não autoriza publicação automática.
