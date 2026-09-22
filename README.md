# PodIss Frontend

SPA React + TypeScript integrada ao backend Spring Boot. Conteúdo das páginas em português; código e contratos internos padronizados em inglês. Créditos desta revisão: **oEnzoRibas**.

## Rodar localmente

Pré-requisitos: Node >=22.12 (ambiente validado Node 24), npm e backend Docker ativo em http://localhost:18080.

Na pasta do backend, no PowerShell:

```powershell
.\scripts\dev.ps1 Up
```

No Git Bash, use o comando Docker do [tutorial completo](docs/development/README.md); não execute .ps1 diretamente no Bash.

Na pasta deste frontend, em qualquer um dos dois terminais:

```sh
npm ci
npm run dev
```

Abra http://localhost:5173. A URL local já está em .env.development, sem segredos. O arquivo .env.dev com senhas pertence **somente ao backend**. Veja a [precedência de configuração](docs/configuration/README.md).

## Login e banco

Acesse /admin/login com dev_admin e a senha DEV_ADMIN_PASSWORD do backend/.env.dev. Não há cadastro público; criação de usuários adicionais é operação ADMIN no backend. O bootstrap não troca senha de usuário existente.

O [passo a passo de desenvolvimento](docs/development/README.md) explica como enviar contato/sugestão, criar posts e conferir os registros por SQL no MariaDB local. O frontend nunca recebe credenciais do banco ou VPS.

## Testar

```sh
npm run check
npm audit
npm run test:integration
```

check executa lint, testes e build. Integração é opt-in e exige backend local: cria um contato e sugestão sintéticos e remove seu post temporário. Não usa produção. Consulte o [relatório final](docs/ADRS/0001/reports/10-final-audit.md) para cobertura e riscos residuais.

## Publicar

npm run build gera dist. VITE_API_URL precisa conter a URL HTTPS real confirmada antes do build. Não publicar .env, src ou node_modules. Siga o [procedimento de deploy/backup/rollback](docs/deployment/README.md); esta revisão não publicou na Hostinger.

## Documentação

[Índice](docs/README.md) · [Contratos HTTP](docs/api/README.md) · [Plano e relatórios](docs/ADRS/0001/master-plan.md)

Componentes, hooks e helpers possuem comentários TSDoc e créditos @author oEnzoRibas, preservando os direitos e créditos originais abaixo.

## Contributing

This repository is maintained by Code Soluções em Tecnologia Júnior.

Access to the source code does not grant permission to copy, modify, distribute, sublicense, publish, or otherwise use the software outside the scope expressly authorized by Code Soluções em Tecnologia Júnior or the applicable project agreement.

Contributions must follow the project's development standards and may require prior authorization from the project maintainers.

## License

This project is proprietary software.

Unauthorized use, reproduction, distribution, or modification is prohibited.

See the [LICENSE](LICENSE) file for the applicable terms.

## Maintainers

**Code Soluções em Tecnologia Júnior**

Enzo Rocha Leite Diniz Ribas - Developer, Tech Lead, and Chief Information and Technology Officer.
