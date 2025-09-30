<?php

namespace Database\Seeders;

use App\Models\Post;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon; // 👈 ADD THIS LINE TO IMPORT CARBON

class PostSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('post_contents')->delete(); // Also clear child table first
        DB::table('posts')->delete(); // Clear existing posts

        $postsData = [
            "global-market-trends-2025" => [
                "title" => "Global Coconut Charcoal Briquette Market Trends (Analysis for Q3 2025)",
                "excerpt" => "A definitive analysis of the 5 key trends shaping the international coconut charcoal market in 2025, from the demand for low-ash content to the rise of white labeling.",
                "image" => "/tren.webp",
                "date" => "September 25, 2025",
                "category" => "Market Analysis",
                "meta" => [
                    "title" => "2025 Global Charcoal Market Trends | Indo Charcoal Supply",
                    "description" => "Stay ahead with our expert analysis of the 2025 global coconut charcoal briquette market trends. Understand the shift to low-ash, sustainability, and white labeling."
                ],
                "content" => [
                    ["type" => "h2", "text" => "A Value-Driven Transformation"],
                    ["type" => "p", "text" => "The global coconut charcoal briquette market in 2025 is undergoing a significant transformation. It has moved from a price-driven commodity market to a <strong>value-driven industry</strong> where quality, sustainability, and brand identity are paramount. For importers, distributors, and brands, understanding these key trends is essential for navigating the landscape and securing a competitive advantage."],
                    ["type" => "p", "text" => "Here are the definitive market trends shaping the industry today:"],
                    ["type" => "h3", "text" => "1. The Market is Dominated by Demand for Ultra-Low Ash Content"],
                    ["type" => "p", "text" => "This is the most significant technical trend. The premium markets—especially for shisha/hookah in the Middle East, Europe, and North America—have set a new quality benchmark."],
                    ["type" => "ul", "items" => ["<strong>The New Standard:</strong> An ash content <strong>below 2.5%</strong> is now the expected standard for any premium product. Briquettes with 3-4% ash are increasingly viewed as standard or low-grade.", "<strong>Driving Factors:</strong> This is driven by a more educated consumer base that demands a cleaner experience with no flavor alteration, better heat management, and less maintenance. For importers, low-ash products result in higher customer satisfaction and brand loyalty."]],
                    ["type" => "h3", "text" => "2. Sustainability Has Become a Non-Negotiable Requirement"],
                    ["type" => "p", "text" => "Environmental and ethical sourcing is no longer a 'nice-to-have' feature; it is a <strong>critical requirement</strong> for market access, particularly in Western markets."],
                    ["type" => "ul", "items" => ["<strong>Supply Chain Transparency:</strong> Importers are now required to demonstrate an eco-friendly supply chain. This means providing evidence that briquettes are made from <strong>upcycled coconut shell waste</strong> (not from deforestation) and that the production supports a circular economy.", "<strong>A Competitive Advantage:</strong> A verifiable sustainability story is a powerful marketing tool that resonates with conscious consumers and opens doors to major retailers who have strict corporate social responsibility (CSR) mandates."]],
                    ["type" => "h3", "text" => "3. A Surge in 'White Label' Services and Custom Brand Development"],
                    ["type" => "p", "text" => "The market is seeing a major shift from reselling generic goods to building unique brands. Importers are increasingly functioning as <strong>brand owners</strong>, not just traders."],
                    ["type" => "ul", "items" => ["<strong>Brand Building Over Reselling:</strong> Buyers are actively seeking manufacturing partners who can provide comprehensive <strong>'white label' services</strong>. This includes printing custom designs on inner boxes and master cartons to build their own brand identity.", "<strong>Strategic Goals:</strong> The objective is to achieve higher profit margins, create brand loyalty in local markets, and differentiate their products from the competition. Factories that offer flexible, high-quality custom packaging services are in high demand."]],
                    ["type" => "h3", "text" => "4. A 'Flight to Quality' in Supplier Partnerships"],
                    ["type" => "p", "text" => "Experienced importers are consolidating their business and moving away from small, unreliable traders toward <strong>established and transparent manufacturers</strong>."],
                    ["type" => "ul", "items" => ["<strong>Risk Mitigation:</strong> This trend is driven by a desire to avoid common issues like inconsistent quality between shipments, production delays, and poor communication. Buyers now prioritize <strong>reliability and professionalism</strong> as much as product quality.", "<strong>Demand for Transparency:</strong> Importers now expect direct factory relationships, clear and detailed Technical Data Sheets (TDS), and responsive, professional communication from a supplier's export team."]],
                    ["type" => "h3", "text" => "5. Product Diversification for Niche Market Applications"],
                    ["type" => "p", "text" => "While the classic cube shape remains the standard for shisha, there is a growing interest in different shapes to cater to specific niches and for brand differentiation."],
                    ["type" => "ul", "items" => ["<strong>Custom Shapes:</strong> Forms such as <strong>hexagonal, finger, and flat briquettes</strong> are becoming more popular for specific types of BBQ grills, unique shisha bowls, or simply as a way for a brand to stand out visually.", "<strong>Demonstrated Capability:</strong> A manufacturer's ability to produce a variety of shapes is seen as an indicator of advanced production capabilities and flexibility, making them a more attractive long-term partner."]],
                    ["type" => "blockquote", "text" => "In summary, the 2025 global briquette market prioritizes <strong>provable quality (low ash), an authentic story (sustainability), and professional, value-added partnerships (white labeling & transparency)</strong>. Price is no longer the primary driver if it comes at the expense of these three core pillars."]
                ]
            ],
            "guide-international-shipping-indonesian-charcoal" => [
                "title" => "From Factory Floor to Your Warehouse: A Guide to International Shipping & Logistics for Indonesian Charcoal",
                "excerpt" => "A high-quality product is only valuable if it arrives safely and on time. This guide demystifies the logistics process, from professional packaging and container loading to export documentation.",
                "image" => "/shiping.webp",
                "date" => "September 25, 2025",
                "category" => "Logistics & Shipping",
                "meta" => [
                    "title" => "Shipping & Logistics Guide for Indonesian Charcoal | Indo Charcoal Supply",
                    "description" => "An essential guide for importers on the international shipping process for coconut charcoal briquettes from Indonesia, including packaging, loading, documentation, and Incoterms."
                ],
                "content" => [
                    ["type" => "h2", "text" => "A Great Product is Only Half the Journey"],
                    ["type" => "p", "text" => "You have selected a premium coconut charcoal briquette with excellent specifications. But the journey from the factory in Indonesia to your warehouse is complex and fraught with potential challenges. A truly professional supplier doesn't just master production; <strong>they master logistics</strong>. This guide provides full transparency into the international shipping process, ensuring your investment is protected every step of the way."],
                    ["type" => "h3", "text" => "Step 1: The First Line of Defense – Professional Packaging & Palletizing"],
                    ["type" => "p", "text" => "Before your order faces the rigors of ocean transit, it must be impeccably packaged. This involves more than just a box. The master cartons are stacked securely on wooden pallets, conforming to <strong>ISPM 15 international standards</strong> for wood treatment. The entire pallet is then tightly wrapped in multiple layers of stretch film. This process, known as <strong>palletizing</strong>, creates a stable, unified block that prevents boxes from shifting and being crushed during transit."],
                    ["type" => "h3", "text" => "Step 2: The Art of Container Loading"],
                    ["type" => "p", "text" => "Maximizing container space while ensuring safety is a skill. We typically use <strong>20-foot or 40-foot containers</strong>, with capacities of approximately 18-19 tons and 26-27 tons, respectively. Using a 'floor loading' or 'hand-stacked' method, our experienced team carefully arranges each master carton to optimize space and distribute weight evenly. This prevents movement during the sea journey and ensures the container is stable and safe for transport."],
                    ["type" => "h3", "text" => "Step 3: Navigating the Paperwork – Essential Export Documents"],
                    ["type" => "p", "text" => "Seamless international trade runs on accurate documentation. A professional supplier manages this complex process for you. Key documents include:"],
                    ["type" => "ul", "items" => ["<strong>Bill of Lading (B/L):</strong> The primary contract between the shipper and the carrier, acting as a receipt and title to the goods.", "<strong>Commercial Invoice & Packing List:</strong> Details the transaction, value of the goods, and a full list of what is being shipped.", "<strong>Certificate of Origin (COO):</strong> Verifies that the goods were manufactured in Indonesia, which can be crucial for customs clearance and tariffs.", "<strong>Material Safety Data Sheet (MSDS):</strong> Provides information on the product's properties and handling, often required by shipping lines."]],
                    ["type" => "p", "text" => "Handling these documents correctly is critical to avoiding costly delays at customs."]
                ]
            ]
        ];

        foreach ($postsData as $slug => $postData) {
            $post = Post::create([
                'slug' => $slug,
                'title' => $postData['title'],
                'excerpt' => $postData['excerpt'],
                'image' => $postData['image'],
                'date' => Carbon::parse($postData['date'])->toDateString(), // 👈 THIS LINE IS NOW FIXED
                'category' => $postData['category'],
                'meta_title' => $postData['meta']['title'],
                'meta_description' => $postData['meta']['description'],
            ]);

            foreach ($postData['content'] as $contentBlock) {
                $post->contents()->create([
                    'type' => $contentBlock['type'],
                    'text' => $contentBlock['text'] ?? null,
                    'items' => $contentBlock['items'] ?? null,
                ]);
            }
        }
    }
}