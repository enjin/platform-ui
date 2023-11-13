<?php

return [

    'middleware' => ['web'],

    'included_routes' => [
        'setup',
        'collections',
        'tokens',
        'transactions',
        'wallets',
        'fuel-tanks',
        'beams',
        'create',
        'settings',
        'login',
        'register',
        'forgot-password',
        'reset-password',
    ],

    'domain' => env('PLATFORM_UI_DOMAIN', 'https://platform.enjinstaging.com'),

];
