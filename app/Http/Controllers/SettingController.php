<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use Illuminate\Http\Request;

class SettingController extends Controller
{
    // Fetch all settings for the admin panel
    public function index()
    {
        // Return as a key->value object
        return Setting::all()->pluck('value', 'key');
    }

    // Update settings from the admin panel
    public function store(Request $request)
    {
        $validated = $request->validate([
            'company_profile_url' => 'required|url',
            'catalog_url' => 'required|url',
        ]);

        foreach ($validated as $key => $value) {
            Setting::updateOrCreate(['key' => $key], ['value' => $value]);
        }

        return response()->json(['message' => 'Settings updated successfully!']);
    }
}