# Contributing

## Как да допринесеш
1. `npm install`
2. Копирай `sample.env` в `.env` и попълни локални стойности (никога не commit-вай `.env`).
3. `npm run dev` (nodemon) за локална разработка.
4. Тествай auth flow-а ръчно по [`qa-docs/TEST_CASES.md`](qa-docs/TEST_CASES.md) преди commit.
5. Ако пипаш auth/session логиката, отбележи security импликациите в PR описанието.

## Docs
- [`README.md`](README.md)
- [`API.md`](API.md) — при промяна на маршрути
- [`qa-docs/TEST_CASES.md`](qa-docs/TEST_CASES.md)
- [`CHANGELOG.md`](CHANGELOG.md)
