<?php

namespace Enjin\PlatformUi;

use Enjin\PlatformUi\Console\InstallPlatformUi;
use Spatie\LaravelPackageTools\Package;
use Spatie\LaravelPackageTools\PackageServiceProvider;

class PlatformUiServiceProvider extends PackageServiceProvider
{
    /**
     * Configure provider.
     */
    public function configurePackage(Package $package): void
    {
        $package
            ->name('platform-ui')
            ->hasConfigFile(['enjin-platform-ui'])
            ->hasRoute('web')
            ->hasAssets()
            ->hasCommand(InstallPlatformUi::class);
    }

    /**
     * Boot provider.
     */
    public function boot()
    {
        parent::boot();

        $this->loadViewsFrom(__DIR__ . '/../resources/views', 'platform-ui');
        $this->defineAssetPublishing();
    }

    public function defineAssetPublishing()
    {
        $this->publishes([
            __DIR__ . '/../public' => public_path('vendor/platform-ui'),
        ], ['platform-ui-assets']);
    }
}
