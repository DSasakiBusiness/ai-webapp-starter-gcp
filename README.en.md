# 🚀 ai-webapp-starter-gcp

A development starter kit for **launching AI-specialized web services to production as fast as possible**.  
Built on Next.js + NestJS + Prisma + LLM + Docker + GCP, and fully utilizes AI-driven development with Claude Code agents and skills.

*[日本語](README.md) | [English](README.en.md)*

---

## ✨ What you get with this starter

| Category | Content |
|---------|------|
| **Full Stack Base** | Next.js 15 (App Router) + NestJS + Prisma + PostgreSQL + Redis |
| **LLM Integration** | Built-in OpenAI SDK. Retry, fallback, and type-safe output specifications |
| **AI Design Patterns** | 8 practical agent patterns (Plan-then-Execute, Budget-Aware Routing, etc.) |
| **Claude Code Integration** | 10 Agents + 26 Skills supporting AI-driven development |
| **Full-layer Testing** | Includes Unit (Jest) + Integration (supertest) + E2E (Playwright) tests |
| **Quality CLI Tools** | husky / lint-staged / commitlint / knip / cspell / madge / depcheck / ncu |
| **Full Docker Support** | One-click startup of 4 services with docker-compose. Includes production Dockerfiles |
| **GCP Deployment** | Cloud Run + Cloud SQL + Secret Manager + GitHub Actions CI/CD |
| **Security** | Global exception filters, input validation, PentAGI integration |

---

## 📁 Directory Structure

```
ai-webapp-starter-gcp/
├── .claude/                          # Claude Code integration
│   ├── CLAUDE.md                     # Cross-project rules
│   ├── agents/                       # 10 AI Agents definitions
│   │   ├── engineering/              #   frontend / backend / ai / gcp
│   │   ├── product/                  #   product-manager / solution-architect
│   │   └── testing/                  #   qa / tdd / e2e / security
│   └── skills/                       # 26 Skills definitions
│       ├── common/                   #   21 common skills
│       └── gcp/                      #   5 GCP specific skills
│
├── apps/
│   ├── api/                          # NestJS Backend
│   │   ├── src/
│   │   │   ├── common/filters/       #   Global exception filters
│   │   │   ├── llm/                  #   LLM integration (Controller / Service / DTO)
│   │   │   └── prisma/               #   Prisma Service
│   │   ├── prisma/                   # Schema + Migration + Seeder
│   │   └── Dockerfile / Dockerfile.dev
│   │
│   └── web/                          # Next.js Frontend
│       ├── src/
│       │   ├── app/                   #   App Router pages
│       │   └── lib/                   #   Type-safe API client
│       └── Dockerfile / Dockerfile.dev
│
├── packages/
│   └── shared/                       # Shared type definitions (API / Web)
│
├── tests/
│   ├── unit/                         # Unit tests
│   ├── integration/                  # Integration tests (supertest)
│   └── e2e/                          # E2E tests (Playwright)
│
├── scripts/
│   ├── doctor.sh                     # Development environment checks
│   └── wait-for-it.sh                # Wait for service startup
│
├── infra/gcp/                        # Cloud Build settings
├── .github/workflows/                # CI/CD (ci / deploy-api / deploy-web)
├── .husky/                           # Git hooks (pre-commit / commit-msg)
├── docs/                             # Architecture and development guide
│
├── docker-compose.yml                # Local development environment
├── Makefile                          # Unified entrypoint for all operations
├── commitlint.config.js              # Commit message convention
├── cspell.json                       # Spell check settings
├── knip.json                         # Unused code detection settings
├── .madgerc                          # Circular dependency detection settings
├── .lintstagedrc.json                # pre-commit lint settings
├── .prettierrc / .prettierignore     # Code formatting
└── tsconfig.base.json                # Common TypeScript settings
```

---

## 🛠 Tech Stack

### Application

| Layer | Technology | Version |
|---------|------|-----------|
| Frontend | Next.js (App Router, standalone) | 15.x |
| Backend | NestJS | 10.x |
| ORM | Prisma (PostgreSQL) | 5.x |
| AI / LLM | OpenAI SDK | 4.x |
| Cache | Redis | 7.x |
| Language | TypeScript | 5.6+ |

### Infrastructure & DevOps

| Tool | Purpose |
|-------|------|
| Docker Compose | Local development (Starts 4 services) |
| GCP Cloud Run | Production container execution |
| GCP Cloud SQL | Production PostgreSQL |
| GCP Secret Manager | Secret management |
| GCP Artifact Registry | Docker image registry |
| GitHub Actions | CI/CD pipeline |
| Turborepo | Monorepo build management |

### Quality Control Tools

| Tool | Purpose | Execution Timing |
|-------|------|-------------|
| **husky** | Git hooks base | Auto (on commit) |
| **lint-staged** | ESLint + Prettier on staged files | Auto (on pre-commit) |
| **commitlint** | Enforce Conventional Commits | Auto (on commit-msg) |
| **ESLint** | TypeScript / React Linter | `make lint` |
| **Prettier** | Code formatter | `make format` |
| **knip** | Unused file/export/dependency detection | `make knip` |
| **cspell** | Code spell checker | `make spell` |
| **madge** | Circular dependency detection | `make circular` |
| **depcheck** | Unused dependencies detection | `make depcheck` |
| **npm-check-updates** | Dependency updates testing | `make ncu` |
| **sort-package-json** | package.json keys sort | `make sort-pkg` |

### Testing

| Type | Tool | Target |
|------|-------|------|
| Unit | Jest + ts-jest | AppService, LlmService |
| Integration | Jest + supertest | API endpoints validation |
| E2E | Playwright | Overall flow from browser |
| AI Quality | run-ai-evals skill | Quantitative evaluation of structure, citation, and edge cases |
| Security | PentAGI | Penetration testing of staging environments |

---

## 🏗 API Backend Features

### Built-in Modules

| Module | Content |
|-----------|------|
| **LLM Integration** | OpenAI SDK wrapper (`LlmService`) — `complete()` / `completeWithRetry()` / `isAvailable()` |
| **Global Exception Filter** | Translates all API errors into a unified `ApiError` format via `GlobalExceptionFilter` |
| **Input Validation** | class-validator on `LlmCompletionDto` (Prompt length, temperature bounds, token limits) |
| **Swagger API Documentation** | Auto-generated at `/api/docs`. Response typing for all endpoints |
| **Prisma Service** | PostgreSQL connection management. Supports migrations and seeders |
| **Health Check** | `/api/health` — Server activity status + version info |

### Built-in API Endpoints

| Method | Path | Description |
|---------|------|------|
| GET | `/api/health` | Health Check |
| GET | `/api/llm/status` | LLM Connection Status |
| POST | `/api/llm/complete` | LLM text generation (with validation) |

---

## 🎨 Web Frontend Features

| Feature | Content |
|------|------|
| **Type-safe API Client** | `api-client.ts` — fetch wrapper to handle `ApiResponse<T>` / `ApiError` safely |
| **data-testid Attributes** | E2E testing IDs provided on all elements |
| **Metadata Management** | Defined titles and descriptions via Next.js Metadata API |
| **App Router** | Adapts the latest Next.js 15 routing |

---

## 🤖 Claude Code Integration

### Agents (10)

| Agent | Category | Role |
|-------|---------|------|
| product-manager | product | Requirements definition / MVP decision |
| solution-architect | product | Overall architecture / Boundary of responsibilities |
| frontend-developer | engineering | Next.js UI implementation |
| backend-developer | engineering | NestJS API implementation |
| ai-engineer | engineering | LLM/RAG integration + 8 design patterns |
| gcp-platform-engineer | engineering | GCP specific design / deployment |
| qa-reviewer | testing | Quality review |
| tdd-coach | testing | TDD process management |
| e2e-tester | testing | Playwright E2E |
| security-reviewer | testing | Security / PentAGI |

### Skills (26)

<details>
<summary>Common Skills (21)</summary>

| Skill | Overview |
|-------|------|
| clarify-product-requirements | Clarify requirements |
| define-mvp | MVP Definition |
| implement-nextjs-ui | Next.js UI implementation |
| implement-nestjs-api | NestJS API implementation |
| implement-prisma-schema | Prisma schema management |
| integrate-llm-feature | LLM integration |
| build-rag-pipeline | Build RAG pipeline |
| tdd-feature-delivery | TDD feature development |
| e2e-readiness-pipeline | E2E tests preparation |
| review-security-with-pentagi | PentAGI security validation |
| run-ai-evals | AI quality evaluation |
| review-ai-output-quality | AI output quality review |
| review-performance | Performance review |
| write-api-contract | API contract definition |
| generate-ui-spec | UI specification generation |
| secure-release-pipeline | Secure release |
| setup-pentagi-scan | PentAGI scan setup |
| review-release-readiness | Release judgement |
| clarify-ai-requirements | AI requirements clarification |
| clarify-test-scope | Test scope clarification |
| setup-docker-dev-environment | Docker environment setup |
| run-tests-in-docker | Docker tests execution |
| manage-prisma-in-docker | Prisma management on Docker |

</details>

<details>
<summary>GCP Skills (5)</summary>

| Skill | Overview |
|-------|------|
| design-gcp-architecture | GCP architectural design |
| deploy-to-gcp | Cloud Run Deployment |
| setup-gcp-ci-cd | CI/CD build |
| configure-gcp-secrets | Secret Manager setup |
| monitor-on-gcp | Monitoring / Alerts setup |

</details>

### AI Design Patterns (8)

Built into the `ai-engineer` agent. Based on [awesome-agentic-patterns](https://github.com/nibzard/awesome-agentic-patterns).

| # | Pattern | Required/Recommended | Overview |
|---|---------|----------|------|
| 1 | Structured Output Specification | Required | Type-safe AI output via Zod / class-validator |
| 2 | Plan-then-Execute | Required | Separation of plan and execution increases success by 40-70% |
| 3 | Budget-Aware Model Routing | Required | Dynamic model routing via task complexity |
| 4 | Failover-Aware Model Fallback | Required | Auto-switching via semantic error classification |
| 5 | Self-Critique Evaluator Loop | Recommended | Quality gate through LLM self-evaluation |
| 6 | Hook-Based Safety Guard Rails | Required | Safety checks on PreToolUse/PostToolUse |
| 7 | LLM Observability | Required | Span tracing + cost tracking |
| 8 | Prompt Caching | Recommended | Prefix fixing reduces costs by up to 43% |

---

## 🚀 Quick Start

### Prerequisites

- Docker Desktop (Docker Compose V2)
- Node.js 20+
- Git

```bash
# Environment checks (Recommended)
make doctor
```

### Setup

```bash
# 1. Clone the repository
git clone <repository-url>
cd ai-webapp-starter-gcp

# 2. Environment Variables configuration
cp .env.example .env
# Edit .env (at least OPENAI_API_KEY)

# 3. Start all services in Docker
make setup

# → http://localhost:3000        (Web)
# → http://localhost:3001/api/docs (Swagger)
```

---

## 🐳 Docker Compose

### Services

| Service | Port | Image | Purpose |
|---------|--------|---------|------|
| web | 3000 | Node.js 20 | Next.js Frontend |
| api | 3001 | Node.js 20 | NestJS Backend |
| db | 5432 | PostgreSQL 16 | Database |
| redis | 6379 | Redis 7 | Cache |

### Major Commands

```bash
make up          # Start all services
make down        # Stop all services
make restart     # Restart
make logs        # View logs
make ps          # Check containers status
make build       # Re-build containers
make clean       # Remove everything (including volumes)
```

---

## 🗄 Database Operations

```bash
make db-migrate       # Create/apply migrations
make db-generate      # Regenerate Prisma Client
make db-seed          # Seed initial data
make db-studio        # Prisma Studio (GUI database viewer)
make db-reset         # DB Reset (Erase all data)
```

---

## 🧪 Testing

### Running Tests

```bash
make test             # All tests
make test-unit        # Unit tests (Jest)
make test-integration # Integration tests (supertest)
make test-e2e         # E2E tests (Playwright)
```

### Included Tests

| File | Type | Target |
|---------|------|-----------|
| `apps/api/src/app.service.spec.ts` | Unit | Health check response values/structure |
| `apps/api/src/llm/llm.service.spec.ts` | Unit | LLM complete / retry / isAvailable |
| `tests/integration/app.controller.integration.spec.ts` | Integration | API endpoints (health / llm) |
| `tests/e2e/specs/health.spec.ts` | E2E | Homepage + API connectivity |

### E2E Tests (Playwright)

```bash
# Install Playwright
npx playwright install chromium

# Run tests
make test-e2e

# UI Mode (for debugging)
npx playwright test --config=tests/e2e/playwright.config.ts --ui
```

---

## ✅ Code Quality

### Automated Execution (Git hooks)

- **pre-commit**: Automatically runs ESLint + Prettier on staged files
- **commit-msg**: Enforces Conventional Commits rules (`feat:`, `fix:`, `docs:`, etc.)

### Manual Execution

```bash
make quality      # Run all quality checks sequentially (format + spell + knip + circular)

make lint         # Linter check
make format       # Apply formatting
make format-check # Check formatting (for CI)
make spell        # Spell check
make knip         # Unused code detection
make circular     # Circular dependency detection
make depcheck     # Unused dependencies detection
make ncu          # Dependency update checks
make sort-pkg     # package.json keys sort
```

### Commit Message Conventions

```
feat: Add a new feature
fix: Fix a bug
docs: Update documentation
style: Code formatting changes (does not affect meaning)
refactor: Refactoring code
perf: Performance improvements
test: Add/update tests
build: Build system changes
ci: CI setup changes
chore: Miscellaneous changes
revert: Revert changes
```

---

## 🔐 Security

### Built-in Defenses

| Measure | Implementation |
|------|---------|
| Global Exception Filter | `apps/api/src/common/filters/http-exception.filter.ts` |
| Input Validation | `apps/api/src/llm/dto/llm-completion.dto.ts` |
| CORS Configuration | `apps/api/src/main.ts` |
| Environment Variables Mgt | `.env` + Docker secrets |

### PentAGI Security Review

> ⚠️ **Absolutely do NOT run this against the production environment**

PentAGI is strictly limited for use in staging or isolated environments.

```bash
# Create an isolated network
docker network create --internal pentagi-isolated

# Launch PentAGI (isolated environment)
docker run -d --name pentagi-scanner --network=pentagi-isolated pentagi/scanner:latest
```

---

## ☁️ GCP Deployment

### Architecture

```
Cloud Run (web)  ← Next.js standalone
Cloud Run (api)  ← NestJS
Cloud SQL        ← PostgreSQL 16
Secret Manager   ← Sensitive info
Artifact Registry ← Docker images
```

### Deployment Instructions (Brief)

1. Create a GCP Project / Enable APIs
2. Register secrets to Secret Manager (`configure-gcp-secrets` skill)
3. Create a Cloud SQL instance
4. Create an Artifact Registry repository
5. Build and push Docker images
6. Deploy to Cloud Run

For details, please refer to `infra/gcp/README.md` and `.claude/skills/gcp/deploy-to-gcp/SKILL.md`.

### Production Build

```bash
make build-api-prod   # Build API image
make build-web-prod   # Build Web image
make build-all-prod   # Build all images
```

---

## 🔄 CI/CD

GitHub Actions automation:

| Workflow | Trigger | Content |
|-------------|---------|------|
| `ci.yml` | push, PR | lint → unit test → integration test → E2E test |
| `deploy-api.yml` | `apps/api/**` change in main | Deploy API to Cloud Run |
| `deploy-web.yml` | `apps/web/**` change in main | Deploy Web to Cloud Run |

### Required GitHub Secrets

| Secret | Description |
|--------|------|
| `GCP_PROJECT_ID` | GCP Project ID |
| `GCP_SA_KEY` | Service Account JSON Key |
| `CLOUDSQL_CONNECTION` | Cloud SQL Connection Name |
| `API_URL` | API Production URL |
| `WEB_URL` | Web Production URL |

---

## 📖 Extension Guide

### Adding new API Endpoints

1. Define acceptance criteria adhering to `tdd-coach` instructions.
2. Create modules with the `implement-nestjs-api` skill.
3. Add types into `packages/shared/src/types`.
4. Add tests in order: Unit → Integration → E2E.

### Adding new AI Features

1. Clarify requirements with the `clarify-ai-requirements` skill.
2. Design and implement a prompt using the `integrate-llm-feature` skill.
3. Evaluate quality using the `run-ai-evals` skill.

### Adding new Pages

1. Generate UI specification using the `generate-ui-spec` skill.
2. Implement components using the `implement-nextjs-ui` skill.
3. Append `data-testid` to support E2E validations.

---

## 📋 Full `make` commands list

```bash
make help             # Display help

# --- Development ---
make setup            # Initial setup (Start Docker + prepare DB)
make up / down        # Start / Stop services
make restart          # Restart services
make logs             # View logs
make ps               # View container states
make build / clean    # Build / Delete all
make doctor           # Development environment checker

# --- Database ---
make db-migrate / db-generate / db-seed / db-studio / db-reset

# --- Tests ---
make test / test-unit / test-integration / test-e2e

# --- Code Quality ---
make quality          # Sequential checker execution
make lint / format / format-check
make spell / knip / circular / depcheck / ncu / sort-pkg

# --- Production Build ---
make build-api-prod / build-web-prod / build-all-prod
```

---

## ⚠️ Notes

- **Never** commit the `.env` file.
- Do not run PentAGI on the production environment.
- Using the `any` type is forbidden.
- Ensure the AI output is sanitized before presenting it to the user.
- Do not hardcode Secrets inside the code.
- Merging without tests is strictly prohibited.
- Follow Conventional Commits for commit messages.

---

## 📄 License

[MIT](LICENSE)
