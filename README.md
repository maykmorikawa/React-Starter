# Sistema de Geração e Validação de Certificados

Sistema completo para geração, gerenciamento e validação pública de certificados digitais com QR Code.

## 🚀 Tecnologias Utilizadas

### Backend
- **Node.js** com Express.js
- **MyQL** (MariaDB) com Sequelize
- **JWT** para autenticação
- **bcrypt** para hash de senhas
- **PDFKit** para geração de PDFs
- **QRCode** para geração de códigos QR

### Frontend
- **React.js** com TypeScript
- **React Router** para navegação
- **Tailwind CSS** para estilização
- **Framer Motion** para animações
- **Axios** para requisições HTTP
- **Lucide React** para ícones

## 📋 Pré-requisitos

- Node.js (versão 16 ou superior)
- MySQL (XAMPP ou Standalone)
- npm ou yarn

## 🔧 Instalação

### 1. Preparar Banco de Dados

1. Abra o **XAMPP Control Panel** e inicie o **Apache** e **MySQL**.
2. Acesse http://localhost/phpmyadmin
3. Crie um novo banco de dados chamado `certificate_system` (collation: `utf8mb4_general_ci`)

### 2. Clone o repositório

```bash
cd c:\xampp\htdocs\appcertific\React-Starter
```

### 3. Configurar o Backend

```bash
# Navegar para a pasta do servidor
cd server

# Instalar dependências
npm install

# Configurar variáveis de ambiente
# Edite o arquivo .env se sua senha do MySQL não for vazia (padrão XAMPP)

# Criar tabelas e usuário administrador inicial
npm run seed
```

**Credenciais padrão:**
- Usuário: `admin`
- Senha: `admin123`

> ⚠️ **IMPORTANTE:** Altere essas credenciais em produção!

### 3. Configurar o Frontend

```bash
# Voltar para a raiz do projeto
cd ..

# Instalar dependências (se necessário)
npm install
```

## ▶️ Executando a Aplicação

### Iniciar o Backend

```bash
cd server
npm run dev
```

O servidor estará rodando em: `http://localhost:5000`

### Iniciar o Frontend

```bash
# Em outro terminal, na raiz do projeto
npm run dev
```

O frontend estará rodando em: `http://localhost:5173`

## 📚 Estrutura do Projeto

```
React-Starter/
├── server/                      # Backend (Node.js + Express)
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js     # Configuração MySQL
│   │   ├── middleware/
│   │   │   └── auth.js         # Middleware de autenticação JWT
│   │   ├── models/
│   │   │   ├── User.js         # Model de usuário
│   │   │   └── Certificate.js  # Model de certificado
│   │   ├── routes/
│   │   │   ├── auth.js         # Rotas de autenticação
│   │   │   └── certificates.js # Rotas de certificados
│   │   ├── services/
│   │   │   ├── pdfGenerator.js # Geração de PDFs
│   │   │   └── qrCodeGenerator.js # Geração de QR Codes
│   │   ├── utils/
│   │   │   └── seedAdmin.js    # Script para criar admin
│   │   ├── app.js              # Configuração Express
│   │   └── server.js           # Entrada do servidor
│   ├── .env                     # Variáveis de ambiente
│   └── package.json
│
├── src/                         # Frontend (React + TypeScript)
│   ├── components/
│   │   ├── CertificateForm.tsx # Formulário de criação
│   │   ├── CertificateList.tsx # Lista de certificados
│   │   └── ProtectedRoute.tsx  # Rota protegida
│   ├── contexts/
│   │   └── AuthContext.tsx     # Contexto de autenticação
│   ├── pages/
│   │   ├── Login.tsx           # Página de login
│   │   ├── AdminDashboard.tsx  # Dashboard admin
│   │   └── ValidateCertificate.tsx # Validação pública
│   ├── services/
│   │   └── api.ts              # Configuração Axios
│   └── index.css               # Estilos globais
│
├── App.tsx                      # Componente principal
├── index.tsx                    # Entrada React
├── tailwind.config.js           # Configuração Tailwind
└── package.json
```

## 🔐 API Endpoints

### Autenticação

#### POST `/api/auth/login`
Login de usuário administrador.

**Body:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "username": "admin",
    "role": "admin"
  }
}
```

### Certificados

#### POST `/api/certificates` (Protegido)
Criar novo certificado.

**Headers:**
```
Authorization: Bearer {token}
```

**Body:**
```json
{
  "studentName": "João Silva",
  "courseName": "Desenvolvimento Web com React",
  "hours": 40,
  "issueDate": "2026-01-08"
}
```

#### GET `/api/certificates` (Protegido)
Listar todos os certificados.

**Query Params:**
- `page` (opcional): Número da página
- `limit` (opcional): Itens por página
- `search` (opcional): Buscar por nome, curso ou ID

#### GET `/api/certificates/:id` (Público)
Validar certificado por ID.

**Response (válido):**
```json
{
  "success": true,
  "valid": true,
  "message": "Certificado Autêntico",
  "certificate": {
    "certificateId": "...",
    "studentName": "João Silva",
    "courseName": "Desenvolvimento Web com React",
    "hours": 40,
    "issueDate": "2026-01-08",
    "status": "active"
  }
}
```

#### GET `/api/certificates/:id/download` (Protegido)
Baixar PDF do certificado.

**Response:** Arquivo PDF

## 🎨 Funcionalidades

### Painel Administrativo
- ✅ Login seguro com JWT
- ✅ Dashboard com estatísticas
- ✅ Criar novos certificados
- ✅ Listar certificados emitidos
- ✅ Buscar certificados
- ✅ Baixar PDFs
- ✅ Interface moderna e responsiva

### Geração de Certificados
- ✅ PDF profissional com template personalizado
- ✅ QR Code embutido no certificado
- ✅ ID único (UUID) para cada certificado
- ✅ Validação de dados

### Validação Pública
- ✅ Página pública `/validar/:id`
- ✅ Verificação automática via QR Code
- ✅ Exibição de dados do certificado
- ✅ Mensagem clara para certificados inválidos

## 🌐 Variáveis de Ambiente

### Backend (.env)
```env
PORT=5000
NODE_ENV=development

# MySQL (XAMPP Default)
DB_HOST=localhost
DB_USER=root
DB_PASS=
DB_NAME=certificate_system

JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
FRONTEND_URL=http://localhost:5173
VALIDATION_BASE_URL=http://localhost:5173/validar
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
```

## 🚀 Deploy em Produção

### Backend
1. Configure as variáveis de ambiente em produção
2. Use MongoDB Atlas ou outro serviço de banco de dados
3. Altere `JWT_SECRET` para um valor seguro
4. Configure `VALIDATION_BASE_URL` com seu domínio real
5. Use `npm start` em vez de `npm run dev`

### Frontend
1. Configure `VITE_API_URL` com a URL da API em produção
2. Execute `npm run build`
3. Deploy da pasta `dist` para serviço de hospedagem (Vercel, Netlify, etc.)

## 🔒 Segurança

- Senhas são hasheadas com bcrypt (10 rounds)
- Autenticação via JWT com expiração de 24h
- Rotas protegidas com middleware de autenticação
- Validação de dados no backend
- CORS configurado para aceitar apenas o frontend

## 📝 Licença

MIT

## 👨‍💻 Desenvolvedor

Sistema desenvolvido como solução completa para geração e validação de certificados digitais.

---

**Nota:** Este é um sistema completo e pronto para uso. Certifique-se de ter o MongoDB rodando antes de iniciar o backend.
