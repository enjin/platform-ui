<!DOCTYPE html>
<html class="h-full bg-gray-50">
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title>Platform</title>

	@vite('resources/css/app.css', 'vendor/platform-ui/build')

</head>
<body class="h-full">
    <div id="app" class="h-full"></div>
    
    <script>
        global = globalThis
        window.__dynamic_base__ = '/vendor/platform-ui/build';
        window.bootstrap = { hostname: window.location.hostname }
    </script>

	@vite('resources/js/app.ts', 'vendor/platform-ui/build')
</body>
</html>