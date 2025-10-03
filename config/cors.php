<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | Here you may configure your settings for cross-origin resource sharing
    | or "CORS". This determines what cross-origin operations may execute
    | in web browsers. You are free to adjust these settings as needed.
    |
    | To learn more: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
    |https://api.indocharcoalsupply.com
, 'https://api.indocharcoalsupply.com'    */

    'paths' => ['api/*', 'sanctum/csrf-cookie', 'login', 'logout'],
    'allowed_methods' => ['*'],
    'allowed_origins' => ['https://api.indocharcoalsupply.com', 'https://indocharcoalsupply.com','http://127.0.0.1:8000','http://localhost:3000'],
    'allowed_headers' => ['*'],
    'supports_credentials' => true,


];