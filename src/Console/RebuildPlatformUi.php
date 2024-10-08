<?php

namespace Enjin\PlatformUi\Console;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;

class RebuildPlatformUi extends Command
{
    protected $signature = 'platform-ui:rebuild';

    protected $description = 'Rebuild the Platform UI package';
    private $BASE_DIR = __DIR__ . '/../../';

    public function handle()
    {
        $this->clearPlatformUIAssets();

        $this->comment('Installing Platform UI dependencies...');
        exec('npm install --prefix ' . $this->BASE_DIR . ' 2> /dev/null');

        $this->comment('Building Platform UI...');
        exec('npm run prod-laravel --prefix ' . $this->BASE_DIR . ' 2> /dev/null');

        $this->comment('Publishing Platform UI Assets...');
        $this->callSilent('vendor:publish', ['--tag' => 'platform-ui-assets', '--force' => true]);

        $this->info('Platform UI package Installed successfully.');
    }

    public function clearPlatformUIAssets()
    {
        $path = public_path('vendor/platform-ui');

        if (File::exists($path)) {
            File::deleteDirectory($path);
        }
    }
}
