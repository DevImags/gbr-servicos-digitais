gbr-servicos-digitais/
├── .gitignore
├── README.md
├── index.html
├── assets/
│   ├── css/
│   │   └── style.css          # Estilos customizados complementares
│   ├── js/
│   │   ├── app.js             # Interações da página (modal, FAQ, menu)
│   │   ├── firebase-config.js # Configuração pública do SDK Firebase (sem segredos)
│   │   └── contact-service.js # Autenticação e envio seguro para o Firestore
│   └── img/
│       └── favicon.svg        # Ícone da aba do navegador
└── firebase/                  # Pasta opcional de referência/deploy de regras (não vai pro site público)
    └── firestore.rules