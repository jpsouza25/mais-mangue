# CRUD Simples em Python

Aplicação web de gerenciamento de usuários desenvolvida com **Flask** e **SQLite**. Permite cadastrar, listar, editar e deletar usuários por meio de uma interface web com autenticação por sessão. Também possui uma interface de linha de comando (CLI) para operações diretas no banco.

## Funcionalidades

- Cadastro e login de usuários com autenticação por sessão
- Senhas armazenadas com hash PBKDF2-SHA256 + salt
- CRUD completo: criar, listar, editar e deletar usuários
- Interface web responsiva (Flask + Jinja2)
- Interface CLI interativa via terminal

## Tecnologias

- Python 3.10+
- Flask
- SQLite3 (embutido no Python, sem instalação extra)

## Estrutura do Projeto

```
.
├── app.py           # Servidor Flask e rotas da API REST
├── crud.py          # Lógica de banco de dados e menu CLI
├── requirements.txt # Dependências do projeto
└── templates/
    ├── login.html   # Página de login/cadastro
    └── admin.html   # Painel de gerenciamento de usuários
```

## Instalação e Configuração

### 1. Pré-requisitos

- Python 3.10 ou superior instalado
- pip (gerenciador de pacotes do Python)

### 2. Clone o repositório

```bash
git clone https://github.com/jpsouza25/crud-simples-em-python.git
cd crud-simples-em-python
```

### 3. Crie e ative um ambiente virtual (recomendado)

```bash
# Linux / macOS
python3 -m venv venv
source venv/bin/activate

# Windows
python -m venv venv
venv\Scripts\activate
```

### 4. Instale as dependências

```bash
pip install -r requirements.txt
```

## Como Rodar

### Modo Web (Flask)

```bash
python app.py
```

Acesse no navegador: [http://localhost:5000](http://localhost:5000)

Na primeira execução, o banco de dados `database.db` será criado automaticamente. Cadastre um novo usuário pela tela de login para começar.

### Modo CLI (Terminal)

```bash
python crud.py
```

Exibe um menu interativo no terminal com as opções de CRUD:

```
=== CRUD de Usuários ===
  [1] Listar usuários
  [2] Buscar usuário por ID
  [3] Criar usuário
  [4] Atualizar usuário
  [5] Alterar senha
  [6] Verificar senha
  [7] Deletar usuário
  [0] Sair
```

## Rotas da API

| Método | Rota                          | Descrição                        |
|--------|-------------------------------|----------------------------------|
| POST   | `/api/login`                  | Autenticar usuário               |
| POST   | `/api/register`               | Cadastrar novo usuário           |
| GET    | `/api/users`                  | Listar todos os usuários         |
| PUT    | `/api/users/<id>`             | Atualizar dados do usuário       |
| DELETE | `/api/users/<id>`             | Deletar usuário                  |
| PUT    | `/api/users/<id>/password`    | Alterar senha do usuário         |

> As rotas da API (exceto login e register) requerem sessão ativa.

## Observações

- O arquivo `database.db` é gerado automaticamente na raiz do projeto e está listado no `.gitignore`.
- A `secret_key` da sessão Flask é gerada aleatoriamente a cada inicialização. Para produção, defina uma chave fixa via variável de ambiente.
