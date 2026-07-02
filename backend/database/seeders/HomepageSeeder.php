<?php

namespace Database\Seeders;

use App\Models\HomepageSection;
use App\Models\Product;
use App\Models\Service;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class HomepageSeeder extends Seeder
{
    public function run(): void
    {
        HomepageSection::updateOrCreate(
            ['key' => 'hero'],
            [
                'title' => 'SOLID WOOD PRODUCTS',
                'subtitle' => 'Oak, beech, ash from',
                'description' => '1700 CZK per m³',
                'button_text' => 'Order',
                'button_url' => '#contact',
                'image_path' => null,
                'sort_order' => 1,
                'is_active' => true,
            ]
        );

        HomepageSection::updateOrCreate(
            ['key' => 'work'],
            [
                'title' => 'OUR WORK',
                'subtitle' => null,
                'description' => 'A selection of our finished wood projects and custom furniture work.',
                'button_text' => null,
                'button_url' => null,
                'image_path' => null,
                'sort_order' => 2,
                'is_active' => true,
            ]
        );

        HomepageSection::updateOrCreate(
            ['key' => 'advantages'],
            [
                'title' => 'ADVANTAGES WORKING WITH US',
                'subtitle' => null,
                'description' => 'We combine in-house carpentry, eco-friendly treatment, and direct manufacturer prices.',
                'button_text' => 'Receive a consultation',
                'button_url' => '#contact',
                'image_path' => null,
                'sort_order' => 3,
                'is_active' => true,
            ]
        );

        HomepageSection::updateOrCreate(
            ['key' => 'about'],
            [
                'title' => 'ABOUT US',
                'subtitle' => null,
                'description' => 'BIO CWT - We manufacture solid wood products according to individual drawings. We make chairs, armchairs, wardrobes, beds and much more in our own workshop, equipped with all the necessary industrial equipment.',
                'button_text' => null,
                'button_url' => null,
                'image_path' => null,
                'sort_order' => 4,
                'is_active' => true,
            ]
        );

        HomepageSection::updateOrCreate(
            ['key' => 'contact'],
            [
                'title' => 'ANY QUESTIONS?',
                'subtitle' => null,
                'description' => 'Write to us and we will be sure to answer all your questions and give you a comprehensive consultation.',
                'button_text' => 'Send',
                'button_url' => null,
                'image_path' => null,
                'sort_order' => 5,
                'is_active' => true,
            ]
        );

        HomepageSection::updateOrCreate(
            ['key' => 'contact_info'],
            [
                'title' => 'CONTACT',
                'subtitle' => '+420 000 000 000',
                'description' => "Na Plzence 1166/0\n150 00",
                'button_text' => null,
                'button_url' => 'https://www.google.com/maps?q=Pixel38%2C%2011%204404%2C%2047%20Patriarch%20Howeiyek%20Street%2C%20Beirut&output=embed',
                'image_path' => null,
                'sort_order' => 6,
                'is_active' => true,
            ]
        );

        $products = [
            [
                'name' => 'Oak',
                'short_description' => 'Strong and durable wood type.',
                'features' => [
                    ['label' => 'Durability', 'positive' => true],
                    ['label' => 'Beautiful texture', 'positive' => true],
                    ['label' => 'Water resistance', 'positive' => true],
                    ['label' => 'Expensive', 'positive' => false],
                ],
            ],
            [
                'name' => 'Buk',
                'short_description' => 'Hard wood suitable for furniture.',
                'features' => [
                    ['label' => 'Durability', 'positive' => true],
                    ['label' => 'Hard to handle', 'positive' => false],
                ],
            ],
            [
                'name' => 'Ash',
                'short_description' => 'Light wood with a clean natural finish.',
                'features' => [
                    ['label' => 'Durability', 'positive' => true],
                    ['label' => 'Hard to handle', 'positive' => false],
                ],
            ],
        ];

        foreach ($products as $index => $product) {
            Product::updateOrCreate(
                ['slug' => Str::slug($product['name'])],
                [
                    'name' => $product['name'],
                    'short_description' => $product['short_description'],
                    'description' => $product['short_description'],
                    'features' => $product['features'],
                    'image_path' => null,
                    'sort_order' => $index + 1,
                    'is_active' => true,
                ]
            );
        }

        $services = [
            [
                'title' => 'In-house carpentry production',
                'description' => 'All wood products are produced in our own workshop.',
            ],
            [
                'title' => 'Environmentally friendly treatment',
                'description' => 'We only treat wood with environmentally friendly and safe products.',
            ],
            [
                'title' => 'Manufacturer prices',
                'description' => 'Prices from the manufacturer, no extra charges.',
            ],
        ];

        foreach ($services as $index => $service) {
            Service::updateOrCreate(
                ['slug' => Str::slug($service['title'])],
                [
                    'title' => $service['title'],
                    'description' => $service['description'],
                    'icon_path' => null,
                    'image_path' => null,
                    'sort_order' => $index + 1,
                    'is_active' => true,
                ]
            );
        }
    }
}
