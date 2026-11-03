# Loja API

API REST para gerenciamento de uma loja virtual, desenvolvida com NestJS, TypeORM e PostgreSQL. O projeto possui funcionalidades de gerenciamento de produtos, pedidos, usuários, endereços, pagamentos e categorias.

Este projeto foi desenvolvido como atividade acadêmica, contemplando os pacotes **Endereços**, **Pagamento fake** e **Categorias (Catálogo rico)**, com autenticação, controle de acesso, regras de negócio e documentação Swagger.

---

## 1. Tecnologias utilizadas

- **Node.js** — ambiente de execução.
- **NestJS** — framework para desenvolvimento da API.
- **TypeScript** — linguagem de programação.
- **TypeORM** — ORM para comunicação com o banco de dados.
- **PostgreSQL** — banco de dados relacional.
- **JWT** — autenticação dos usuários.
- **class-validator** — validação dos dados recebidos.
- **Swagger** — documentação e testes das rotas.
- **Postman** — ferramenta utilizada para testar as requisições.

---

## 2. Instalação e execução

### Pré-requisitos

- Node.js instalado.
- PostgreSQL instalado e em execução.
- npm instalado.

### Clonar o repositório

```bash
git clone https://github.com/leoxLF/loja-api.git
```

Acessar a pasta:

```bash
cd loja-api
```

Instalar as dependências:

```bash
npm install
```

### Configuração do banco de dados

Crie um banco de dados PostgreSQL e configure as variáveis de ambiente no arquivo `.env`.

Exemplo:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=loja
DB_PASSWORD=sua_senha
DB_DATABASE=loja_api
```

**Importante:** utilize os mesmos nomes de variáveis definidos na configuração do TypeORM do projeto. Não compartilhe o arquivo `.env` com senhas reais.

### Executar a aplicação

```bash
npm run start:dev
```

A API será iniciada na porta configurada no projeto.

### Documentação Swagger

Após iniciar a aplicação, acesse:

```text
http://localhost:3000/api
```

O Swagger permite visualizar as rotas, consultar os parâmetros, preencher os corpos das requisições e executar chamadas à API.

---

## 3. Autenticação e controle de acesso

A API utiliza autenticação JWT para identificar os usuários e controlar o acesso aos recursos.

Após realizar o login, o usuário recebe um token que deve ser enviado no cabeçalho das requisições protegidas:

```http
Authorization: Bearer SEU_TOKEN
```

### Perfis de acesso

| Perfil | Permissões |
|---|---|
| ADMIN | Gerenciar categorias, associar produtos a categorias e executar operações administrativas. |
| CLIENT | Consultar categorias e produtos, gerenciar os próprios endereços e acessar seus pagamentos e pedidos conforme as regras de negócio. |

### Respostas de autenticação e autorização

| Código HTTP | Significado |
|---|---|
| 200 | Requisição realizada com sucesso. |
| 201 | Recurso criado com sucesso. |
| 204 | Requisição realizada sem conteúdo de resposta. |
| 400 | Dados inválidos ou operação não permitida. |
| 401 | Usuário não autenticado. |
| 403 | Usuário autenticado, mas sem permissão para realizar a operação. |
| 404 | Recurso não encontrado. |

---

# 4. Pacote Endereços

## 4.1 Objetivo

Permitir que os clientes cadastrem e gerenciem seus próprios endereços, além de associar um endereço a um pedido.

## 4.2 Histórias de usuário

- **US-E1:** O cliente pode cadastrar um endereço.
- **US-E2:** O cliente pode consultar seus endereços.
- **US-E3:** O cliente pode atualizar seus próprios endereços.
- **US-E4:** O cliente pode excluir seus próprios endereços.
- **US-E5:** O cliente pode associar um endereço a um pedido.

## 4.3 Regras de negócio

1. Todas as operações de endereço exigem autenticação.
2. O cliente somente pode consultar os próprios endereços.
3. O cliente somente pode atualizar os próprios endereços.
4. O cliente somente pode excluir os próprios endereços.
5. O `userId` do endereço deve ser obtido a partir do usuário autenticado, e não informado livremente no corpo da requisição.
6. Para associar um endereço a um pedido, o pedido e o endereço devem pertencer ao mesmo usuário.
7. Um usuário não pode associar a um pedido um endereço pertencente a outra pessoa.

## 4.4 Rotas

| Método | Rota | Descrição | Autenticação |
|---|---|---|---|
| POST | `/addresses` | Cadastrar endereço | JWT |
| GET | `/addresses` | Listar os próprios endereços | JWT |
| PUT | `/addresses/:id` | Atualizar endereço | JWT |
| DELETE | `/addresses/:id` | Excluir endereço | JWT |
| PATCH | `/orders/:id/address` | Associar endereço ao pedido | JWT |

## 4.5 Exemplos de requisições

**Cadastrar endereço**

```bash
curl -X POST http://localhost:3000/addresses \
  -H "Authorization: Bearer SEU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{ ... }'
```

O corpo deve conter os campos definidos no `CreateAddressDto`.

**Listar endereços**

```bash
curl -X GET http://localhost:3000/addresses \
  -H "Authorization: Bearer SEU_TOKEN"
```

**Atualizar endereço**

```bash
curl -X PUT http://localhost:3000/addresses/1 \
  -H "Authorization: Bearer SEU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{ ... }'
```

O corpo deve conter os campos definidos no DTO de atualização.

**Excluir endereço**

```bash
curl -X DELETE http://localhost:3000/addresses/1 \
  -H "Authorization: Bearer SEU_TOKEN"
```

**Associar endereço a um pedido**

```bash
curl -X PATCH http://localhost:3000/orders/1/address \
  -H "Authorization: Bearer SEU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "addressId": 1
  }'
```

---

# 5. Pacote Pagamento fake

## 5.1 Objetivo

Implementar um sistema simulado de pagamentos, permitindo criar pagamentos para pedidos, consultar pagamentos, atualizar seus status e excluir registros.

O pacote não realiza transações financeiras reais. Ele simula o fluxo de pagamento e a atualização do estado dos pedidos.

## 5.2 Regras de negócio

1. O cliente somente pode criar pagamentos para seus próprios pedidos.
2. Somente pedidos com status `OPEN` podem receber pagamentos.
3. Um pedido não pode possuir mais de um pagamento ativo.
4. Os pagamentos são criados com status inicial `PENDING`.
5. Os métodos de pagamento permitidos são `CARD`, `BOLETO` e `PIX`.
6. Os status permitidos são `PENDING`, `PAID` e `CANCELLED`.
7. Somente pagamentos com status `PENDING` podem ser atualizados.
8. Um pagamento `PENDING` pode passar para `PAID` ou `CANCELLED`.
9. Quando um pagamento passa para `PAID`, o pedido correspondente também passa para `PAID`.
10. Somente o proprietário do pedido ou um ADMIN pode atualizar o status do pagamento.
11. Clientes somente podem visualizar seus próprios pagamentos.
12. Administradores podem visualizar todos os pagamentos.
13. Somente ADMIN pode excluir pagamentos.

## 5.3 Métodos de pagamento

| Método | Descrição |
|---|---|
| CARD | Cartão |
| BOLETO | Boleto bancário |
| PIX | Pix |

## 5.4 Status dos pagamentos

| Status | Descrição |
|---|---|
| PENDING | Pagamento aguardando confirmação. |
| PAID | Pagamento confirmado. |
| CANCELLED | Pagamento cancelado. |

### Fluxo de atualização

```text
PENDING
   |
   |------------------|
   v                  v
 PAID              CANCELLED
   |
   v
Pedido passa para PAID
```

## 5.5 Rotas

| Método | Rota | Descrição | Permissão |
|---|---|---|---|
| POST | `/orders/:id/payments` | Criar pagamento para um pedido | JWT |
| GET | `/payments` | Listar pagamentos | JWT |
| PATCH | `/payments/:id/status` | Atualizar status do pagamento | JWT |
| DELETE | `/payments/:id` | Excluir pagamento | ADMIN |

## 5.6 Exemplos de requisições

**Criar pagamento**

```bash
curl -X POST http://localhost:3000/orders/1/payments \
  -H "Authorization: Bearer SEU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "method": "PIX"
  }'
```

**Listar pagamentos**

```bash
curl -X GET http://localhost:3000/payments \
  -H "Authorization: Bearer SEU_TOKEN"
```

O resultado depende do perfil autenticado:

- CLIENT recebe somente os pagamentos dos próprios pedidos.
- ADMIN recebe todos os pagamentos.

**Confirmar pagamento**

```bash
curl -X PATCH http://localhost:3000/payments/1/status \
  -H "Authorization: Bearer SEU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "PAID"
  }'
```

**Cancelar pagamento**

```bash
curl -X PATCH http://localhost:3000/payments/1/status \
  -H "Authorization: Bearer SEU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "CANCELLED"
  }'
```

**Excluir pagamento**

```bash
curl -X DELETE http://localhost:3000/payments/1 \
  -H "Authorization: Bearer TOKEN_ADMIN"
```

A exclusão está disponível somente para administradores.

---

# 6. Pacote Categorias (Catálogo rico)

## 6.1 Objetivo

Permitir o gerenciamento de categorias de produtos, possibilitando organizar o catálogo da loja e associar produtos às categorias cadastradas.

## 6.2 Histórias de usuário

- **US-C1:** O ADMIN pode realizar o CRUD de categorias.
- **US-C2:** O CLIENT pode visualizar categorias e produtos.
- **US-C3:** O ADMIN pode associar um produto a uma categoria.
- **US-C4:** O CLIENT não pode modificar categorias.

## 6.3 Regras de negócio

1. Somente ADMIN pode criar categorias.
2. Somente ADMIN pode atualizar categorias.
3. Somente ADMIN pode excluir categorias.
4. ADMIN pode associar produtos às categorias.
5. CLIENT pode consultar as categorias cadastradas.
6. CLIENT pode consultar os produtos associados às categorias.
7. CLIENT não pode criar, atualizar ou excluir categorias.
8. Uma categoria pode possuir vários produtos.
9. Um produto pode ser associado a uma categoria.
10. O ID da categoria é gerado automaticamente pelo banco de dados.

## 6.4 Tipos de categoria

Os tipos de categoria utilizados são:

- `CAMISA`
- `ACTION FIGURE`

## 6.5 Rotas

| Método | Rota | Descrição | Permissão |
|---|---|---|---|
| POST | `/categories` | Criar categoria | ADMIN |
| GET | `/categories` | Listar categorias | JWT |
| GET | `/categories/:id` | Consultar categoria por ID | JWT |
| GET | `/categories/:id/products` | Listar produtos de uma categoria | JWT |
| PUT | `/categories/:id` | Atualizar categoria | ADMIN |
| DELETE | `/categories/:id` | Excluir categoria | ADMIN |
| PATCH | `/products/:id/category` | Associar categoria a um produto | ADMIN |

## 6.6 Exemplos de requisições

**Criar categoria**

```bash
curl -X POST http://localhost:3000/categories \
  -H "Authorization: Bearer TOKEN_ADMIN" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "CAMISA"
  }'
```

**Listar categorias**

```bash
curl -X GET http://localhost:3000/categories \
  -H "Authorization: Bearer SEU_TOKEN"
```

**Consultar categoria por ID**

```bash
curl -X GET http://localhost:3000/categories/1 \
  -H "Authorization: Bearer SEU_TOKEN"
```

**Listar produtos de uma categoria**

```bash
curl -X GET http://localhost:3000/categories/1/products \
  -H "Authorization: Bearer SEU_TOKEN"
```

**Atualizar categoria**

```bash
curl -X PUT http://localhost:3000/categories/1 \
  -H "Authorization: Bearer TOKEN_ADMIN" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "ACTION FIGURE"
  }'
```

**Excluir categoria**

```bash
curl -X DELETE http://localhost:3000/categories/1 \
  -H "Authorization: Bearer TOKEN_ADMIN"
```

**Associar categoria a um produto**

```bash
curl -X PATCH http://localhost:3000/products/1/category \
  -H "Authorization: Bearer TOKEN_ADMIN" \
  -H "Content-Type: application/json" \
  -d '{
    "categoryId": 1
  }'
```

---

# 7. Documentação Swagger

A documentação interativa da API está disponível por meio do Swagger.

Após iniciar a aplicação, acesse:

```text
http://localhost:3000/api
```

O Swagger apresenta:

- Rotas disponíveis.
- Métodos HTTP.
- Descrição das operações.
- Parâmetros de rota.
- Corpos das requisições.
- Exemplos e valores permitidos nos DTOs.
- Respostas HTTP documentadas.
- Autenticação Bearer JWT.

Para testar rotas protegidas:

1. Realize o login e obtenha um token JWT.
2. Abra o Swagger.
3. Clique em **Authorize**.
4. Informe o token.
5. Execute a operação desejada.

---

# 8. Estrutura dos módulos

O projeto utiliza a arquitetura modular do NestJS, separando as responsabilidades da aplicação.

```text
src/
├── auth/
├── products/
├── orders/
├── addresses/
├── payments/
├── categories/
├── app.module.ts
└── main.ts
```

### Responsabilidades

| Módulo | Responsabilidade |
|---|---|
| Auth | Autenticação e autorização dos usuários. |
| Products | Cadastro, consulta, atualização e exclusão de produtos. |
| Orders | Gerenciamento dos pedidos. |
| Addresses | Gerenciamento dos endereços dos clientes. |
| Payments | Simulação e gerenciamento dos pagamentos. |
| Categories | Gerenciamento das categorias e associação aos produtos. |

Cada módulo utiliza controllers para receber requisições HTTP e services para implementar as regras de negócio. O TypeORM realiza a comunicação com o PostgreSQL por meio das entidades e repositórios.

---

# 9. Testes realizados

Durante o desenvolvimento, foram realizados testes das funcionalidades por meio do Postman.

### Endereços

- Cadastro de endereço.
- Consulta dos próprios endereços.
- Atualização de endereço.
- Exclusão de endereço.
- Associação de endereço a pedido.
- Verificação de propriedade entre endereço e pedido.

### Pagamentos

- Criação de pagamento.
- Listagem de pagamentos.
- Confirmação de pagamento.
- Cancelamento de pagamento.
- Atualização do status do pedido após confirmação.
- Bloqueio de atualização por usuários sem permissão.
- Exclusão de pagamento por ADMIN.

### Categorias

- Criação de categoria.
- Listagem de categorias.
- Consulta por ID.
- Atualização de categoria.
- Exclusão de categoria.
- Associação de categoria a produto.
- Listagem de produtos por categoria.
- Bloqueio das operações administrativas para CLIENT.

---

# 10. Considerações finais

A implementação dos pacotes Endereços, Pagamento fake e Categorias amplia as funcionalidades da API da loja virtual.

O desenvolvimento contempla separação de responsabilidades por módulos, persistência de dados com PostgreSQL e TypeORM, autenticação JWT, controle de permissões por perfil, validação de entradas e documentação das rotas por meio do Swagger.

As funcionalidades foram testadas com requisições HTTP utilizando o Postman, verificando os principais fluxos de operação e as restrições de acesso estabelecidas pelas regras de negócio.
