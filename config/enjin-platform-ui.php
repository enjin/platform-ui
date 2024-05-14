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
        'marketplace',
        'forgot-password',
        'reset-password',
    ],

    'domain' => env('APP_DOMAIN'),

];
