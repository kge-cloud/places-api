# Places API

A modular **NestJS backend service** that allows users to **fetch and track progress** of places (e.g. cafés, bakeries, restaurants, cemeteries) in a given city using the **Google Places API**.  

The service features:  
- Background job processing with BullMQ  
- Progress tracking via Redis  
- SSE streaming for real-time progress updates  
- REST endpoints to start fetching jobs and retrieve paginated results  
- Authentication and authorization to control access  
- Modular NestJS structure  
- Type-safe DTOs and validation  
- Prisma ORM for persistence  
- E2E and unit testing setup

---

## 🧩 Architecture

```
src/
├── app.module.ts # Root application module
├── auth/ # Authentication & authorization
│ ├── auth.module.ts
│ ├── auth.service.ts
│ ├── auth.controller.ts
│ └── jwt.strategy.ts # JWT validation strategy
├── jobs/ # Job queue and async task management
│ ├── jobs.module.ts
│ ├── jobs.queue.ts
│ └── jobs.constants.ts
├── places/ # Domain: Places fetching and storage
│ ├── dto/ # Input validation DTOs
│ ├── gateways/ # SSE Gateway for progress streaming
│ ├── processors/ # Background job processors
│ ├── providers/ # External API integration (Google Places)
│ ├── repositories/ # Prisma-based persistence layer
│ ├── places.controller.ts # REST endpoints
│ ├── places.service.ts # Business logic
│ ├── places.module.ts
│ └── places-progress.service.ts
└── main.ts # Bootstrap and global validation setup
```

---

## 🌐 API Overview

### `GET /places`
Fetch paginated places stored in the database.

**Query parameters:**
| Name | Type | Required | Description |
|------|------|-----------|-------------|
| city | string | ✅ | City name |
| type | string | ✅ | Place type (e.g. coffee, bakery, cemetery) |
| page | number | optional | Default: 1 |
| limit | number | optional | Default: 20 |

---

### `POST /places/fetch`
Start a background job to fetch new places from Google

---

### `GET /places/stream?city=Copenhagen&type=coffee`
Server-Sent Events endpoint streaming live job progress

---

## ⚙️ Setup Instructions

### 1️ Prerequisites
- Node.js ≥ 20
- Docker (for Redis and Postgres)
- Google Places API key

### 2️ Environment Variables

The .env file at the root includes all necessary configuration to run the project locally, except for the GOOGLE_API_KEY.
To obtain the Google Places API key, please contact: kiril.georgiev.sf@gmail.com.

### 3️ Install dependencies

```bash
npm install
```

### 4️ Start dependencies (Redis + Postgres)

```bash
docker compose up -d
```

### 5️ Prepare the database

Run the Prisma migrations to create the database schema:

```bash
npx prisma migrate dev --name init
```

### 6️ Run the service

```bash
npm run start:dev
```

> The API will be available at:  
> **http://localhost:3000**


### 7️ Testing the API with curl

#### 7.1️ Login and obtain JWT token

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"john","password":"dohe"}'
```

Expected response:

{
  "access_token": "<YOUR_JWT_TOKEN>"
}

'{"username":"john","password":"dohe"}' is hardcoded credentials to simplyfy the authentication.
In a real system, it should be a registered user.

#### 7.2️ Poll progress of a place fetching job (SSE)

NOTE: Note: you can try to replace coffee with cemetery to get info about the cemeteries in Copenhagen

```bash
curl -N "http://localhost:3000/places/stream?city=Copenhagen&type=coffee" \
     -H "Authorization: Bearer <YOUR_JWT_TOKEN>"
```

-N keeps the connection open for Server-Sent Events (SSE).

Keep the connection open and go to the next step

### 7.3️ Trigger a place fetching job

```bash
curl -X POST http://localhost:3000/places/fetch \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <ACCESS_TOKEN>" \
  -d '{"city":"Copenhagen","type":"coffee"}'
```

Expected response:

{
  "message": "Job enqueued",
  "jobId": "Copenhagen-coffee"
}


If the job is already running:

{
  "message": "Job already in progress",
  "jobId": "Copenhagen-coffee"
}

Note the change of the progress in the command run on the previous step

#### 7.4️ Fetch paginated results of places

```bash
curl -X GET "http://localhost:3000/places?city=Copenhagen&type=coffee&page=1&limit=20" \
     -H "Authorization: Bearer <YOUR_JWT_TOKEN>"
```

Expected response:

[
  {
    "name": "Coffee Shop 1",
    "address": "Some street 1, Copenhagen",
    "latitude": 55.6761,
    "longitude": 12.5683,
    "city": "Copenhagen",
    "type": "coffee",
    "placeId": "abc123",
    "pageNumber": 1,
    "detailsCached": false,
    "enrichedText": null
  },
  ...
]

Supports page and limit for pagination.

Make sure the fetching job has started/completed to see results.

---

## 🧠 How It Works

1. **Controller** receives a `/places/fetch` request.  
2. It **enqueues** a background job in Redis (BullMQ).  
3. A **worker** (`PlacesJobProcessor`) fetches data from Google Places API,  
   persists it via **Prisma**, and updates progress in Redis.  
4. The **SSE Gateway** polls Redis every second to stream progress updates.  

---

## 🧪 Testing

- **Unit tests:** Run with Jest and ts-jest  
- **E2E tests:** Spin up an isolated Nest app context

```bash
npm run test
npm run test:e2e
```

---

### Next Steps

- Add authentication & roles:
Implement /auth/register endpoint. Introduce admin (can trigger jobs) and user (can fetch results only) roles.

- Implement city-grid fetching:
Use multiple coordinates across the city to fetch places in smaller zones, with deduplication by placeId.

- Enhance data enrichment:
Integrate an LLM or metadata pipeline to describe each place (e.g. estimated size, key features, categories).

- Dockerize the service:
Build a Docker image and extend docker-compose.yml to run the API, Redis, and Postgres together.

- Add CI/CD with GitHub Actions:
Automate linting, testing, building, and image publishing.

- Production hardening:
Add TLS, secrets management, monitoring (Prometheus + logs), health checks, backups, and rate limiting.

---

## 🧰 Tech Stack

| Purpose | Tool |
|----------|------|
| Framework | NestJS |
| ORM | Prisma |
| Queue | BullMQ |
| Cache | Redis |
| Database | PostgreSQL |
| API | Google Places API |
| Validation | class-validator / class-transformer |
| Testing | Jest |

---

