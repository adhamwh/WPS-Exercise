<!doctype html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link
            rel="icon"
            type="image/png"
            href="{{ Vite::asset('resources/js/imgs/Favicon.png') }}"
        />
        <title>BIOCWT - Pixel38</title>
        @viteReactRefresh
        @vite('resources/js/main.tsx')
    </head>
    <body>
        <div id="root"></div>
    </body>
</html>
