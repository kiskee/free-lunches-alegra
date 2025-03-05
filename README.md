

# Map
restaurant-microservices/
│
├── services/
│   ├── restaurant-manager/
│   │   ├── src/
│   │   │   ├── index.js
│   │   │   ├── controllers/
│   │   │   ├── routes/
│   │   │   └── utils/
│   │   ├── Dockerfile
│   │   ├── package.json
│   │   └── .dockerignore
│   │
│   ├── kitchen-service/
│   │   ├── src/
│   │   │   ├── index.js
│   │   │   ├── controllers/
│   │   │   ├── routes/
│   │   │   └── utils/
│   │   ├── Dockerfile
│   │   ├── package.json
│   │   └── .dockerignore
│   │
│   └── warehouse-service/
│       ├── src/
│       │   ├── index.js
│       │   ├── controllers/
│       │   ├── routes/
│       │   └── utils/
│       ├── Dockerfile
│       ├── package.json
│       └── .dockerignore
│   
│ 
│
├── shared/
│   ├── constants/
│   │   └── ingredients.js
│   └── models/
│       └── recipe.js
│
├── docker-compose.yml
├── .env
└── README.md