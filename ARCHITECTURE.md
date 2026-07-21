# Архитектура — Advanced Node & Express

## Общ преглед
Express приложение с Passport local автентикация, express-session за
сесии, MongoDB за потребителски данни и Pug за server-side рендиране.

## Основен flow (`server.js`)
1. Express app + Pug view engine (`views/pug`).
2. Middleware: `express.json()`, `express.urlencoded()`, `express-session`, `passport.initialize()`, `passport.session()`.
3. Свързване с MongoDB (`connection.js`) — при успех регистрира Passport `LocalStrategy` и маршрутите `/login`, `/register`, `/profile`, `/logout`.
4. При неуспешна DB връзка — fallback route, който рендира грешка вместо да краша сървъра.

## Маршрути
Виж [`API.md`](API.md) за пълна спецификация.

| Маршрут | Метод | Защитен | Описание |
|---|---|---|---|
| `/` | GET | Не | Начална страница |
| `/register` | POST | Не | Регистрация + auto-login |
| `/login` | POST | Не | Вход (Passport LocalStrategy) |
| `/profile` | GET | Да (`ensureAuthenticated`) | Профил на логнатия потребител |
| `/logout` | GET | Да (сесийно) | Изход |

## Данни
MongoDB колекция `users` с полета `username`, `password` (виж `SECURITY.md`
относно риска с plaintext съхранение).

## Препоръки за бъдещо развитие
- Хеширане на пароли с `bcrypt` (вече е dependency, но не се използва в
  текущия `server.js` — виж `SECURITY.md`).
- Разделяне на маршрутите в отделен `routes/` модул при растеж на кода.
