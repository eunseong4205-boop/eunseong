# eunseong

## Codex GitHub Actions

`.github/workflows/codex.yml`에 Codex 수동 실행 워크플로가 있습니다.

1. Settings → Secrets and variables → Actions → New repository secret에서 `OPENAI_API_KEY`를 등록합니다. 키를 코드나 이슈에 넣지 마세요.
2. Actions → Codex → Run workflow에서 요청을 입력하고 실행합니다.
3. 실행 결과는 Run Codex 작업 로그에서 확인합니다.

main에 push하면 API 키 등록 여부만 검사합니다. 실제 Codex 실행은 수동 실행할 때만 수행합니다. 키가 없으면 수동 실행은 중단됩니다. 등록 검사 성공은 키의 유효성이나 모델 실행 성공을 뜻하지 않습니다.

Codex는 읽기 전용으로 저장소를 분석하며 변경 사항을 자동 커밋하거나 배포하지 않습니다. API 호출 비용은 OpenAI API 계정에 적용됩니다.

공식 안내: https://learn.chatgpt.com/docs/github-action
