# IsoScape Backend

API FastAPI para geração de imagens isométricas de cidades usando Google Gemini.

Como Rodar

### 1. Instalar dependências

```bash
cd backend
pip install -r requirements.txt
```

Ou usando um ambiente virtual (recomendado):

```bash
python3 -m venv venv
source venv/bin/activate  # No Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 2. Configurar variáveis de ambiente

Crie um arquivo `.env` na pasta `backend` com sua chave da API do Gemini:

```bash
GEMINI_API_KEY=sua_chave_aqui
```

**Como obter a chave:**
1. Acesse [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Crie uma nova API key
3. Cole no arquivo `.env`

### 3. Instalar o pacote (modo desenvolvimento)

```bash
pip install -e .
```

Isso instala o pacote em modo editável, permitindo que as mudanças no código sejam refletidas imediatamente.

### 4. Rodar o servidor

```bash
uvicorn src.main:app --reload
```

Ou, se o pacote estiver instalado:

```bash
uvicorn src.main:app --reload
```

O servidor estará rodando em: **http://localhost:8000**

### 4. Testar a API

- **Documentação interativa (Swagger):** http://localhost:8000/docs
- **Health check:** http://localhost:8000/health
- **Endpoint principal:** POST http://localhost:8000/generate-isometric

**Exemplo de requisição:**
```bash
curl -X POST "http://localhost:8001/generate-isometric" \
  -H "Content-Type: application/json" \
  -d '{"city_name": "São Paulo"}'
```

## 📁 Estrutura do Projeto

```
backend/
├── src/                # Código fonte do pacote
│   ├── agents/         # Agentes de integração (Gemini)
│   ├── controllers/    # Camada de apresentação (HTTP)
│   ├── services/       # Camada de lógica de negócio
│   ├── models/         # DTOs/Schemas (Pydantic)
│   └── main.py         # Ponto de entrada FastAPI
├── .env                # Variáveis de ambiente (não versionado)
├── pyproject.toml      # Configuração do pacote Python
├── requirements.txt    # Dependências Python
└── README.md           # Este arquivo
```

Para mais detalhes sobre a arquitetura, veja [ARCHITECTURE.md](./ARCHITECTURE.md).

## 🔧 Comandos Úteis

- **Instalar em modo desenvolvimento:** `pip install -e .`
- **Rodar com reload (desenvolvimento):** `uvicorn src.main:app --reload`
- **Rodar em porta específica:** `uvicorn src.main:app --port 8001`
- **Rodar em modo produção:** `uvicorn src.main:app --host 0.0.0.0 --port 8000`

