
# CMS for Vue and Laravel

This project is a simple CMS integrating Vue.js and Laravel. No database needed.

## Features

- CMS elements interactivity is implemented using Vue directives.
- CMS data is currently stored in `storage/cms/cms.json`.

## Usage

## Usage

Press **Alt** on the site to highlight elements editable via the CMS.  
Right-click an element to open the CMS menu. Changes are saved and persist after page refresh.

### In Code

Use **directives** to mark elements that should be managed by the CMS.  
Pass a **name** as a property to indicate where data is stored.

Example:
```html
<div v-cms-text-element="['text_test']" v-html="cmsData['text_test'] ?? 'Lorem ipsum'"></div>
```
If cms.json contains a value for ['<current_site_url>']['text_test'], it will bind to the element and be editable.
If no value exists, the element shows the default ('Lorem ipsum') and is still editable.
Saving updates the JSON so the changes are available when the page is loaded again.


## Future Plans

TODO:
- Validate cms.json
- change cms.json to allow for atomic operations
- more types cms elements
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
# Linux / macOS 
cp .env.example .env
# Windows CMD
copy .env.example .env
# Windows PowerShell
Copy-Item .env.example .env
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
