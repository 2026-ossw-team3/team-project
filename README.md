# PC Resource Monitor

웹 기반 PC 시스템 자원 모니터링 프로젝트입니다.  
현재 PC의 CPU, Memory, Disk 사용량 등의 데이터를 수집하여 대시보드 형태로 시각화합니다.

---

## Features

- CPU / Memory / Disk 사용률 모니터링
- 주기적 데이터 갱신 (Polling)
- 리소스 사용량 그래프 시각화
- 상위 프로세스 TOP5 조회
- 임계치 초과 알림 기능

---

## Tech Stack

### Frontend
- React
- Vite
- Tailwind CSS
- Recharts

### Backend
- Python
- FastAPI
- psutil

### Collaboration / Infra
- GitHub
- Jira
- Docker

---

## Project Structure

```text
pc-resource-monitor/
├── frontend/
├── backend/
├── docs/
└── README.md
```

---

## Getting Started

### 1. Clone Repository

```bash
git clone https://github.com/2026-ossw-team3/pc-resource-monitor.git
cd pc-resource-monitor
```

### 2. Run Project

```bash
docker compose up --build
```

### 3. Access

```text
Frontend : http://localhost:5173
Backend  : http://localhost:8000
Docs     : http://localhost:8000/docs
```

---

## Branch Strategy

- `main` : 안정 버전 / 최종 제출
- `develop` : 통합 개발 브랜치
- 작업 브랜치 : Jira Issue 단위 생성

예시:

```text
KAN-1-github-pr-template
KAN-2-dashboard-ui
KAN-3-stats-api
KAN-4-process-top5
```

---

### Type

- `feat` : 기능 추가
- `fix` : 버그 수정
- `docs` : 문서 수정
- `chore` : 설정 / 기타 작업
- `refactor` : 코드 개선
- `style` : UI 스타일 수정
- `test` : 테스트 코드

---

## Commit Convention

형식:

```text
type: KAN-번호 작업내용
```

예시:

```text
docs: KAN-1 PR template 추가
feat: KAN-2 dashboard UI 생성
feat: KAN-3 stats API 구현
fix: KAN-4 polling 오류 수정
chore: KAN-5 docker 설정 추가
```

---

## Pull Request Title Rule

Squash and Merge 기준으로 PR 제목은 아래 형식을 사용합니다.

형식:

```text
type: KAN-번호 작업내용
```

예시:

```text
docs: KAN-1 PR template 추가
feat: KAN-2 dashboard UI 생성
feat: KAN-3 stats API 구현
fix: KAN-4 polling 오류 수정
chore: KAN-5 docker 설정 추가
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

---

## Notes

현재 프로젝트는 Polling 기반 준실시간 모니터링 방식으로 구현합니다.  
향후 WebSocket 기반 실시간 확장 가능성을 고려합니다.

