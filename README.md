
# CMS for Vue and Laravel

This project is a simple CMS integrating Vue.js and Laravel. No database needed.

## Features

- CMS elements interactivity is implemented using Vue directives.
- CMS data is currently stored in `/public/json/cms.json`.

## Future Plans

TODO:
- Validate cms.json
- change cms.json to be in storage and allow for atomic operations
- more types cms elements
- login to obtain admin permissions
- option hide/show cms elements
- documentation
- creating and customizing new sites

## Run Locally

```bash
git clone https://github.com/EpicFrog2000/vue_laravel_cms.git
```

```bash
cd vue_laravel_cms
```

```bash
composer install
```

```bash
php artisan key:generate
```

```bash
npm install
```

```bash
npm run build
```

```bash
php artisan serve
```

```bash
npm run dev
```
