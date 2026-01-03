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

