````markdown
# 실시간 가상 대기열 및 데이터 기반 혼잡도 예측 시스템

학식당 대기 문제 해결을 위한 웹 기반 스마트 대기열 관리 서비스입니다.

사용자는 웹에서 학식당의 현재 혼잡도, 대기 인원, 예상 대기 시간을 확인하고, 가상 번호표를 발급받아 온라인으로 대기할 수 있습니다.  
운영자는 운영자 대시보드에서 현재 대기열을 확인하고, 사용자를 호출하거나 입장 완료, 노쇼 처리를 수행할 수 있습니다.

본 프로젝트는 단순히 번호표를 발급하는 데 그치지 않고, 대기 등록, 호출, 도착 확인, 입장 완료, 취소, 노쇼 등의 상태 변화 이벤트를 데이터베이스에 누적 저장합니다.  
이를 기반으로 시간대별 등록 수, 처리 수, 노쇼 수, 평균 대기 시간, 평균 처리 시간, 15분 뒤 예상 대기 인원 등을 계산하는 것을 목표로 합니다.

---

## 주요 기능

### 사용자 기능

- 학식당 목록 조회
- 학식당 현재 혼잡도 확인
- 가상 번호표 발급
- `queue_id + access_code` 기반 내 대기 상태 조회
- 도착 확인
- 대기 취소

### 운영자 기능

- 운영자 대기열 조회
- 다음 순번 호출
- 특정 사용자 호출
- 입장 완료 처리
- 노쇼 처리
- 운영자 대시보드 조회

### 통계 및 예측 기능

- 대기 등록, 호출, 도착 확인, 입장 완료, 취소, 노쇼 이벤트 저장
- 오늘 등록 수 계산
- 오늘 처리 수 계산
- 오늘 노쇼 수 계산
- 평균 대기 시간 계산
- 평균 처리 시간 계산
- 시간대별 등록/처리/노쇼 수 계산
- 최근 15분 유입/처리 데이터 기반 15분 뒤 예상 대기 인원 계산

---

## MVP 범위

본 프로젝트의 MVP는 다음 범위를 기준으로 구현합니다.

- REST API 기반 통신
- Polling 기반 상태 갱신
- SQLite 기반 데이터 저장
- `queue_entries` 현재 상태 저장
- `queue_events` 상태 변화 이벤트 저장
- `queue_events` 직접 집계 기반 통계 계산
- Docker Compose 기반 통합 개발환경

다음 기능은 MVP에서 제외하고 확장 기능으로 둡니다.

- WebSocket 기반 실시간 알림
- 자동 노쇼 처리
- 노쇼 페널티 기능
- 관리자 로그인
- JWT 기반 인증
- PostgreSQL 전환
- 실제 학식당 운영 데이터 연동
- AI/ML 기반 예측
- 저장형 통계 테이블 자동 갱신

---

## 기술 스택

### Frontend

- React
- Vite
- Tailwind CSS
- Recharts
- Axios 또는 Fetch API

### Backend

- Python
- FastAPI
- SQLAlchemy
- Pydantic
- Uvicorn

### Database

- SQLite
- PostgreSQL 확장 가능

### Collaboration / Infra

- GitHub
- Jira
- Docker
- Docker Compose

---

## 프로젝트 구조

```text
team-project/
├── .github/
│   └── PULL_REQUEST_TEMPLATE.md
│
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── database.py
│   │   ├── models/
│   │   ├── routers/
│   │   ├── schemas/
│   │   ├── services/
│   │   └── seed.py
│   ├── Dockerfile
│   └── requirements.txt
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── Dockerfile
│   ├── package.json
│   └── vite.config.js
│
├── data/
│   └── .gitkeep
│
├── docker-compose.yml
├── .env.example
├── .gitignore
└── README.md
````

---

## Getting Started

### 1. Clone Repository

```bash
git clone <repository-url>
cd team-project
```

### 2. Run Project with Docker Compose

```bash
docker compose up --build
```

### 3. Access

```text
Frontend : http://localhost:5173
Backend  : http://localhost:8000
Swagger  : http://localhost:8000/docs
Health   : http://localhost:8000/health
```

### 4. Stop Project

```bash
docker compose down
```

---

## Local Development

Docker Compose 사용을 기본 개발 방식으로 권장합니다.

필요한 경우 프론트엔드와 백엔드를 각각 로컬에서 실행할 수 있습니다.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

접속 주소:

```text
http://localhost:5173
```

### Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

접속 주소:

```text
http://localhost:8000
http://localhost:8000/docs
```

---

## Environment Variables

환경변수 예시는 `.env.example` 파일을 참고합니다.

### Frontend

```text
VITE_API_BASE_URL=http://localhost:8000
```

### Backend

```text
BACKEND_PORT=8000
FRONTEND_PORT=5173
DATABASE_URL=sqlite:////data/app.db
```

`.env` 파일은 로컬 환경에서만 사용하며 Git에 커밋하지 않습니다.

---

## 핵심 상태값

대기표 상태는 다음 값을 사용합니다.

```text
WAITING  : 대기 중
CALLED   : 운영자가 호출함
ARRIVED  : 사용자가 도착 확인함
SERVED   : 입장 완료 또는 응대 완료
CANCELED : 사용자가 대기 취소
NO_SHOW  : 호출 후 미응답으로 노쇼 처리
```

---

## 상태 전환 규칙

허용되는 상태 전환은 다음과 같습니다.

```text
WAITING → CALLED
WAITING → CANCELED

CALLED → ARRIVED
CALLED → SERVED
CALLED → CANCELED
CALLED → NO_SHOW

ARRIVED → SERVED
```

다음 규칙을 반드시 지킵니다.

* 도착 확인은 `CALLED` 상태에서만 가능
* 입장 완료는 `CALLED` 또는 `ARRIVED` 상태에서만 가능
* 노쇼 처리는 `CALLED` 상태에서만 가능
* 대기 취소는 `WAITING` 또는 `CALLED` 상태에서만 가능
* `SERVED`, `CANCELED`, `NO_SHOW` 상태는 최종 상태로 처리

---

## 핵심 DB 설계

MVP에서 사용하는 핵심 테이블은 다음과 같습니다.

```text
stores
queue_entries
queue_events
```

### stores

학식당 정보를 저장합니다.

### queue_entries

발급된 대기표의 현재 상태를 저장합니다.

### queue_events

대기 등록, 호출, 도착 확인, 입장 완료, 취소, 노쇼 등의 상태 변화 이벤트를 저장합니다.

MVP에서는 `queue_events`를 직접 집계하여 통계 API를 제공합니다.

확장 단계에서 다음 테이블을 사용할 수 있습니다.

```text
congestion_stats
no_show_records
```

---

## 주요 API 계획

### Health

```text
GET /health
```

### 사용자 조회 API

```text
GET /api/stores
GET /api/stores/{store_id}
GET /api/stores/{store_id}/status
GET /api/stores/{store_id}/prediction
```

### 대기열 사용자 API

```text
POST /api/queues
GET /api/queues/{queue_id}?code={access_code}
DELETE /api/queues/{queue_id}?code={access_code}
POST /api/queues/{queue_id}/confirm-arrival?code={access_code}
```

### 운영자 API

```text
GET /api/admin/stores/{store_id}/queues
POST /api/admin/stores/{store_id}/call-next
POST /api/admin/queues/{queue_id}/call
POST /api/admin/queues/{queue_id}/serve
POST /api/admin/queues/{queue_id}/no-show
GET /api/admin/stores/{store_id}/dashboard
```

### 통계 API

```text
GET /api/stores/{store_id}/stats/summary
GET /api/stores/{store_id}/stats/hourly
GET /api/stores/{store_id}/stats
```

---

## Branch Strategy

* `main` : 안정 버전 / 최종 제출
* `develop` : 통합 개발 브랜치
* 작업 브랜치 : Jira Issue 단위로 생성

예시:

```text
KAN-1-github-pr-template
KAN-2-week1-project-setup
KAN-3-store-api
KAN-4-queue-api
KAN-5-admin-api
KAN-6-stats-api
```

---

## Commit Convention

형식:

```text
type: KAN-번호 작업내용
```

예시:

```text
docs: KAN-1 PR template 추가
chore: KAN-2 프로젝트 초기 개발환경 구성
feat: KAN-3 학식당 조회 API 구현
feat: KAN-4 번호표 발급 API 구현
feat: KAN-5 운영자 호출 API 구현
feat: KAN-6 통계 API 구현
fix: KAN-7 대기 상태 계산 오류 수정
```

### Type

* `feat` : 기능 추가
* `fix` : 버그 수정
* `docs` : 문서 수정
* `chore` : 설정 / 기타 작업
* `refactor` : 코드 개선
* `style` : UI 스타일 수정
* `test` : 테스트 코드

---

## Pull Request Title Rule

Squash and Merge 기준으로 PR 제목은 아래 형식을 사용합니다.

형식:

```text
type: KAN-번호 작업내용
```

예시:

```text
chore: KAN-2 Week1 프로젝트 초기 개발환경 구성
feat: KAN-3 학식당 조회 API 구현
feat: KAN-4 번호표 발급 API 구현
fix: KAN-5 상태 전환 오류 수정
```

---

## Workflow

```text
Issue 생성
→ develop 최신화
→ 작업 브랜치 생성
→ 개발 및 commit
→ Pull Request 생성
→ Review
→ Squash and Merge
→ develop 반영
```

작업 전 develop 최신화:

```bash
git checkout develop
git pull origin develop
git checkout -b KAN-번호-작업명
```

---

## Week1 완료 기준

Week1의 목표는 기능 구현보다 공통 개발환경 구축입니다.

다음 항목이 확인되면 Week1 초기 세팅이 완료된 것으로 봅니다.

```text
[ ] docker compose up --build 성공
[ ] Frontend 접속 가능: http://localhost:5173
[ ] Backend 접속 가능: http://localhost:8000
[ ] Swagger 접속 가능: http://localhost:8000/docs
[ ] Health API 응답 확인: http://localhost:8000/health
[ ] SQLite DB 파일 생성 확인
[ ] README 실행 방법 검증
```

---

## Notes

* MVP에서는 WebSocket 대신 Polling을 사용합니다.
* MVP에서는 관리자 로그인과 JWT 인증을 구현하지 않습니다.
* MVP에서는 SQLite를 사용합니다.
* MVP에서는 `queue_events`를 직접 집계하여 통계를 계산합니다.
* `congestion_stats`와 `no_show_records`는 확장 기능에서 사용합니다.
* 기능 구현 시 상태 전환 규칙은 백엔드에서 반드시 검증해야 합니다.

