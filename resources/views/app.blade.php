<!DOCTYPE html>
<html class="h-full bg-gray-50">
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
	<title>Enjin Platform</title>
    <link href="/vendor/platform-ui/favicon.png" rel="shortcut icon" type="image/x-icon" />

	@vite('resources/css/app.css', 'vendor/platform-ui/build')

</head>
<body class="h-full">
    <div id="app" class="h-full"></div>
    
    <script>
        global = globalThis
        window.__dynamic_base__ = '/vendor/platform-ui/build';
        window.bootstrap = { name: "{{ env('APP_NAME') }}", network: "{{ env('NETWORK') }}" , url: window.location.origin, daemon: "{{ Enjin\Platform\Support\Account::daemon()['public_key'] }}" }
    </script>

	@vite('resources/js/app.ts', 'vendor/platform-ui/build')
</body>
</html>