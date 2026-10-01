# VELORA — Production Deployment Architecture & Operations Guide

## 1. Architecture Overview

VELORA is architected as an application operating system that separates concerns between edge distribution, containerized backend microservices, and multi-model data infrastructure.

```
                           [ Internet Traffic ]
                                    │
                                    ▼
                     [ Edge Layer / Anycast CDN ]
                 (Vercel / Cloudflare / K8s Ingress TLS)
                                    │
           ┌────────────────────────┴────────────────────────┐
           ▼                                                 ▼
[ velora-web (Next.js) ]                          [ velora-api-gateway ]
(Port 3000, 3-30 Replicas)                        (Port 4000, 3-30 Replicas)
           │                                                 │
           │                                 ┌───────────────┴───────────────┐
           │                                 ▼                               ▼
           │                      [ velora-realtime ]                [ velora-worker ]
           │                      (WebSocket Mesh, 4001)             (Background Queue)
           │                                 │                               │
           └────────────────────────┬────────┴───────────────────────────────┘
                                    │
                                    ▼
                  [ Multi-Model Data & Storage Tier ]
          ┌─────────────────────────┼─────────────────────────┐
          ▼                         ▼                         ▼
 [ PostgreSQL 17 + pgvector ]   [ Redis 7 Cache ]    [ S3 / MinIO Storage ]
   (Port 5432, HNSW Index)       (Cluster Mesh, 6379)     (Buckets, 9000)
```

---

## 2. Environment Separation

| Environment | Host Domain | Infrastructure Target | Autoscaling | Replicas |
|---|---|---|---|---|
| **Local** | `localhost:3000` | Docker Compose | Static | 1 |
| **Development** | `dev.velora.internal` | K8s (`dev-` overlay) | Static | 1 |
| **Preview** | `pr-*.preview.velora.internal` | Ephemeral Namespace | Static | 1 per PR |
| **Staging** | `staging.velora.internal` | K8s (`staging-` overlay) | Enabled | 2-5 |
| **Production** | `app.velora.internal` | K8s (`prod-` overlay) / Helm | HPA Enabled | 3-30 |

---

## 3. Local & Dev Container Stack (Docker Compose)

The full containerized platform can be launched locally with one command:

```bash
docker compose -f deploy/docker/docker-compose.yml up -d
```

### Services Started:
- **`velora-web`**: Next.js dashboard and landing interface at [http://localhost:3000](http://localhost:3000)
- **`velora-api-gateway`**: Unified REST and GraphQL proxy at [http://localhost:4000](http://localhost:4000)
- **`velora-postgres`**: PostgreSQL 17 with `pgvector` extension enabled at `localhost:5432`
- **`velora-redis`**: In-memory cache and pubsub at `localhost:6379`
- **`velora-minio`**: S3-compatible object storage at `localhost:9000` (Console at `localhost:9001`)

To stop the stack:
```bash
docker compose -f deploy/docker/docker-compose.yml down
```

---

## 4. Kubernetes Production Deployment

### Option A: Deploy via Kustomize (GitOps Native)

```bash
# 1. Apply Namespace and Base Resources
kubectl apply -k deploy/k8s/overlays/production

# 2. Verify Rollout Status
kubectl rollout status deployment/prod-velora-web -n velora
kubectl rollout status deployment/prod-velora-api -n velora
```

### Option B: Deploy via Helm

```bash
# Install or upgrade chart
helm upgrade --install velora deploy/helm/velora \
  --namespace velora \
  --create-namespace \
  --values deploy/helm/velora/values.yaml
```

---

## 5. Zero-Downtime Deployment & Rolling Strategy

Both Web and API deployments enforce a zero-downtime rolling update strategy:

```yaml
strategy:
  type: RollingUpdate
  rollingUpdate:
    maxSurge: 25%        # Spawns new pods before terminating old pods
    maxUnavailable: 0    # Ensures 100% capacity remains online during updates
```

### Health Check Probes
- **Liveness Probe**: `GET /api/health` (Web) or `GET /health` (API). Restarts unhealthy pods after 3 consecutive failures.
- **Readiness Probe**: `GET /api/health` (Web) or `GET /health` (API). Prevents traffic from routing to a new container until initialized.

### Pod Disruption Budget (PDB)
Ensures at least 66% of replicas are operational during node drains or cluster upgrades:
```yaml
apiVersion: policy/v1
kind: PodDisruptionBudget
metadata:
  name: velora-web-pdb
  namespace: velora
spec:
  minAvailable: 66%
```

---

## 6. Elastic Horizontal Pod Autoscaling (HPA)

The system automatically scales between **3 and 30 pods** based on traffic load:
- **CPU Threshold**: 70% average utilization
- **Memory Threshold**: 80% average utilization

Inspect active autoscalers:
```bash
kubectl get hpa -n velora
```

---

## 7. Automated Rollback Procedures

If an anomalous error rate or performance regression is detected post-deployment, initiate an instantaneous rollback:

```bash
# Rollback Web deployment to previous release
kubectl rollout undo deployment/prod-velora-web -n velora

# Rollback API Gateway deployment
kubectl rollout undo deployment/prod-velora-api -n velora

# Check rollout history
kubectl rollout history deployment/prod-velora-web -n velora
```

---

## 8. Backup & Disaster Recovery

An automated CronJob (`velora-db-backup-cron`) executes every 6 hours (`0 */6 * * *`):
1. Captures full physical database snapshot with `pg_dumpall`.
2. Encrypts archive using AES-256.
3. Streams backup bundle to an off-site object storage bucket.
4. Continuous WAL archiving guarantees Point-in-Time Recovery (PITR) up to 30 days.

Trigger an ad-hoc backup on demand:
```bash
kubectl create job --from=cronjob/velora-db-backup-cron adhoc-backup-$(date +%s) -n velora
```

---

## 9. Observability & Telemetry

- **Prometheus Metrics**: Scraped from `/metrics` endpoints across all pods.
- **OpenTelemetry Traces**: Distributed spans forwarded via OTel Collector with sub-millisecond waterfall latency analysis.
- **Health Verification**:
  ```bash
  curl -s https://app.velora.internal/api/health
  ```
