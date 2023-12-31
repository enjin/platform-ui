<?php

use Enjin\PlatformUi\Controllers\Controller;
use Illuminate\Support\Facades\Route;

Route::domain(config('enjin-platform-ui.domain'))
    ->middleware(config('enjin-platform-ui.middleware'))
    ->group(function () {
        $routes = implode('|', config('enjin-platform-ui.included_routes'));
        Route::get('/{any?}', [Controller::class, 'app'])->where('any', '(' . $routes . ')($|\/.*)');
    });
