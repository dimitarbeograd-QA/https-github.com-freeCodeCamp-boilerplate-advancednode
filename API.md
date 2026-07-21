# API документация — Advanced Node & Express

## `GET /`
Рендира началната страница (`views/pug`).

## `POST /register`
Регистрира нов потребител и го логва автоматично.

**Body** (`application/x-www-form-urlencoded` или `json`)
| Поле | Тип | Описание |
|---|---|---|
| `username` | string | Уникално потребителско име |
| `password` | string | Парола (виж `SECURITY.md` — в момента без hashing) |

**Отговори**
- `302` → `/profile` при успех.
- `302` → `/` ако username вече съществува, или при auth грешка.

## `POST /login`
Автентикира съществуващ потребител (Passport `LocalStrategy`).

**Body**: `username`, `password`.

**Отговори**
- `302` → `/profile` при успех.
- `302` → `/` при неуспешен логин (`failureRedirect`).

## `GET /profile`
Защитен маршрут (`ensureAuthenticated`) — показва потребителското име.

**Отговори**
- `200` с рендерирания `profile` изглед, ако сесията е валидна.
- `302` → `/` ако няма активна сесия.

## `GET /logout`
Прекратява текущата сесия.

**Отговори**
- `302` → `/`.

## 404
Всеки друг маршрут връща `404` с plain text `"Not Found"`.
