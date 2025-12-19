<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">
        <title inertia>{{ config('app.name', 'Laravel') }}</title>
        @vite(['resources/js/app.ts', "resources/js/pages/{$page['component']}.vue"])
        <Link preserve-scroll rel="icon" href="zel_favicon.ico" type="image/x-icon">
        <meta name="description" content="Grupa Zel – firma z Łodzi specjalizująca się w wykończeniach wnętrz. Oferujemy kompleksowe usługi budowlane, remonty i aranżacje wnętrz dla klientów indywidualnych i biznesowych.">
        <meta name="author" content="Norbert Tasarz">
        <meta property="og:title" content="Grupa Zel">
        <meta property="og:description" content="Grupa Zel – firma z Łodzi specjalizująca się w wykończeniach wnętrz. Oferujemy kompleksowe usługi budowlane, remonty i aranżacje wnętrz dla klientów indywidualnych i biznesowych.">
        @inertiaHead
    </head>
    <body class="font-montserrat antialiased" style="visibility:hidden;">
        @inertia
        <script>
            window.addEventListener('DOMContentLoaded', () => {
                document.body.style.visibility = 'visible';
            });
        </script>
    </body>
</html>
