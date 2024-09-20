<?php

namespace Enjin\PlatformUi;

use Enjin\PlatformUi\Console\InstallPlatformUi;
use Enjin\PlatformUi\Console\RebuildPlatformUi;
use Spatie\LaravelPackageTools\Package;
use Spatie\LaravelPackageTools\PackageServiceProvider;
use Illuminate\Support\Facades\File;

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
            ->hasCommand(InstallPlatformUi::class)
            ->hasCommand(RebuildPlatformUi::class);
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
        $this->clearPlatformUIAssets();

        $this->publishes([
            __DIR__ . '/../public' => public_path('vendor/platform-ui'),
            __DIR__ . '/../public/images' => public_path('images'),
        ], ['platform-ui-assets']);
    }

    public function clearPlatformUIAssets()
    {
        $path = public_path('vendor/platform-ui');

        if (File::exists($path)) {
            File::deleteDirectory($path);
        }
    }
}
