# Инструкция по загрузке на GitHub

## Шаг 1: Создайте репозиторий на GitHub

1. Перейдите на https://github.com/new
2. Название репозитория: `rybalka` (или любое другое)
3. Выберите **Public** или **Private**
4. **НЕ** добавляйте README, .gitignore или лицензию (они уже есть)
5. Нажмите **Create repository**

## Шаг 2: Подключите remote и запушьте

После создания репозитория GitHub покажет вам команды. Выполните:

```bash
git remote add origin https://github.com/YOUR_USERNAME/rybalka.git
git branch -M main
git push -u origin main
```

Или если используете SSH:

```bash
git remote add origin git@github.com:YOUR_USERNAME/rybalka.git
git branch -M main
git push -u origin main
```

**Замените `YOUR_USERNAME` на ваш GitHub username!**

## Альтернатива: Автоматическое создание через GitHub CLI

Если установите GitHub CLI (`gh`), можно создать репозиторий автоматически:

```bash
gh repo create rybalka --public --source=. --remote=origin --push
```

## GitHub Pages (деплой сайта)

Чтобы сайт открывался без ошибки 404 для `src/main.tsx`:

1. В репозитории откройте **Settings** → **Pages**.
2. В блоке **Build and deployment** выберите источник: **GitHub Actions** (не «Deploy from a branch»).
3. После каждого пуша в `main` воркфлоу «Deploy to GitHub Pages» соберёт проект и задеплоит папку `dist`.
4. Сайт будет доступен по адресу: **https://dedperdedev.github.io/tonfish/** (обязательно с путём `/tonfish/`).

