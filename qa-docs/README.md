# QA документация — Advanced Node & Express boilerplate

## Съдържание
- [`TEST_PLAN.md`](TEST_PLAN.md) — стратегия, обхват, известни рискове и критерии за приемане.
- [`TEST_CASES.md`](TEST_CASES.md) — детайлни тест кейсове за auth/session flow.
- Bug report шаблон: [`.github/ISSUE_TEMPLATE/bug_report.md`](../.github/ISSUE_TEMPLATE/bug_report.md).

## Как да докладваш бъг
1. Отвори нов Issue в GitHub.
2. Избери темплейта **Bug report**.
3. За security-свързани находки (напр. password handling), отбележи ясно приоритет P1.

## Приоритети
- **P1** — критична функционалност/сигурност (auth, сесии, достъп до `/profile`).
- **P2** — важна, но не блокираща функционалност.
- **P3** — козметични/edge-case проблеми.
