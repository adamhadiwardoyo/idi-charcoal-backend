<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
{
    \App\Models\Setting::updateOrCreate(
        ['key' => 'company_profile_url'],
        ['value' => 'https://drive.google.com/file/d/15cJ4JVYefAieuppOQSQXwfE0XKk05U8o/view?usp=sharing']
    );

    \App\Models\Setting::updateOrCreate(
        ['key' => 'catalog_url'],
        ['value' => 'https://drive.google.com/file/d/14N-Yzy3S-mlXNmzGgq9b67ZCsbWGCbSa/view']
    );
}
}
