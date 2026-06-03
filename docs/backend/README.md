# Backend Docs

This section documents the current Trainly backend as it exists in `backend/src`.

## Index

- [Architecture](./architecture.md)
- [API Guide](./api-guide.md)
- [Data Model](./data-model.md)
- [Auth Flow](./auth-flow.md)
- [Workout Flow](./workout-flow.md)
- [Social Flow](./social-flow.md)
- [SOS Flow](./sos-flow.md)
- [Storage Flow](./storage-flow.md)
- [Deployment](./deployment.md)
- [Developer Guide](./developer-guide.md)
- [Demo Guide](./demo.md)
- [Troubleshooting](./troubleshooting.md)

## Scope

These docs are aligned with the active backend runtime:

- Entry point: `backend/src/server.js`
- Express app: `backend/src/app.js`
- API routes: `backend/src/api/routes`
- OpenAPI docs: `backend/src/docs/openapi.js`

## Quick Links

- Swagger UI: `/docs`
- OpenAPI JSON: `/openapi.json`
- ReDoc: `/redoc`
- Health: `/api/health`
- Metrics: `/metrics`
- Backend runtime README: [`backend/README.md`](/Users/la/Desktop/Repository/horacenjoroge/Trainly/backend/README.md)

## Diagram Coverage

The backend docs include Mermaid diagrams for:

- high-level backend architecture
- auth and JWT lifecycle
- workout creation and stats/achievement side effects
- social posts and feed flow
- SOS/emergency handling
- upload/storage handling
- data model relationships
- event/job behavior
