<?php
// database/seeders/TestimonialSeeder.php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Testimonial;

class TestimonialSeeder extends Seeder
{
    public function run(): void
    {
        $data = [
            [
                'quote' => 'Our first shipment of briquettes from Indo Charcoal Supply was a massive success...',
                'author' => 'Noah Thompson',
                'location' => 'Australia',
            ],
            [
                'quote' => 'We were looking for a reliable charcoal supplier...',
                'author' => 'Sophie Bakker',
                'location' => 'Netherland',
            ],
            [
                'quote'=> 'We have been in the charcoal business for decades, and we can confidently say that the quality of Indo Charcoal Supplys briquettes is among the best we have ever sourced. Their production capacity and efficiency in fulfilling large orders is truly impressive. We look forward to a long-term partnership.',
                'author'=> 'Ahmed Al-Farsi',
                'location'=> 'United Arab Emirates',
            ]
            // … add all your testimonials here
        ];

        foreach ($data as $testimonial) {
            Testimonial::create($testimonial);
        }
    }
}
