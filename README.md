# eunseong · CINEPULSE

영화 박스오피스 TOP 10과 관객수·매출 전망을 비교하는 Next.js + TypeScript + Tailwind 웹앱입니다. 앱 소스와 상세 설명은 [cinepulse/README.md](cinepulse/README.md)에 있습니다.

```bash
cd cinepulse
npm ci
npm run dev:next
```

기본 실행은 API 키가 필요 없는 샘플 모드입니다. `http://localhost:3000`에서 일·주간 대시보드, 검색·장르·기간 필터, 영화 상세의 7·14·30일 예측, 구간 표시, 경쟁작 비교를 사용할 수 있습니다.

실적·예매율은 가상 시나리오이며 예측은 학습되지 않은 데모 모델입니다. KOBIS 실적 연결은 서버 환경 변수 `KOBIS_API_KEY`를 사용합니다. 공개 API에 예매율은 없어 실제 모드에서는 미제공으로 표시합니다.

## GitHub Actions

기존 `.github/workflows/codex.yml`의 **Repository checks**를 확장했습니다. main push, PR 생성·업데이트·다시 열기, 수동 실행 시 공백·병합 충돌 검사 후 잠금 의존성 설치, 타입 검사, 데이터 테스트, 실제 Next.js production build를 실행합니다. 표준 GitHub-hosted Ubuntu 러너와 Node.js 24를 사용하며, 유료 AI API 및 API 키를 사용하지 않습니다.

로컬 검증은 `npm run typecheck`, `npm test`, `npm run build:next`입니다. Sites 배포용 Worker 빌드는 `npm run build`로 별도 실행합니다.

[GitHub Actions 실행](https://github.com/eunseong4205-boop/eunseong/actions)
