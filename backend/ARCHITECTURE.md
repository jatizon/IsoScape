# Arquitetura do IsoScape Backend

## 📋 Índice
1. [Schemas vs DTOs](#schemas-vs-dtos)
2. [Visão Geral da Arquitetura](#visão-geral-da-arquitetura)
3. [Camadas da Aplicação](#camadas-da-aplicação)
4. [Fluxo de Dados](#fluxo-de-dados)
5. [Padrões de Design Utilizados](#padrões-de-design-utilizados)
6. [Diagrama de Fluxo](#diagrama-de-fluxo)

---

## Schemas vs DTOs

### O que são DTOs?
**DTO (Data Transfer Object)** é um padrão de design que define objetos simples usados para transferir dados entre camadas ou sistemas. Eles não contêm lógica de negócio, apenas dados.

### Schemas no FastAPI
No nosso código, os **schemas** (`models/schemas.py`) funcionam como **DTOs**:

```python
class CityRequest(BaseModel):      # DTO de entrada
    city_name: str

class IsometricResponse(BaseModel): # DTO de saída
    status: str
    city_name: str
    message: str
    image_base64: str | None = None
    # ...
```

**Por que usar Pydantic BaseModel?**
- ✅ **Validação automática**: Valida tipos e formatos automaticamente
- ✅ **Documentação automática**: FastAPI gera Swagger/OpenAPI docs
- ✅ **Serialização**: Converte automaticamente para JSON
- ✅ **Type hints**: Melhor suporte do IDE e type checking

**Resumo**: Sim, os schemas **são DTOs**, mas com superpoderes do Pydantic! 🚀

---

## Visão Geral da Arquitetura

Aplicamos uma arquitetura **MVC (Model-View-Controller)** adaptada para APIs REST:

```
┌─────────────────────────────────────────────────────────┐
│                    CLIENT (Frontend)                     │
└────────────────────┬────────────────────────────────────┘
                     │ HTTP Request/Response
                     ▼
┌─────────────────────────────────────────────────────────┐
│  MAIN.PY (FastAPI App)                                  │
│  - Rotas HTTP                                            │
│  - Middleware (CORS)                                     │
│  - Dependency Injection                                  │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│  CONTROLLERS (Camada de Apresentação)                   │
│  - Recebe requisições HTTP                              │
│  - Valida entrada (via DTOs)                            │
│  - Trata erros HTTP                                      │
│  - Retorna respostas HTTP                                │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│  SERVICES (Camada de Lógica de Negócio)                 │
│  - Orquestra operações                                  │
│  - Aplica regras de negócio                             │
│  - Coordena chamadas a agentes                          │
│  - Transforma dados                                      │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│  AGENTS (Camada de Integração Externa)                  │
│  - Interface: LlmAgentInterface                         │
│  - Implementação: GeminiLlmAgent                        │
│  - Comunica com APIs externas (Gemini)                  │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  MODELS (DTOs - Data Transfer Objects)                  │
│  - CityRequest: DTO de entrada                           │
│  - IsometricResponse: DTO de saída                      │
└─────────────────────────────────────────────────────────┘
```

---

## Camadas da Aplicação

### 1. **Models (DTOs)** - `models/schemas.py`

**Responsabilidade**: Definir a estrutura de dados que trafega entre camadas.

```python
# DTO de ENTRADA (Request)
class CityRequest(BaseModel):
    city_name: str  # Validação automática: deve ser string

# DTO de SAÍDA (Response)
class IsometricResponse(BaseModel):
    status: str
    city_name: str
    message: str
    image_base64: str | None = None  # Opcional
```

**Características**:
- ✅ Não contém lógica de negócio
- ✅ Define contrato de dados
- ✅ Validação automática pelo Pydantic
- ✅ Usado em todas as camadas para comunicação

---

### 2. **Controllers** - `controllers/isometric_controller.py`

**Responsabilidade**: Camada de apresentação - lida com HTTP.

```python
class IsometricController:
    def __init__(self, isometric_service: IsometricService):
        self.isometric_service = isometric_service  # Dependency Injection
    
    async def generate_isometric(self, request: CityRequest) -> IsometricResponse:
        try:
            return await self.isometric_service.generate_isometric_city(request)
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
```

**O que faz**:
- ✅ Recebe requisições HTTP
- ✅ Valida entrada (via DTOs do Pydantic)
- ✅ Delega lógica para Services
- ✅ Trata erros HTTP (converte exceções em HTTPException)
- ✅ Retorna respostas HTTP formatadas

**NÃO faz**:
- ❌ Lógica de negócio
- ❌ Chamadas diretas a APIs externas
- ❌ Acesso a banco de dados

---

### 3. **Services** - `services/isometric_service.py`

**Responsabilidade**: Camada de lógica de negócio.

```python
class IsometricService:
    def __init__(self, llm_agent: LlmAgentInterface):
        self.llm_agent = llm_agent  # Recebe interface, não implementação específica
    
    async def generate_isometric_city(self, request: CityRequest) -> IsometricResponse:
        # 1. Cria prompt baseado na regra de negócio
        prompt = f"Create a colorful, futuristic isometric illustration of {request.city_name}..."
        
        # 2. Chama agente (sem saber qual implementação)
        response = await self.llm_agent.generate_content(prompt, config)
        
        # 3. Transforma resposta do agente em DTO de resposta
        return IsometricResponse(...)
```

**O que faz**:
- ✅ Contém **regras de negócio** (como criar o prompt)
- ✅ **Orquestra** operações complexas
- ✅ **Transforma** dados entre formatos
- ✅ Usa **interfaces** (não implementações específicas) - Dependency Inversion Principle

**NÃO faz**:
- ❌ Tratamento de HTTP
- ❌ Chamadas diretas a APIs externas (usa agents)
- ❌ Validação de entrada (já vem validada do controller)

---

### 4. **Agents** - `agents/`

**Responsabilidade**: Camada de integração com serviços externos.

#### 4.1 Interface - `agents/llm_agent_interface.py`

```python
class LlmAgentInterface(ABC):
    @abstractmethod
    async def generate_content(self, prompt: str, config: Dict) -> Dict:
        pass
    
    @abstractmethod
    def is_configured(self) -> bool:
        pass
```

**Por que interface?**
- ✅ **Desacoplamento**: Services não dependem de implementação específica
- ✅ **Testabilidade**: Fácil criar mocks para testes
- ✅ **Extensibilidade**: Fácil adicionar novos provedores (OpenAI, Claude, etc.)

#### 4.2 Implementação - `agents/gemini_llm_agent.py`

```python
class GeminiLlmAgent(LlmAgentInterface):
    def __init__(self, api_key: str, model_name: str = "gemini-1.5-flash"):
        genai.configure(api_key=api_key)
        self.model_name = model_name
    
    async def generate_content(self, prompt: str, config: Dict) -> Dict:
        model = genai.GenerativeModel(self.model_name)
        response = model.generate_content(prompt)
        # Processa resposta específica do Gemini
        return {"status": "success", "type": "image", ...}
```

**O que faz**:
- ✅ Encapsula comunicação com API externa (Gemini)
- ✅ Converte resposta da API em formato padronizado
- ✅ Trata erros específicos da API
- ✅ Implementa contrato da interface

---

### 5. **Main** - `main.py`

**Responsabilidade**: Configuração e inicialização da aplicação.

```python
# 1. Configuração do FastAPI
app = FastAPI(title="IsoScape API")
app.add_middleware(CORSMiddleware, ...)

# 2. Dependency Injection (composição de dependências)
gemini_agent = GeminiLlmAgent()                    # Cria agente
isometric_service = IsometricService(gemini_agent) # Injeta agente no service
isometric_controller = IsometricController(isometric_service) # Injeta service no controller

# 3. Rotas HTTP
@app.post("/generate-isometric")
async def generate_isometric(request: CityRequest):
    return await isometric_controller.generate_isometric(request)
```

**O que faz**:
- ✅ Configura FastAPI (middleware, CORS, etc.)
- ✅ **Composição de dependências** (Dependency Injection)
- ✅ Define rotas HTTP
- ✅ Ponto de entrada da aplicação

---

## Fluxo de Dados

Vamos rastrear uma requisição completa:

### Exemplo: POST `/generate-isometric` com `{"city_name": "São Paulo"}`

```
1. CLIENT (Frontend)
   └─> HTTP POST /generate-isometric
       Body: {"city_name": "São Paulo"}
       │
       ▼

2. MAIN.PY (FastAPI)
   └─> Recebe requisição
   └─> Valida JSON automatica
   └─> Cria CityRequest DTO (Pydantic valida)
       │
       ▼

3. CONTROLLER (IsometricControllmenteer)
   └─> generate_isometric(request: CityRequest)
   └─> Validação já feita pelo Pydantic ✅
   └─> Chama service
       │
       ▼

4. SERVICE (IsometricService)
   └─> generate_isometric_city(request: CityRequest)
   └─> Cria prompt: "Create a colorful, futuristic isometric illustration of São Paulo..."
   └─> Chama llm_agent.generate_content(prompt, config)
       │
       ▼

5. AGENT (GeminiLlmAgent)
   └─> generate_content(prompt, config)
   └─> Chama API do Gemini: genai.GenerativeModel().generate_content(...)
   └─> Recebe resposta da API
   └─> Processa e normaliza resposta
   └─> Retorna: {"status": "success", "type": "image", "image_base64": "..."}
       │
       ▼

6. SERVICE (IsometricService) - continuação
   └─> Recebe resposta do agente
   └─> Transforma em IsometricResponse DTO
   └─> Retorna: IsometricResponse(
           status="success",
           city_name="São Paulo",
           image_base64="...",
           message="Isometric image generated"
       )
       │
       ▼

7. CONTROLLER (IsometricController) - continuação
   └─> Recebe IsometricResponse
   └─> Retorna para FastAPI
       │
       ▼

8. MAIN.PY (FastAPI)
   └─> Serializa IsometricResponse para JSON automaticamente
   └─> Retorna HTTP 200 com JSON
       │
       ▼

9. CLIENT (Frontend)
   └─> Recebe: {
         "status": "success",
         "city_name": "São Paulo",
         "image_base64": "...",
         "message": "Isometric image generated"
       }
```

---

## Padrões de Design Utilizados

### 1. **MVC (Model-View-Controller)**
- **Model**: `models/schemas.py` (DTOs)
- **View**: FastAPI serializa automaticamente para JSON
- **Controller**: `controllers/isometric_controller.py`

### 2. **Dependency Injection (Injeção de Dependência)**
```python
# Em vez de criar dependências dentro das classes:
class IsometricService:
    def __init__(self):
        self.llm_agent = GeminiLlmAgent()  # ❌ Acoplado!

# Fazemos injeção externa:
gemini_agent = GeminiLlmAgent()
service = IsometricService(gemini_agent)  # ✅ Desacoplado!
```

**Benefícios**:
- ✅ Fácil testar (pode injetar mocks)
- ✅ Fácil trocar implementações
- ✅ Baixo acoplamento

### 3. **Strategy Pattern (Padrão Estratégia)**
A interface `LlmAgentInterface` permite trocar estratégias de geração:

```python
# Pode usar Gemini
gemini_agent = GeminiLlmAgent()
service = IsometricService(gemini_agent)

# Ou OpenAI (futuro)
openai_agent = OpenAILlmAgent()
service = IsometricService(openai_agent)

# Service não precisa mudar! ✅
```

### 4. **Dependency Inversion Principle (SOLID)**
- Services dependem de **interfaces** (abstrações)
- Não dependem de **implementações concretas**
- Facilita extensão e manutenção

### 5. **Single Responsibility Principle (SOLID)**
Cada classe tem uma única responsabilidade:
- **Controller**: HTTP
- **Service**: Lógica de negócio
- **Agent**: Integração externa
- **Models**: Estrutura de dados

---

## Diagrama de Fluxo

```
┌─────────────┐
│   CLIENT    │
└──────┬──────┘
       │ HTTP POST /generate-isometric
       │ {"city_name": "São Paulo"}
       ▼
┌─────────────────────────────────────┐
│         MAIN.PY (FastAPI)            │
│  ┌───────────────────────────────┐  │
│  │  @app.post("/generate-...")   │  │
│  │  async def generate_...()     │  │
│  │    request: CityRequest       │  │
│  └───────────┬───────────────────┘  │
└──────────────┼──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│   IsometricController                │
│  ┌───────────────────────────────┐  │
│  │ generate_isometric()          │  │
│  │   - Valida entrada            │  │
│  │   - Trata erros HTTP          │  │
│  └───────────┬───────────────────┘  │
└──────────────┼──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│   IsometricService                  │
│  ┌───────────────────────────────┐  │
│  │ generate_isometric_city()     │  │
│  │   - Cria prompt               │  │
│  │   - Chama llm_agent           │  │
│  │   - Transforma resposta       │  │
│  └───────────┬───────────────────┘  │
└──────────────┼──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│   GeminiLlmAgent                    │
│  (implementa LlmAgentInterface)     │
│  ┌───────────────────────────────┐  │
│  │ generate_content()            │  │
│  │   - Chama API Gemini          │  │
│  │   - Processa resposta         │  │
│  └───────────┬───────────────────┘  │
└──────────────┼──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│   Google Gemini API                 │
│   (Serviço Externo)                 │
└─────────────────────────────────────┘
```

---

## Vantagens desta Arquitetura

### ✅ **Testabilidade**
```python
# Fácil criar mocks para testes
mock_agent = MockLlmAgent()
service = IsometricService(mock_agent)
# Testa lógica sem chamar API real
```

### ✅ **Manutenibilidade**
- Código organizado por responsabilidade
- Fácil encontrar onde fazer mudanças
- Baixo acoplamento entre camadas

### ✅ **Extensibilidade**
- Adicionar novo agente: criar classe que implementa `LlmAgentInterface`
- Adicionar novo endpoint: criar novo controller
- Trocar Gemini por OpenAI: só mudar em `main.py`

### ✅ **Reutilização**
- Services podem ser usados por diferentes controllers
- Agents podem ser usados por diferentes services
- DTOs são compartilhados entre camadas

---

## Resumo

| Camada | Arquivo | Responsabilidade | Exemplo |
|--------|---------|------------------|---------|
| **Models** | `models/schemas.py` | DTOs (estrutura de dados) | `CityRequest`, `IsometricResponse` |
| **Controllers** | `controllers/isometric_controller.py` | HTTP (entrada/saída) | Validação, tratamento de erros HTTP |
| **Services** | `services/isometric_service.py` | Lógica de negócio | Criação de prompt, orquestração |
| **Agents** | `agents/gemini_llm_agent.py` | Integração externa | Chamada à API Gemini |
| **Main** | `main.py` | Configuração | FastAPI setup, Dependency Injection |

**Schemas = DTOs com validação automática do Pydantic** ✅

