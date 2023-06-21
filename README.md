# Platform User Interface

This package is an extension of [platform-core](https://github.com/enjin/platform-core) for adding a user interface.

[![License: LGPL 3.0](https://img.shields.io/badge/license-LGPL_3.0-purple)](https://opensource.org/license/lgpl-3-0/)

## Installation

### Laravel Installation

To install the plugin within Laravel, run the following command:

``` bash
composer require enjin/platform-ui
```

Next, run the following command to install the plugin:

``` bash
php artisan platform-ui:install
```

During the installation process, you will be prompted to enter the route, hostname, and authorization token.

### Static Hosting

If you want to host the frontend interface statically, follow these steps:

1. Clone the repository to your local machine
2. Run `npm install` to install the dependencies
3. Run `npm run prod` to build the project
4. Copy the `dist` folder to your server

## Usage

### Laravel Usage

After installing the plugin within Laravel, you can access the frontend interface by visiting the URL you specified during installation.

### Static Hosting Usage

If you are hosting the frontend interface statically, you can access it by visiting the URL where you copied the build folder.

## License

The LGPL 3.0 License. Please see [License File](LICENSE) for more information.
