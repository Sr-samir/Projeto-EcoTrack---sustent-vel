🌱 EcoTrack – Plataforma de Monitoramento Ambiental Sustentável

O EcoTrack é uma plataforma desenvolvida para facilitar o registro, acompanhamento e análise de ações ambientais, oferecendo uma solução moderna para fiscalizações, denúncias, monitoramentos e iniciativas de sustentabilidade.

Este projeto contempla Front-end, Back-end e Banco de Dados, integrados para fornecer uma experiência completa de uso, com autenticação, upload de imagens, registro de ações e painéis estatísticos.



🚀 Tecnologias Utilizadas----------------------------
🖥️ Front-end

Angular

HTML5 / CSS3

TypeScript

Consumo de API REST

Sistema de login e cadastro de ações

⚙️ Back-end--------------------

FastAPI (Python)

MongoDB + GridFS (armazenamento de imagens)

Autenticação JWT

Rotas protegidas por token

Upload de arquivos (imagens)

CRUD de ações ambientais

🗄️ Banco de Dados---------------------

MongoDB Atlas

GridFS para armazenamento de fotos das ações

Índices otimizados para consultas rápidas

📌 Funcionalidades Principais
🔐 Autenticação-------------------------------------

Login seguro com JWT

Controle de rotas privadas

📝 Registro de Ações Ambientais

Cadastro de título, descrição e tipo da ação

Upload de imagens

Registro associado ao usuário autenticado

Armazenamento das imagens no GridFS

📄 Listagem e Consulta-----------------------

Visualização de todas as ações registradas

Filtros e organização pelo front-end

📊 Dashboard-----------------

Estatísticas gerais das ações (em andamento, concluídas, pendentes etc.)

📂 Estrutura do Repositório
Projeto-EcoTrack---sustent-vel/
│
├── backend/
│   ├── app/
│   │   ├── routes/         # Rotas do sistema (ações, segurança, usuários)
│   │   ├── database/       # Conexão com MongoDB e GridFS
│   │   ├── models/         # Modelos e validações
│   │   ├── security/       # JWT, autenticação e hashing
│   │   └── main.py         # Ponto de entrada FastAPI
│   │
│   ├── requirements.txt     # Dependências do backend
│   └── README.md
│
└── frontend/
    ├── src/
    │   ├── app/
    │   │   ├── components/
    │   │   ├── pages/
    │   │   ├── services/   # Consumo da API
    │   │   └── guards/     # Proteção de rotas
    │   ├── assets/
    │   └── index.html
    │
    └── package.json






⚙️ Como Executar o Projeto------------------
🐍 Back-end (FastAPI)

Instale as dependências:

pip install -r requirements.txt


Configure as variáveis de ambiente:

MONGO_URI="sua_string_do_mongodb"
MONGO_DB_NAME="ecotrack"
JWT_SECRET="sua_chave_segura"


Execute o servidor:

uvicorn app.main:app --reload

🖥️ Front-end (Angular)---------------

Instale as dependências:

npm install


Execute o projeto:

ng serve


Acesse no navegador:
http://localhost:4200

🧪 Endpoints Principais – API
🔐 Auth--------------

Método	Rota	Descrição
POST	/auth/login	Login e geração de token
POST	/auth/register	Criar usuário

🌿 Ações Ambientais -------

Método	Rota	Descrição
POST	/actions	Registrar ação com imagem
GET	/actions	Listar todas as ações
GET	/actions/{id}	Ver detalhes
DELETE	/actions/{id}	Excluir ação
🖼️ Upload de Imagens (GridFS)

O back-end utiliza GridFS para armazenar arquivos grandes, como fotos das ações ambientais registradas no sistema.
Isso garante:

armazenamento escalável,

rápido acesso,

integração direta com MongoDB Atlas.

📘 Objetivo do Projeto

O EcoTrack foi criado pensando em monitoramento sustentável, permitindo que equipes ambientais registrem ações, tratem dados e tomem decisões baseadas em evidências.

Ele pode ser usado por:

órgãos ambientais,

iniciativas de sustentabilidade,

projetos acadêmicos,

ONGs,

gestão pública.

👨‍💻 Autor

Samir – Full Stack Developer
