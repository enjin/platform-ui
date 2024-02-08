<?php

namespace Enjin\PlatformUi\Console;

use Illuminate\Console\Command;
use Illuminate\Support\Str;

class InstallPlatformUi extends Command
{
    protected $signature = 'platform-ui:install {--host=} {--token=} {--route=} {--tenant=} {--wsurl=} {--wschannel=} {--skip}';

    protected $description = 'Install the Platform UI package';
    private $BASE_DIR = __DIR__ . '/../../';

    public function handle()
    {
        $this->resetJSON();

        $this->askForInput('Do you want to enable multi-tenancy? (yes/no)', 'MULTI_TENANCY_VALUE', 'false', 'tenant');
        $route = $this->askForInput('Please enter the default route path? (optional)', 'ROUTE_VALUE', '', 'route');
        $this->updateRoute($route);
        $this->askForInput('Please enter WebSocket URL? (optional)', 'WEBSOCKET_VALUE', '', 'wsurl');
        $this->askForInput('Please enter WebSocket channel? (optional)', 'WEBSOCKET_CHANNEL_VALUE', '', 'wschannel');

        $this->comment('Installing Platform UI dependencies...');
        exec('npm install --prefix ' . $this->BASE_DIR . ' 2> /dev/null');

        $this->comment('Building Platform UI...');
        exec('npm run prod-laravel --prefix ' . $this->BASE_DIR . ' 2> /dev/null');

        $this->comment('Publishing Platform UI Assets...');
        $this->callSilent('vendor:publish', ['--tag' => 'platform-ui-assets', '--force' => true]);

        $this->info('Platform UI package Installed successfully.');
    }

    private function resetJSON()
    {
        file_put_contents(
            $this->BASE_DIR . 'resources/js/config.json',
            file_get_contents($this->BASE_DIR . 'resources/js/config.json.example')
        );

        file_put_contents(
            $this->BASE_DIR . 'routes/web.php',
            file_get_contents($this->BASE_DIR . 'routes/web.php.example')
        );
    }

    private function askForInput($label, $key, $default = null, $option = null)
    {
        if (!is_null($optionValue = $this->option($option))) {
            if ($option === 'tenant') {
                $optionValue = Str::lower($optionValue) === 'yes' ? 'true' : 'false';
            }
            $this->updateConfig($key, $optionValue);

            return $optionValue;
        }

        if (!is_null($optionValue = $this->option('skip'))) {
            if ($optionValue) {
                $this->updateConfig($key, $default);

                return $default;
            }
        }

        $value = $this->ask($label);
        if (!$value) {
            $value = $default;
        }

        if ($option === 'tenant') {
            $value = Str::lower($value) === 'yes' ? 'true' : 'false';
        }

        $this->updateConfig($key, $value);

        return $value;
    }

    private function updateConfig($key, $value)
    {
        $appConfig = file_get_contents($this->BASE_DIR . 'resources/js/config.json');

        file_put_contents(
            $this->BASE_DIR . 'resources/js/config.json',
            str_replace(
                $key,
                $value,
                $appConfig
            )
        );
    }

    private function updateRoute($value)
    {
        $appConfig = file_get_contents($this->BASE_DIR . 'routes/web.php');

        $value = Str::replaceLast('/', '', $value);

        file_put_contents(
            $this->BASE_DIR . 'routes/web.php',
            str_replace(
                'ROUTE_VALUE',
                $value,
                $appConfig
            )
        );
    }
}
