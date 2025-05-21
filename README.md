# PC Part Maker AI

## 1. 백엔드 실행

```bash
cd backend
npm install
# Firebase 서비스 계정 키 파일 복사 (your-service-account-file.json)
npm run seed # 샘플 데이터 입력
npm start    # API 서버 실행
```

## 2. 프론트엔드 실행

```bash
cd frontend
npm install
npm run dev
```

## 3. Firestore 보안 규칙 적용

Firebase 콘솔 > Firestore Database > 규칙 탭에 backend/firestore.rules 내용 붙여넣기

---

- 실제 서비스 계정 키, Firebase 프로젝트 ID, API 키 등은 본인 프로젝트에 맞게 입력 필요
- 모든 코드는 "복사-붙여넣기"만 하면 바로 동작
- 추가로 원하면 GitHub 리포지토리 구조, 배포 스크립트, CI/CD 등도 제공 가능 