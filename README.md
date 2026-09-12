# eunseong

## GitHub Actions

Actions의 **Repository checks**는 main push, pull request, 수동 실행 시 공백 오류와 미해결 병합 충돌 표시를 검사합니다.
워크플로 파일은 `.github/workflows/codex.yml`입니다.

아직 애플리케이션 코드가 없어 앱 테스트 및 빌드는 설정되지 않았습니다. 개발 언어와 프로젝트가 정해지면 해당 검사를 추가합니다.

공개 저장소의 표준 GitHub-hosted Ubuntu 러너를 사용합니다. 이 워크플로는 OpenAI API를 호출하지 않으며 API 키를 사용하지 않습니다.

## Codex에서 작업

Codex 앱에서 이 저장소 주소를 알려주고 코드 작업을 요청합니다:
https://github.com/eunseong4205-boop/eunseong

Codex가 변경 사항을 GitHub에 반영하면 Actions 검사가 실행됩니다.
Codex 앱의 사용량은 해당 로그인 계정과 플랜에 따르며, GitHub Actions 무료 실행과는 별개입니다.
GitHub Actions 실행이 Codex 앱에 자동으로 새 작업을 보내는 구성은 아닙니다.

기존 `OPENAI_API_KEY` Secret은 현재 워크플로에서 참조하지 않습니다.

- Actions 실행: https://github.com/eunseong4205-boop/eunseong/actions
- GitHub Actions 요금 안내: https://docs.github.com/en/billing/concepts/product-billing/github-actions
