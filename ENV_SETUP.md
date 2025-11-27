# 환경 변수 설정 가이드

이 문서는 Admin Backend와 Frontend의 환경 변수 설정 방법을 안내합니다.

## 📁 Admin-Backend/.env

`Admin-Backend` 폴더에 `.env` 파일을 생성하고 다음 내용을 추가하세요:

```env
# 서버 포트 (기본값: 3000)
PORT=3000

# Frontend URL (CORS 설정용)
# Frontend가 실행되는 주소를 입력하세요
FRONTEND_URL=http://localhost:5173

# MongoDB 연결 URI
# 로컬 MongoDB 사용 시:
MONGODB_URI=mongodb://localhost:27017/hotel-admin

# MongoDB Atlas 사용 시:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/hotel-admin

# JWT Secret Key (토큰 서명에 사용)
# 보안을 위해 강력한 랜덤 문자열을 사용하세요
# 예: openssl rand -base64 32 명령어로 생성 가능
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

### 필수 환경 변수

| 변수명 | 설명 | 예시 |
|--------|------|------|
| `PORT` | Backend 서버 포트 번호 | `3000` |
| `FRONTEND_URL` | Frontend 주소 (CORS 허용용) | `http://localhost:5173` |
| `MONGODB_URI` | MongoDB 연결 URI | `mongodb://localhost:27017/hotel-admin` |
| `JWT_SECRET` | JWT 토큰 서명 키 | `your-secret-key-here` |

### 선택적 환경 변수 (AWS S3 사용 시)

```env
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_REGION=ap-northeast-2
AWS_S3_BUCKET_NAME=your-bucket-name
```

---

## 📁 Admin-Frontend/.env

`Admin-Frontend` 폴더에 `.env` 파일을 생성하고 다음 내용을 추가하세요:

```env
# Backend API Base URL
# 개발 환경 (Backend 포트와 일치해야 함):
# ⚠️ Frontend 포트(5173)가 아닌 Backend 포트(3000)를 사용하세요!
VITE_API_BASE_URL=http://localhost:3000/api

# 프로덕션 환경 (실제 배포 시):
# VITE_API_BASE_URL=https://your-backend-domain.com/api

# Mock API 사용 여부
# true: 더미 데이터 사용 (Backend 연결 없이 개발 가능)
# false: 실제 Backend API 사용 (기본값)
VITE_USE_MOCK=false
```

### 필수 환경 변수

| 변수명 | 설명 | 예시 |
|--------|------|------|
| `VITE_API_BASE_URL` | Backend API 기본 URL | `http://localhost:3000/api` |
| `VITE_USE_MOCK` | Mock API 사용 여부 | `false` (실제 API 사용) |

---

## 🚀 사용 방법

### 1. Backend 환경 변수 설정

```bash
# Admin-Backend 폴더로 이동
cd Admin-Backend

# .env 파일 생성 (Windows)
copy NUL .env

# .env 파일 생성 (Mac/Linux)
touch .env

# .env 파일 편집하여 위의 내용 추가
```

### 2. Frontend 환경 변수 설정

```bash
# Admin-Frontend 폴더로 이동
cd Admin-Frontend

# .env 파일 생성 (Windows)
copy NUL .env

# .env 파일 생성 (Mac/Linux)
touch .env

# .env 파일 편집하여 위의 내용 추가
```

### 3. JWT Secret 생성 (선택사항)

강력한 JWT Secret을 생성하려면:

**Windows (PowerShell):**
```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

**Mac/Linux:**
```bash
openssl rand -base64 32
```

생성된 값을 `.env` 파일의 `JWT_SECRET`에 설정하세요.

---

## ⚠️ 주의사항

1. **`.env` 파일은 절대 Git에 커밋하지 마세요!**
   - `.gitignore`에 이미 포함되어 있어야 합니다.

2. **프로덕션 환경에서는 반드시 강력한 `JWT_SECRET`을 사용하세요.**

3. **`VITE_USE_MOCK=false`로 설정하면 실제 Backend와 연결됩니다.**
   - Backend 서버가 실행 중이어야 합니다.

4. **MongoDB가 실행 중이어야 Backend가 정상 작동합니다.**

---

## 📝 API 경로 구조

### Backend API 경로
- 인증: `/api/admin/auth/*`
- 사업자 관리: `/api/admin/businesses/*`
- 숙소 관리: `/api/admin/lodgings/*`
- 리뷰 관리: `/api/admin/reviews/*`
- 프로모션(쿠폰): `/api/admin/promotions/*`
- 대시보드: `/api/admin/dashboard/*`

### Frontend API 호출
- 모든 API 호출은 `VITE_API_BASE_URL`을 기본 URL로 사용합니다.
- 예: `http://localhost:3000/api` + `/admin/auth/login` = `http://localhost:3000/api/admin/auth/login`

## 🔗 포트 설정 요약

### ⚠️ 중요: Frontend와 Backend는 다른 포트를 사용해야 합니다!

### 현재 설정 (기본값)

**Frontend: 5173, Backend: 3000**
- **Frontend**: `http://localhost:5173` (Vite 개발 서버)
- **Backend**: `http://localhost:3000` (Express 서버)
- **Frontend .env**: 
  ```env
  VITE_API_BASE_URL=http://localhost:3000/api
  ```
- **Backend .env**: 
  ```env
  PORT=3000
  FRONTEND_URL=http://localhost:5173
  ```

### 동작 방식
1. Frontend (5173)에서 사용자가 페이지 접속
2. Frontend가 Backend (3000)로 API 요청
3. Backend가 `FRONTEND_URL=http://localhost:5173`을 확인하여 CORS 허용

