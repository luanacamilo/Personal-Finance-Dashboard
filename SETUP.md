# 🚀 Configuração do Projeto

## ✅ Instalado

- **Vite** - Build tool moderno
- **React** - Framework frontend
- **Better-SQLite3** - Banco de dados SQLite para Node.js
- **Express** - Servidor backend
- **Nodemon** - Auto-reload do servidor

## 📂 Estrutura

```
Personal-Finance-Dashboard/
├── client/           # Frontend React
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── main.jsx
│   │   └── index.css
│   └── index.html
├── server/           # Backend Node.js
│   └── index.js
├── database/         # SQLite
│   ├── init.js
│   └── finance.db
├── package.json
└── vite.config.js
```

## 🎯 Como usar

### Iniciar o projeto (primeira vez):
```bash
npm run init-db    # Criar banco de dados
npm run server     # Iniciar backend (porta 5000)
npm run dev        # Iniciar frontend (porta 3000)
```

### Comandos disponíveis:
- `npm run dev` - Inicia o servidor Vite (frontend)
- `npm run server` - Inicia o servidor Express (backend)
- `npm run init-db` - Inicializa o banco de dados
- `npm run build` - Build de produção
- `npm run preview` - Preview do build

## 🔗 URLs

- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- Status API: http://localhost:5000/api/status

## 🗄️ Banco de Dados

O arquivo do banco de dados SQLite está em:
```
database/finance.db
```

Você pode abrir este arquivo no **Beekeeper Studio** para visualizar e gerenciar as tabelas!

## 📋 Próximos Passos

Agora você pode definir a estrutura do banco de dados (tabelas, relacionamentos, etc) e eu vou implementar!
