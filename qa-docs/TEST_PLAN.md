# Test Plan — Advanced Node & Express (freeCodeCamp boilerplate)

## 1. Обхват
Express приложение с Passport local автентикация, express-session, MongoDB
за потребителски данни и Pug изгледи. Маршрути: `/` (index), `/register`
(POST), `/login` (POST), `/profile` (GET, защитен), `/logout` (GET).

## 2. Цели на тестването
- Регистрация и логин флоу да работят коректно с валидни/невалидни данни.
- `/profile` да е достъпен само за автентикирани потребители (`ensureAuthenticated`).
- Сесиите да се поддържат правилно между заявки (cookie-based).
- Logout да прекратява сесията напълно.
- Грешки при връзка с MongoDB да се обработват грациозно (виж fallback route в `server.js`).

## 3. Тестова среда
| Компонент | Детайли |
|---|---|
| Runtime | Node.js + Express |
| Auth | Passport (LocalStrategy), express-session |
| DB | MongoDB (`connection.js`, чрез `.env`/`sample.env`) |
| View engine | Pug (`views/pug`) |

## 4. Видове тестове
1. **Функционално** — register/login/logout/profile flow.
2. **Security** — session fixation/hijacking, парола handling, unauthorized достъп до `/profile`.
3. **Data validation** — дублирани username-и при регистрация, липсващи полета.
4. **Error handling** — поведение при недостъпна база данни.
5. **Regression** — при промени в auth middleware или маршрути.

## 5. Известни рискове за проверка
- Паролите се сравняват директно (`password !== user.password`) без hashing/bcrypt
  на местата, видими в `server.js` — въпреки че `bcrypt` е dependency в
  `package.json`. Да се тества и документира дали паролите се съхраняват
  в plain text в базата (сериозен security риск, ако е така).
- `cookie: { secure: false }` в session конфигурацията — означава, че cookie-то
  се изпраща и по нешифрован HTTP; да се провери дали е нужно `secure: true` в production.

## 6. Критерии за приемане
- Неавтентикиран потребител, опитващ `/profile`, се пренасочва към `/`.
- Регистрация с вече съществуващ username не създава дублиран запис.
- Logout инвалидира сесията — последващ достъп до `/profile` изисква нов логин.

## 7. Изходни артефакти
- `TEST_CASES.md` — детайлни тест кейсове.
- Bug report-и през `.github/ISSUE_TEMPLATE/bug_report.md`.
