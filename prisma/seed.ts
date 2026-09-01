import { PrismaClient, AffiliateSource, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const CATEGORIES = [
  { name: "Shirts", slug: "shirts", image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&q=80" },
  { name: "T-Shirts", slug: "t-shirts", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80" },
  { name: "Trousers", slug: "trousers", image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&q=80" },
  { name: "Jeans", slug: "jeans", image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&q=80" },
  { name: "Jackets", slug: "jackets", image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=80" },
  { name: "Sneakers", slug: "sneakers", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80" },
  { name: "Formal Shoes", slug: "formal-shoes", image: "https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=600&q=80" },
  { name: "Watches", slug: "watches", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80" },
  { name: "Sunglasses", slug: "sunglasses", image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&q=80" },
  { name: "Wallets", slug: "wallets", image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&q=80" },
  { name: "Bags", slug: "bags", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80" },
  { name: "Grooming", slug: "grooming", image: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=600&q=80" },
];

const PRODUCTS = [
  // Shirts
  { name: "Classic Navy Blue Oxford Shirt", brand: "Louis Philippe", category: "shirts", description: "A timeless navy blue oxford shirt crafted from premium cotton. Perfect for office, smart casual and date nights. Tailored fit with button-down collar.", price: 1499, originalPrice: 2499, rating: 4.5, reviewCount: 328, image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&q=80", store: "Amazon", sizes: ["S","M","L","XL","XXL"], colors: ["Navy","White","Sky Blue"], material: "100% Cotton", pros: ["Premium cotton fabric","Tailored fit","Versatile styling","Machine washable"], cons: ["Slightly premium priced"], styleRecommendation: "Pair with beige chinos and white sneakers for a smart casual look, or with grey trousers and formal shoes for office." },
  { name: "White Formal Dress Shirt", brand: "Peter England", category: "shirts", description: "Crisp white formal shirt with a slim fit. Ideal for office, weddings and formal occasions. Made from premium blend fabric.", price: 1299, originalPrice: 1999, rating: 4.3, reviewCount: 512, image: "https://images.unsplash.com/photo-1603252109303-2751441dd157?w=600&q=80", store: "Flipkart", sizes: ["M","L","XL"], colors: ["White","Light Blue"], material: "Cotton Blend", pros: ["Crisp finish","Easy iron","Great value"], cons: ["Slim fit may run small"] },
  { name: "Light Blue Checked Casual Shirt", brand: "Levi's", category: "shirts", description: "Casual checked shirt in light blue tones. Perfect for weekend outings and casual occasions. Regular fit with soft fabric.", price: 1199, originalPrice: 1999, rating: 4.2, reviewCount: 201, image: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=600&q=80", store: "Myntra", sizes: ["S","M","L","XL"], colors: ["Blue","Red","Green"], material: "100% Cotton", pros: ["Soft fabric","Great for casual wear","Multiple colors"], cons: ["Not for formal occasions"] },
  { name: "Black Satin Party Shirt", brand: "Jack & Jones", category: "shirts", description: "Premium black satin shirt for parties and special occasions. Slim fit with spread collar. Elevate your evening look.", price: 1799, originalPrice: 2999, rating: 4.4, reviewCount: 156, image: "https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?w=600&q=80", store: "Amazon", sizes: ["M","L","XL"], colors: ["Black","Navy"], material: "Satin Blend", pros: ["Premium look","Party-ready","Excellent drape"], cons: ["Dry clean recommended"], trending: true },
  // T-Shirts
  { name: "Classic White Crew Neck Tee", brand: "H&M", category: "t-shirts", description: "Essential white crew neck t-shirt made from 100% cotton. A wardrobe basic every man needs. Regular fit.", price: 499, originalPrice: 799, rating: 4.4, reviewCount: 1240, image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80", store: "H&M", sizes: ["S","M","L","XL","XXL"], colors: ["White","Black","Grey","Navy"], material: "100% Cotton", pros: ["Basic essential","Affordable","Multiple colors"], cons: ["May shrink slightly"] },
  { name: "Black Oversized Graphic Tee", brand: "Bewakoof", category: "t-shirts", description: "Trendy oversized graphic t-shirt in black. Comfortable streetwear fit with premium print. Perfect for casual urban looks.", price: 599, originalPrice: 999, rating: 4.1, reviewCount: 890, image: "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=600&q=80", store: "Bewakoof", sizes: ["M","L","XL"], colors: ["Black","White"], material: "Cotton Jersey", pros: ["Trendy oversized fit","Great print quality"], cons: ["Not for formal settings"], trending: true },
  { name: "Polo T-Shirt Navy", brand: "U.S. Polo Assn.", category: "t-shirts", description: "Classic navy polo t-shirt with signature logo. Smart casual essential made from pique cotton.", price: 899, originalPrice: 1499, rating: 4.3, reviewCount: 670, image: "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=600&q=80", store: "Amazon", sizes: ["M","L","XL","XXL"], colors: ["Navy","White","Black","Red"], material: "Pique Cotton", pros: ["Smart casual look","Durable fabric"], cons: ["Logo may not be for everyone"] },
  // Trousers
  { name: "Beige Slim Fit Chinos", brand: "U.S. Polo Assn.", category: "trousers", description: "Versatile beige chinos in slim fit. Cotton twill fabric with stretch for comfort. Works with shirts, polos and tees.", price: 1299, originalPrice: 2199, rating: 4.4, reviewCount: 445, image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&q=80", store: "Amazon", sizes: ["30","32","34","36"], colors: ["Beige","Olive","Navy","Black"], material: "Cotton Stretch", pros: ["Versatile styling","Stretch comfort","Great fit"], cons: ["Color may fade slightly"], featured: true },
  { name: "Grey Formal Trousers", category: "trousers", brand: "Raymond", description: "Classic grey formal trousers for the office. Flat front with slim fit. Wrinkle-resistant fabric.", price: 1499, originalPrice: 2499, rating: 4.2, reviewCount: 289, image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&q=80", store: "Flipkart", sizes: ["30","32","34","36","38"], colors: ["Grey","Black","Navy"], material: "Polyester Viscose Blend", pros: ["Wrinkle resistant","Office appropriate"], cons: ["Dry clean only"] },
  // Jeans
  { name: "Dark Blue Slim Fit Jeans", brand: "Levi's", category: "jeans", description: "Iconic 511 slim fit jeans in dark blue wash. Premium denim with stretch for all-day comfort. A wardrobe essential.", price: 1999, originalPrice: 3299, rating: 4.6, reviewCount: 2100, image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&q=80", store: "Amazon", sizes: ["30","32","34","36","38"], colors: ["Dark Blue","Black","Light Blue"], material: "Stretch Denim", pros: ["Premium denim","Flattering fit","Versatile"], cons: ["Premium pricing"], featured: true, trending: true },
  { name: "Black Skinny Jeans", brand: "Jack & Jones", category: "jeans", description: "Black skinny fit jeans for a modern look. Stretchy denim that holds shape. Perfect for nights out.", price: 1499, originalPrice: 2499, rating: 4.1, reviewCount: 780, image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&q=80", store: "Myntra", sizes: ["28","30","32","34"], colors: ["Black","Dark Blue"], material: "Stretch Denim", pros: ["Modern fit","Good stretch"], cons: ["Skinny fit not for all"] },
  { name: "Light Blue Distressed Jeans", brand: "Spykar", category: "jeans", description: "Light blue distressed jeans with a modern taper fit. Faded wash with subtle distressing. Casual weekend style.", price: 1599, originalPrice: 2599, rating: 4.0, reviewCount: 320, image: "https://images.unsplash.com/photo-1555689502-c4b22d76c56f?w=600&q=80", store: "Flipkart", sizes: ["30","32","34","36"], colors: ["Light Blue"], material: "Cotton Denim", pros: ["Trendy look","Comfortable taper"], cons: ["Distressing may evolve with wear"] },
  // Jackets
  { name: "Black Leather Biker Jacket", brand: "Tommy Hilfiger", category: "jackets", description: "Premium black faux leather biker jacket with quilted details. A statement piece that elevates any outfit.", price: 3499, originalPrice: 5999, rating: 4.5, reviewCount: 234, image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=80", store: "Amazon", sizes: ["M","L","XL"], colors: ["Black","Brown"], material: "Faux Leather", pros: ["Premium look","Excellent build quality","Timeless design"], cons: ["Not suitable for heavy rain"], featured: true, trending: true },
  { name: "Navy Blue Blazer", brand: "Peter England", category: "jackets", description: "Classic navy blue blazer for formal and smart casual occasions. Slim fit with notch lapel. Wardrobe essential.", price: 2999, originalPrice: 4999, rating: 4.3, reviewCount: 410, image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&q=80", store: "Flipkart", sizes: ["38","40","42","44"], colors: ["Navy","Black"], material: "Polyester Viscose", pros: ["Versatile","Great fit","Good value"], cons: ["Dry clean recommended"] },
  { name: "Olive Green Bomber Jacket", brand: "Puma", category: "jackets", description: "Trendy olive green bomber jacket with ribbed cuffs and hem. Casual streetwear style with comfortable fit.", price: 1999, originalPrice: 3499, rating: 4.2, reviewCount: 190, image: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=600&q=80", store: "Myntra", sizes: ["M","L","XL"], colors: ["Olive","Black"], material: "Polyester", pros: ["Comfortable","On-trend","Lightweight"], cons: ["Not warm for very cold weather"] },
  // Sneakers
  { name: "White Classic Sneakers", brand: "Nike", category: "sneakers", description: "Timeless white sneakers that pair with everything. Clean silhouette with premium leather upper and cushioned sole.", price: 3499, originalPrice: 4999, rating: 4.7, reviewCount: 1850, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80", store: "Nike", sizes: ["7","8","9","10","11"], colors: ["White","White/Black"], material: "Leather Upper", pros: ["Versatile styling","Premium quality","Comfortable"], cons: ["White requires maintenance"], featured: true, trending: true },
  { name: "Ultra Boost Running Shoes", brand: "Adidas", category: "sneakers", description: "High-performance running shoes with responsive boost cushioning. Breathable mesh upper for all-day comfort.", price: 7999, originalPrice: 12999, rating: 4.8, reviewCount: 980, image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&q=80", store: "Adidas", sizes: ["7","8","9","10","11","12"], colors: ["Black/White","Grey"], material: "Primeknit", pros: ["Exceptional comfort","Premium build","Great for running"], cons: ["Premium price point"] },
  { name: "Old Skool Black/White Sneakers", brand: "Vans", category: "sneakers", description: "Iconic Old Skool sneakers with signature side stripe. Classic skate style that works with casual outfits.", price: 2999, originalPrice: 3999, rating: 4.5, reviewCount: 670, image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=600&q=80", store: "Vans", sizes: ["7","8","9","10","11"], colors: ["Black/White"], material: "Canvas/Suede", pros: ["Iconic design","Durable","Great grip"], cons: ["May need breaking in"] },
  { name: "Chunky White Dad Sneakers", brand: "Puma", category: "sneakers", description: "Trendy chunky sneakers in white. Retro-inspired silhouette with modern comfort. Adds a fashion edge.", price: 3999, originalPrice: 5999, rating: 4.2, reviewCount: 340, image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&q=80", store: "Puma", sizes: ["7","8","9","10","11"], colors: ["White","White/Grey"], material: "Mesh/Synthetic", pros: ["On-trend","Comfortable sole"], cons: ["Bulky silhouette not for everyone"], trending: true },
  // Formal Shoes
  { name: "Black Oxford Formal Shoes", brand: "Bata", category: "formal-shoes", description: "Classic black oxford shoes crafted from genuine leather. Timeless formal design for office and special occasions.", price: 2499, originalPrice: 3999, rating: 4.4, reviewCount: 560, image: "https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=600&q=80", store: "Bata", sizes: ["7","8","9","10","11"], colors: ["Black","Brown"], material: "Genuine Leather", pros: ["Timeless design","Genuine leather","Comfortable"], cons: ["Requires care"] },
  { name: "Brown Leather Loafers", brand: "Clarks", category: "formal-shoes", description: "Premium brown leather loafers for smart casual and business casual wear. Slip-on design with cushioned insole.", price: 3499, originalPrice: 5499, rating: 4.5, reviewCount: 310, image: "https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=600&q=80", store: "Amazon", sizes: ["7","8","9","10","11"], colors: ["Brown","Tan"], material: "Leather", pros: ["Slip-on convenience","Premium leather","Versatile"], cons: ["Slightly break-in period"] },
  // Watches
  { name: "Minimalist Black Dial Watch", brand: "Daniel Wellington", category: "watches", description: "Elegant minimalist watch with black dial and leather strap. Slim profile, perfect for both formal and casual wear.", price: 6999, originalPrice: 10999, rating: 4.6, reviewCount: 420, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80", store: "Amazon", colors: ["Black/Silver","Rose Gold"], material: "Stainless Steel/Leather", pros: ["Elegant design","Slim profile","Versatile"], cons: ["Premium price"], featured: true },
  { name: "Chronograph Sports Watch", brand: "Casio Edifice", category: "watches", description: "Bold chronograph watch with multiple dials. Stainless steel bracelet with quartz movement. Sporty yet elegant.", price: 4999, originalPrice: 7999, rating: 4.4, reviewCount: 280, image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=600&q=80", store: "Flipkart", colors: ["Silver","Black"], material: "Stainless Steel", pros: ["Feature-rich","Solid build","Water resistant"], cons: ["Heavy feel"] },
  { name: "Automatic Diver Watch", brand: "Seiko", category: "watches", description: "Professional automatic diver watch with 200m water resistance. Rotating bezel and luminous hands. Serious watchmaking.", price: 12999, originalPrice: 17999, rating: 4.7, reviewCount: 180, image: "https://images.unsplash.com/photo-1533139502658-0198f920d8e8?w=600&q=80", store: "Amazon", colors: ["Black/Steel"], material: "Stainless Steel", pros: ["Automatic movement","200m water resistance","Excellent craftsmanship"], cons: ["Investment piece"], trending: true },
  // Sunglasses
  { name: "Classic Wayfarer Sunglasses", brand: "Ray-Ban", category: "sunglasses", description: "Iconic Wayfarer sunglasses with UV-protective lenses. Timeless design that suits most face shapes.", price: 4999, originalPrice: 6990, rating: 4.7, reviewCount: 890, image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&q=80", store: "Ray-Ban", colors: ["Black","Tortoise"], material: "Acetate", pros: ["Iconic style","UV protection","Quality lenses"], cons: ["Premium price"] },
  { name: "Aviator Gold Frame Sunglasses", brand: "Ray-Ban", category: "sunglasses", description: "Timeless aviator sunglasses with gold frame and green lenses. A classic worn by generations.", price: 5499, originalPrice: 7490, rating: 4.6, reviewCount: 650, image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&q=80", store: "Amazon", colors: ["Gold/Green","Black/Grey"], material: "Metal", pros: ["Flattering design","Premium quality","UV protection"], cons: ["Lenses scratch if not cared for"] },
  // Wallets
  { name: "Black Leather Bifold Wallet", brand: "Fossil", category: "wallets", description: "Slim bifold wallet in premium black leather. Multiple card slots with bill compartment. Minimalist design.", price: 1499, originalPrice: 2499, rating: 4.4, reviewCount: 510, image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&q=80", store: "Amazon", colors: ["Black","Brown"], material: "Genuine Leather", pros: ["Slim profile","Quality leather","Great capacity"], cons: ["Leather takes time to break in"] },
  // Bags
  { name: "Black Leather Backpack", brand: "Wildcraft", category: "bags", description: "Premium black backpack with leather accents. Fits 15-inch laptop with multiple compartments. Work and travel friendly.", price: 2499, originalPrice: 3999, rating: 4.3, reviewCount: 240, image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80", store: "Amazon", colors: ["Black","Brown"], material: "Canvas/Leather", pros: ["Laptop compartment","Durable build","Stylish"], cons: ["Not fully waterproof"] },
  // Grooming
  { name: "Beard Grooming Kit", brand: "Beardo", category: "grooming", description: "Complete beard grooming kit with oil, wash, balm and comb. Everything you need for a well-maintained beard.", price: 999, originalPrice: 1799, rating: 4.3, reviewCount: 1500, image: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=600&q=80", store: "Amazon", pros: ["Complete kit","Value for money","Quality products"], cons: ["Scent is personal preference"], trending: true },
  { name: "Charcoal Face Wash Pack of 2", brand: "The Man Company", category: "grooming", description: "Activated charcoal face wash for deep cleansing. Removes dirt, oil and impurities. Suitable for all skin types.", price: 449, originalPrice: 698, rating: 4.2, reviewCount: 2100, image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&q=80", store: "Flipkart", pros: ["Deep cleansing","Good value pack","Fresh feel"], cons: ["May dry sensitive skin"] },
];

const ARTICLES = [
  { title: "7 Best Shirts Every Man Should Own", slug: "best-shirts-every-man-should-own", excerpt: "Building a versatile shirt collection is the foundation of a great wardrobe. Here are the seven essential shirts every man needs.", content: "<p>Every man needs a solid foundation of shirts in his wardrobe. From crisp white dress shirts to casual chambray, these are the seven styles that will cover every occasion from boardroom to weekend brunch.</p><h2>1. The White Dress Shirt</h2><p>A well-fitted white dress shirt is non-negotiable. It works for job interviews, weddings, funerals, and formal events.</p><h2>2. The Light Blue Oxford</h2><p>Almost as versatile as white, the light blue oxford is perfect for business casual and smart casual outfits.</p><h2>3. The Navy Blue Shirt</h2><p>A navy shirt pairs beautifully with khakis, grey trousers, and dark jeans.</p><h2>4. The Chambray</h2><p>Dress it up or down — chambray is the ultimate casual-meets-smart shirt.</p>", featuredImage: "https://images.unsplash.com/photo-1603252109303-2751441dd157?w=1200&q=80", category: "shirts", author: "The Style Guy Team", published: true, readingTime: 7 },
  { title: "Navy Blue Shirt Outfit Ideas: 10 Ways to Wear It", slug: "navy-blue-shirt-outfit-ideas", excerpt: "The navy blue shirt is a wardrobe workhorse. Discover ten stylish ways to wear it for every occasion.", content: "<p>The navy blue shirt is one of the most versatile pieces you can own. Here are ten ways to style it.</p><h2>With Beige Chinos</h2><p>The classic combination — navy and beige never fail.</p>", featuredImage: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=1200&q=80", category: "shirts", author: "Arjun Mehta", published: true, readingTime: 8 },
  { title: "Best Sneakers Under ₹3000 in India (2025)", slug: "best-sneakers-under-3000", excerpt: "You don't need to spend a fortune for great sneakers. Here are our picks for the best sneakers under ₹3000.", content: "<p>Great style doesn't have to be expensive. These are the best sneakers you can buy for under ₹3000.</p>", featuredImage: "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=1200&q=80", category: "sneakers", author: "Rohan Sharma", published: true, readingTime: 10 },
  { title: "How to Style Beige Trousers: The Complete Guide", slug: "how-to-style-beige-trousers", excerpt: "Beige chinos are incredibly versatile. Learn how to pair them with shirts, polos, t-shirts and jackets for multiple looks.", content: "<p>Beige trousers are one of the most versatile items a man can own. Here's how to style them.</p>", featuredImage: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=1200&q=80", category: "trousers", author: "The Style Guy Team", published: true, readingTime: 6 },
  { title: "Smart Casual Outfit Guide for Men 2025", slug: "smart-casual-guide", excerpt: "Crack the smart casual dress code with this comprehensive guide covering what to wear for every occasion.", content: "<p>Smart casual is the most confusing dress code for many men. Here's exactly what it means.</p>", featuredImage: "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=1200&q=80", category: "outfits", author: "Vikram Singh", published: true, readingTime: 9 },
  { title: "Best Watches for Men: From Budget to Luxury", slug: "best-watches-for-men", excerpt: "A great watch is more than a timepiece — it's an investment. Our guide covers every budget and style.", content: "<p>Whether you're looking for your first watch or adding to a collection, here are our top picks.</p>", featuredImage: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200&q=80", category: "watches", author: "Arjun Mehta", published: true, readingTime: 12 },
  { title: "Wedding Guest Outfit Ideas for Men", slug: "wedding-guest-outfit-ideas", excerpt: "Wondering what to wear to an Indian wedding? Here are stylish outfit ideas for every ceremony.", content: "<p>From sangeet to reception, we've got you covered with these wedding guest outfit ideas.</p>", featuredImage: "https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?w=1200&q=80", category: "outfits", author: "The Style Guy Team", published: true, readingTime: 8 },
  { title: "Office Outfit Ideas for Men: Dress for Success", slug: "office-outfit-ideas", excerpt: "Dress for the job you want with these modern office outfit ideas for men.", content: "<p>Modern office attire doesn't have to be boring. Here's how to look sharp at work.</p>", featuredImage: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=1200&q=80", category: "outfits", author: "Rohan Sharma", published: true, readingTime: 7 },
];

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
}

async function main() {
  console.log("🌱 Seeding database...");

  // Clean up
  await prisma.affiliateClick.deleteMany();
  await prisma.wishlist.deleteMany();
  await prisma.outfitProduct.deleteMany();
  await prisma.outfit.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.article.deleteMany();
  await prisma.affiliateSetting.deleteMany();
  await prisma.user.deleteMany();

  // Admin user
  const adminPassword = await bcrypt.hash("admin123", 12);
  await prisma.user.create({
    data: {
      name: "Admin",
      email: "admin@thestyleguy.com",
      password: adminPassword,
      role: Role.ADMIN,
    },
  });
  console.log("✅ Admin user created: admin@thestyleguy.com / admin123");

  // Categories
  const catMap: Record<string, string> = {};
  for (const cat of CATEGORIES) {
    const created = await prisma.category.create({ data: cat });
    catMap[cat.slug] = created.id;
  }
  // Create an additional "outfits" category for articles
  const outfitsCat = await prisma.category.create({
    data: { name: "Outfits", slug: "outfits", image: "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=600&q=80" },
  });
  catMap["outfits"] = outfitsCat.id;
  console.log("✅ Categories created");

  // Products
  for (const p of PRODUCTS) {
    const catId = catMap[p.category];
    if (!catId) continue;
    const discount = Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100);
    await prisma.product.create({
      data: {
        name: p.name,
        slug: slugify(p.brand + "-" + p.name),
        brand: p.brand,
        categoryId: catId,
        description: p.description,
        price: p.price,
        originalPrice: p.originalPrice,
        discount,
        rating: p.rating,
        reviewCount: p.reviewCount || 0,
        image: p.image,
        images: [p.image],
        store: p.store,
        source: AffiliateSource.MANUAL,
        affiliateUrl: "https://www.amazon.in/dp/B0DEMO" + Math.random().toString(36).substring(2, 8).toUpperCase() + "?tag=demotag-21",
        sizes: p.sizes || [],
        colors: p.colors || [],
        material: p.material,
        pros: p.pros || [],
        cons: p.cons || [],
        styleRecommendation: (p as any).styleRecommendation,
        featured: (p as any).featured || false,
        trending: (p as any).trending || false,
        specifications: { type: p.category },
      },
    });
  }
  console.log(`✅ ${PRODUCTS.length} products created`);

  // Articles
  for (const a of ARTICLES) {
    const catId = catMap[a.category] || null;
    await prisma.article.create({
      data: {
        title: a.title,
        slug: a.slug,
        content: a.content,
        excerpt: a.excerpt,
        featuredImage: a.featuredImage,
        categoryId: catId,
        author: a.author,
        published: a.published,
        readingTime: a.readingTime,
        publishedAt: a.published ? new Date() : null,
      },
    });
  }
  console.log(`✅ ${ARTICLES.length} articles created`);

  // Affiliate settings
  const settings = [
    { source: AffiliateSource.AMAZON, name: "Amazon Associates", affiliateId: "demotag-21", active: true, baseUrl: "https://www.amazon.in" },
    { source: AffiliateSource.FLIPKART, name: "Flipkart Affiliate", affiliateId: "demo", active: false, baseUrl: "https://www.flipkart.com" },
    { source: AffiliateSource.CUELINKS, name: "Cuelinks", affiliateId: "demo", active: false },
    { source: AffiliateSource.EARNKARO, name: "EarnKaro", affiliateId: "demo", active: false },
  ];
  for (const s of settings) {
    await prisma.affiliateSetting.create({ data: s });
  }
  console.log("✅ Affiliate settings created");

  console.log("🌱 Seeding complete!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
