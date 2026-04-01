# ✝️ 설교 비서 — 배포 안내서

Claude AI로 연령대별 맞춤 설교를 생성하는 웹 애플리케이션입니다.

---

## 📁 폴더 구조
```
sermon-assistant/
├── src/app/
│   ├── page.js          ← 메인 앱 화면
│   ├── layout.js        ← HTML 레이아웃
│   ├── globals.css      ← 전체 스타일
│   └── api/claude/
│       └── route.js     ← Claude API 서버 프록시
├── package.json
├── next.config.js
├── .gitignore
└── .env.local.example   ← 환경변수 예시
```

---

## 🚀 Vercel 배포 방법 (단계별)

### 1단계 — 사전 준비
아래 계정을 만들어 주세요 (모두 무료):
- **GitHub**: https://github.com
- **Vercel**: https://vercel.com
- **Anthropic Console** (Claude API 키): https://console.anthropic.com

---

### 2단계 — GitHub에 코드 올리기

1. GitHub에 로그인
2. 우측 상단 **[+]** → **New repository** 클릭
3. Repository name: `sermon-assistant`
4. **Create repository** 클릭
5. 이 폴더 전체를 GitHub에 업로드
   - 초보자라면: **GitHub Desktop** 앱을 설치하면 드래그&드롭으로 쉽게 업로드 가능
   - https://desktop.github.com

---

### 3단계 — Vercel에 배포하기

1. **vercel.com** 접속 → **Sign Up** (GitHub 계정으로 로그인)
2. **Add New Project** 클릭
3. GitHub repository에서 `sermon-assistant` 선택
4. **Import** 클릭
5. **Environment Variables** 섹션에서 아래 추가:
   - Name: `ANTHROPIC_API_KEY`
   - Value: `sk-ant-...` (Anthropic Console에서 발급한 키)
6. **Deploy** 클릭

✅ 배포 완료! `https://sermon-assistant-xxx.vercel.app` 주소가 생성됩니다.

---

### 4단계 — 도메인 연결 (선택사항)

원하는 도메인이 있다면 Vercel 대시보드에서 연결 가능합니다.
- 예: `sermon.우리교회.com`

---

## 🔑 Claude API 키 발급 방법

1. https://console.anthropic.com 접속
2. 회원가입 후 로그인
3. 좌측 메뉴 **API Keys** → **Create Key**
4. 발급된 `sk-ant-...` 키를 Vercel 환경변수에 입력

> ⚠️ API 키는 절대 GitHub에 올리지 마세요! `.gitignore`에 이미 제외 설정되어 있습니다.

---

## 💰 비용 안내

| 항목 | 비용 |
|------|------|
| Vercel 호스팅 | **무료** (소규모) |
| Claude API | 사용량에 따라 과금 |
| 설교 1편 생성 | 약 $0.01~0.03 (10~30원) |

---

## 📞 도움이 필요하면

개발자에게 이 폴더 전체를 전달하시면 바로 배포할 수 있습니다.
