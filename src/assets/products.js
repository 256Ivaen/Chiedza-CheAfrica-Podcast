import { v4 as uuidv4 } from 'uuid';
import { assets } from './assets';

// Categories (updated with new categories and suggested images)
export const categories = [
  {
    id: "cat-001",
    name: "Disposable & Packaging",
    slug: "disposable-packaging",
    description: "Professional disposable items and packaging solutions for restaurants, catering, and food service operations.",
    story: "Our disposable and packaging solutions meet the demanding needs of modern food service, combining functionality with environmental responsibility.",
    heroImage: assets.disposablePacking,
    productRangeImages: [
      "https://images.unsplash.com/photo-1580828343064-fde4fc206bc6?w=800&q=80",
      "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&q=80",
      "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&q=80"
    ],
    stats: {
      productsCount: "150+",
      suppliersCount: "20+",
      ecoFriendly: "80%",
      qualityScore: "95%"
    },
    certificates: ["Food Safe", "Eco Friendly Options", "Quality Assured"],
    featured: true
  },
  {
    id: "cat-002",
    name: "Dairy & Cheese",
    slug: "dairy-cheese",
    description: "Premium dairy products and artisanal cheeses sourced from the finest producers worldwide.",
    story: "Our dairy and cheese selection represents the pinnacle of quality, bringing together traditional craftsmanship with modern excellence.",
    heroImage: assets.dairyCheese,
    productRangeImages: [
      "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=800&q=80",
      "https://images.unsplash.com/photo-1552767059-ce182ead6c1b?w=800&q=80",
      "https://images.unsplash.com/photo-1618164436241-4473940d1f5c?w=800&q=80"
    ],
    stats: {
      productsCount: "120+",
      suppliersCount: "30+",
      freshDelivery: "24 Hours",
      qualityScore: "98%"
    },
    certificates: ["Premium Quality", "Fresh Daily", "Artisanal Selection"],
    featured: true
  },
  {
    id: "cat-003",
    name: "Mini Bar Snacks",
    slug: "mini-bar-snacks",
    description: "Premium snacks and confectionery perfect for hospitality, mini bars, and retail environments.",
    story: "Our mini bar snack collection features premium brands and gourmet options that elevate any hospitality experience.",
    heroImage: assets.miniBar,
    productRangeImages: [
      "https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=800&q=80",
      "https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=800&q=80",
      "https://images.unsplash.com/photo-1571506165871-ccb4fb2fb0df?w=800&q=80"
    ],
    stats: {
      productsCount: "200+",
      varieties: "50+",
      premiumBrands: "25+",
      qualityScore: "96%"
    },
    certificates: ["Premium Brands", "Long Shelf Life", "Travel Size"],
    featured: false
  },
  {
    id: "cat-004",
    name: "Non Food Items",
    slug: "non-food-items",
    description: "Essential non-food items including cleaning supplies, kitchen equipment, and hospitality accessories.",
    story: "Our non-food items complement your culinary operations with essential supplies and equipment for professional kitchens.",
    heroImage: assets.nonFoodItems,
    productRangeImages: [
      "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=800&q=80",
      "https://images.unsplash.com/photo-1586368362104-16e9a63a3bb0?w=800&q=80",
      "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=800&q=80"
    ],
    stats: {
      productsCount: "300+",
      categories: "15+",
      professionalGrade: "90%",
      qualityScore: "94%"
    },
    certificates: ["Professional Grade", "Safety Approved", "Commercial Use"],
    featured: false
  },
  {
    id: "cat-005",
    name: "Groceries",
    slug: "groceries",
    description: "Essential grocery items and pantry staples for everyday cooking and professional kitchen operations.",
    story: "Our comprehensive grocery selection provides all the essentials needed for both home cooking and commercial food preparation.",
    heroImage: assets.groceries,
    productRangeImages: [
      "https://safcointl.com/wp-content/uploads/2019/09/GROCERIES-PAGE-IMG2.jpg",
      "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80",
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80"
    ],
    stats: {
      productsCount: "500+",
      suppliersCount: "100+",
      categories: "25+",
      qualityScore: "95%"
    },
    certificates: ["Quality Assured", "Wide Selection", "Competitive Pricing"],
    featured: true
  },
  {
    id: "cat-006",
    name: "Olive Oil",
    slug: "olive-oil",
    description: "Premium extra virgin olive oils from the finest Mediterranean groves, cold-pressed to preserve natural flavors and nutrients.",
    story: "Our olive oil collection represents centuries of Mediterranean tradition, bringing you the purest and most flavorful oils from renowned olive-growing regions.",
    heroImage: assets.oliveOil,
    productRangeImages: [
      "https://royaltechnofood.com/cdn/shop/files/111-2_360x.jpg?v=1694542716",
      "https://images.unsplash.com/photo-1535473895227-bdab97181dba?w=800&q=80",
      "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&q=80"
    ],
    stats: {
      productsCount: "50+",
      suppliersCount: "15+",
      qualityScore: "97%",
      regions: "5+"
    },
    certificates: ["Extra Virgin Certified", "Mediterranean Origin", "Quality Assured"],
    featured: true
  },
  {
    id: "cat-007",
    name: "Canned & Glass Jar Olives",
    slug: "canned-glass-jar-olives",
    description: "Premium olives preserved in cans and glass jars, featuring various types from green to kalamata olives.",
    story: "From Mediterranean groves to your table, our olives are carefully selected and preserved to maintain their authentic taste and texture.",
    heroImage: assets.cannedGlassJarOlives,
    productRangeImages: [
      "https://royaltechnofood.com/cdn/shop/files/0101_360x.png?v=1746621868",
      "https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=800&q=80",
      "https://images.unsplash.com/photo-1608453056283-9c8458d8c225?w=800&q=80"
    ],
    stats: {
      productsCount: "40+",
      suppliersCount: "12+",
      varieties: "8+",
      qualityScore: "96%"
    },
    certificates: ["Premium Selection", "Mediterranean Origin", "Quality Preserved"],
    featured: false
  },
  {
    id: "cat-008",
    name: "Fruit Jam",
    slug: "fruit-jam",
    description: "Artisanal fruit jams and preserves made from the finest fruits, perfect for breakfast and baking.",
    story: "Our fruit jams capture the essence of seasonal fruits, creating delightful preserves that bring natural sweetness to your table.",
    heroImage: assets.fruitJam,
    productRangeImages: [
      "https://royaltechnofood.com/cdn/shop/files/11-7_360x.jpg?v=1694543122",
      "https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=800&q=80",
      "https://images.unsplash.com/photo-1592145499406-ca9b6b4e9a7b?w=800&q=80"
    ],
    stats: {
      productsCount: "35+",
      flavors: "15+",
      qualityScore: "95%",
      naturalIngredients: "100%"
    },
    certificates: ["Natural Ingredients", "No Artificial Preservatives", "Premium Quality"],
    featured: false
  },
  {
    id: "cat-009",
    name: "Basmati Rice",
    slug: "basmati-rice",
    description: "Premium basmati rice varieties with distinctive aroma and long grains, perfect for traditional and contemporary cuisine.",
    story: "Our basmati rice collection features the finest varieties from traditional growing regions, aged to perfection for optimal flavor and texture.",
    heroImage: assets.basmatiRice,
    productRangeImages: [
      "https://royaltechnofood.com/cdn/shop/files/11-1_360x.jpg?v=1694542667",
      "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=800&q=80",
      "https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=800&q=80"
    ],
    stats: {
      productsCount: "25+",
      varieties: "10+",
      qualityScore: "98%",
      origins: "8+"
    },
    certificates: ["Premium Grade", "Authentic Varieties", "Quality Assured"],
    featured: true
  },
  {
    id: "cat-010",
    name: "Paste, Seasoning & Salt",
    slug: "paste-seasoning-salt",
    description: "Premium pastes, seasonings, and specialty salts to enhance flavors in your culinary creations.",
    story: "Our collection of pastes, seasonings, and salts brings together authentic flavors from around the world to elevate your cooking.",
    heroImage: assets.pasteSpreads,
    productRangeImages: [
      "https://royaltechnofood.com/cdn/shop/collections/230_360x.png?v=1694514722",
      "https://images.unsplash.com/photo-1599909022800-95c60b4197b5?w=800&q=80",
      "https://images.unsplash.com/photo-1615485291596-15b8b857b2c8?w=800&q=80"
    ],
    stats: {
      productsCount: "60+",
      varieties: "20+",
      qualityScore: "94%",
      authenticity: "100%"
    },
    certificates: ["Authentic Flavors", "Premium Quality", "Traditional Methods"],
    featured: false
  },
  {
    id: "cat-011",
    name: "Natural Honey",
    slug: "natural-honey",
    description: "Pure natural honey sourced from the finest beekeepers, offering authentic sweetness and natural goodness.",
    story: "Our natural honey collection celebrates the ancient art of beekeeping, bringing you pure, unadulterated honey from pristine environments.",
    heroImage: assets.naturalHoney,
    productRangeImages: [
      "https://royaltechnofood.com/cdn/shop/files/1-2_360x.jpg?v=1694522192",
      "https://images.unsplash.com/photo-1587049633312-d628ae50a8ae?w=800&q=80",
      "https://images.unsplash.com/photo-1606297842467-12fdee5cc7b9?w=800&q=80"
    ],
    stats: {
      productsCount: "30+",
      varieties: "12+",
      qualityScore: "98%",
      pureHoney: "100%"
    },
    certificates: ["Pure Natural", "Artisanal Quality", "Sustainable Sourcing"],
    featured: false
  },
  {
    id: "cat-012",
    name: "Instant Coffee & Tea",
    slug: "instant-coffee-tea",
    description: "Premium instant coffee and fine tea blends for convenient preparation and exceptional taste.",
    story: "Our coffee and tea collection brings together premium blends from renowned growing regions, perfect for both quick preparation and gourmet enjoyment.",
    heroImage: assets.instantCoffee,
    productRangeImages: [
      "https://royaltechnofood.com/cdn/shop/files/1-3_360x.jpg?v=1694522292",
      "https://images.unsplash.com/photo-1571941337421-e3ee4b12a8b3?w=800&q=80",
      "https://images.unsplash.com/photo-1586368362104-16e9a63a3bb0?w=800&q=80"
    ],
    stats: {
      productsCount: "45+",
      varieties: "18+",
      qualityScore: "94%",
      premiumBlends: "20+"
    },
    certificates: ["Premium Blends", "Quality Sourced", "Authentic Flavors"],
    featured: false
  },
  {
    id: "cat-013",
    name: "Peanut Butter",
    slug: "peanut-butter",
    description: "Creamy and crunchy peanut butter varieties made from premium nuts for delicious spreads and cooking applications.",
    story: "Our peanut butter collection combines traditional methods with premium nuts to create smooth, flavorful spreads perfect for any occasion.",
    heroImage: assets.peanutButter,
    productRangeImages: [
      "https://royaltechnofood.com/cdn/shop/files/1-4_360x.jpg?v=1694522380",
      "https://images.unsplash.com/photo-1506094379482-2151d6ce4af2?w=800&q=80",
      "https://images.unsplash.com/photo-1592145499406-ca9b6b4e9a7b?w=800&q=80"
    ],
    stats: {
      productsCount: "25+",
      varieties: "10+",
      qualityScore: "96%",
      naturalIngredients: "95%"
    },
    certificates: ["Natural Ingredients", "Creamy & Crunchy", "Premium Nuts"],
    featured: false
  },
  {
    id: "cat-014",
    name: "Spice Powder",
    slug: "spice-powder",
    description: "Aromatic spice powders and blends from around the world to add authentic flavors to your cooking.",
    story: "Our spice powder collection brings together traditional grinding techniques with the finest spices from renowned growing regions.",
    heroImage: assets.spicePowder,
    productRangeImages: [
      "https://royaltechnofood.com/cdn/shop/files/1-7_360x.jpg?v=1694522443",
      "https://images.unsplash.com/photo-1599909022800-95c60b4197b5?w=800&q=80",
      "https://images.unsplash.com/photo-1615485291596-15b8b857b2c8?w=800&q=80"
    ],
    stats: {
      productsCount: "70+",
      varieties: "30+",
      qualityScore: "97%",
      pureSpices: "100%"
    },
    certificates: ["Pure Ground", "Authentic Origins", "Traditional Methods"],
    featured: false
  },
  {
    id: "cat-015",
    name: "Condiments & Sauces",
    slug: "condiments-sauces",
    description: "Premium condiments and sauces from around the world to complement and enhance your dishes.",
    story: "From classic condiments to exotic sauces, our collection brings global flavors to your kitchen with authentic taste and quality.",
    heroImage: assets.condiments,
    productRangeImages: [
      "https://royaltechnofood.com/cdn/shop/files/1-1_360x.jpg?v=1694522093",
      "https://images.unsplash.com/photo-1599909022800-95c60b4197b5?w=800&q=80",
      "https://images.unsplash.com/photo-1615485291596-15b8b857b2c8?w=800&q=80"
    ],
    stats: {
      productsCount: "80+",
      varieties: "25+",
      qualityScore: "95%",
      globalFlavors: "15+"
    },
    certificates: ["Authentic Recipes", "Premium Ingredients", "International Quality"],
    featured: false
  },
  {
    id: "cat-016",
    name: "Canned Fruits & Pulp",
    slug: "canned-fruits-pulp",
    description: "Premium canned fruits and fruit pulps preserved at peak ripeness for year-round enjoyment.",
    story: "Our canned fruits capture the natural sweetness and nutrition of fresh fruits, making them available whenever you need them.",
    heroImage: assets.cannedFruits,
    productRangeImages: [
      "https://royaltechnofood.com/cdn/shop/files/1-9_360x.jpg?v=1694522619",
      "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=800&q=80",
      "https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=800&q=80"
    ],
    stats: {
      productsCount: "40+",
      varieties: "18+",
      qualityScore: "96%",
      peakRipeness: "100%"
    },
    certificates: ["Peak Freshness", "Natural Sweetness", "Quality Preserved"],
    featured: false
  },
  {
    id: "cat-017",
    name: "Coconut Milk & Powder",
    slug: "coconut-milk-powder",
    description: "Premium coconut milk and powder for authentic Asian and tropical cuisine preparations.",
    story: "Our coconut products bring the tropical taste and creamy richness essential for authentic Asian and Caribbean cooking.",
    heroImage: assets.coconutMilk,
    productRangeImages: [
      "https://royaltechnofood.com/cdn/shop/files/11-12_360x.jpg?v=1694543398",
      "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=800&q=80",
      "https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=800&q=80"
    ],
    stats: {
      productsCount: "20+",
      varieties: "8+",
      qualityScore: "96%",
      creamyRichness: "100%"
    },
    certificates: ["Pure Coconut", "Premium Quality", "Tropical Authentic"],
    featured: false
  },
  {
    id: "cat-018",
    name: "Canned Tuna & Sardines",
    slug: "canned-tuna-sardines",
    description: "Premium canned tuna and sardines packed in oil or water for convenient, protein-rich meals.",
    story: "Our canned fish selection provides high-quality protein and omega-3 fatty acids, sustainably sourced for your health and convenience.",
    heroImage: assets.cannedTuna,
    productRangeImages: [
      "https://royaltechnofood.com/cdn/shop/files/treats-cats-canned-tuna-isolated-generative-ai_360x.jpg?v=1694853409",
      "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=800&q=80",
      "https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=800&q=80"
    ],
    stats: {
      productsCount: "30+",
      varieties: "12+",
      qualityScore: "96%",
      proteinRich: "100%"
    },
    certificates: ["Sustainably Sourced", "High Protein", "Premium Quality"],
    featured: false
  },
  {
    id: "cat-019",
    name: "Salad Dressing & Spreads",
    slug: "salad-dressing-spreads",
    description: "Premium salad dressings and gourmet spreads for enhancing salads, sandwiches, and appetizers.",
    story:"Our collection of dressings and spreads combines traditional recipes with modern flavors to enhance your culinary creations.",
    heroImage: assets.saladDressing,
    productRangeImages: [
      "https://royaltechnofood.com/cdn/shop/files/11-20_360x.jpg?v=1694543747",
      "https://images.unsplash.com/photo-1599909022800-95c60b4197b5?w=800&q=80",
      "https://images.unsplash.com/photo-1506094379482-2151d6ce4af2?w=800&q=80"
    ],
    stats: {
      productsCount: "35+",
      varieties: "15+",
      qualityScore: "94%",
      creamyTexture: "100%"
    },
    certificates: ["Premium Ingredients", "Gourmet Quality", "Authentic Flavors"],
    featured: false
  },
  {
    id: "cat-020",
    name: "Canned Food Items",
    slug: "canned-food-items",
    description: "Comprehensive selection of premium canned foods including vegetables, legumes, and specialty items.",
    story: "Our canned food collection provides convenient, shelf-stable options without compromising on quality, nutrition, or taste.",
    heroImage: assets.cannedFood,
    productRangeImages: [
      "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=800&q=80",
      "https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=800&q=80",
      "https://images.unsplash.com/photo-1608453056283-9c8458d8c225?w=800&q=80"
    ],
    stats: {
      productsCount: "150+",
      varieties: "40+",
      qualityScore: "95%",
      shelfLife: "24+ Months"
    },
    certificates: ["Quality Preserved", "Long Shelf Life", "Nutritious Options"],
    featured: true
  },
  {
    id: "cat-021",
    name: "Edible Oil",
    slug: "edible-oil",
    description: "Premium cooking oils including sunflower, canola, and specialty oils for healthy cooking and frying.",
    story: "Our edible oil collection provides healthy cooking options with high smoke points and excellent flavor profiles for all culinary needs.",
    heroImage: assets.edibleOild,
    productRangeImages: [
      "https://royaltechnofood.com/cdn/shop/files/free-photo-beauty-product-bottle-mockup-image-with-background_360x.jpg?v=1694852841",
      "https://images.unsplash.com/photo-1535473895227-bdab97181dba?w=800&q=80",
      "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&q=80"
    ],
    stats: {
      productsCount: "40+",
      varieties: "15+",
      qualityScore: "95%",
      healthyOptions: "90%"
    },
    certificates: ["Heart Healthy", "High Quality", "Multiple Varieties"],
    featured: false
  },
  {
    id: "cat-022",
    name: "Vinegar",
    slug: "vinegar",
    description: "Premium vinegars including apple cider, white, balsamic, and specialty vinegars for cooking and dressing.",
    story: "Our vinegar collection brings together traditional fermentation methods with premium ingredients to create exceptional flavor profiles.",
    heroImage: assets.vinegar,
    productRangeImages: [
      "https://royaltechnofood.com/cdn/shop/files/eswjhgks_360x.jpg?v=1697195798",
      "https://images.unsplash.com/photo-1535473895227-bdab97181dba?w=800&q=80",
      "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&q=80"
    ],
    stats: {
      productsCount: "25+",
      varieties: "10+",
      qualityScore: "96%",
      aged: "80%"
    },
    certificates: ["Traditional Methods", "Premium Quality", "Aged Varieties"],
    featured: false
  }
];

// Brands (updated - removed categoryId, added categoryIds array)
export const brands = [
  {
    id: "brand-001",
    name: "American Garden",
    slug: "american-garden",
    categoryIds: ["cat-015", "cat-010", "cat-008", "cat-013"], // Multiple categories
    logo: assets.americanGarden,
    heroImage: assets.americanGardenHero,
    description: "American Garden is a leading brand offering premium condiments, sauces, and pantry essentials with authentic American flavors and international quality standards.",
    story: "American Garden has been bringing authentic American flavors to kitchens worldwide, combining traditional recipes with modern quality standards.",
    features: ["Authentic Flavors", "Premium Quality", "Wide Variety", "International Standards"],
    certifications: ["ISO 22000", "HACCP Certified", "Quality Assured"],
    foundedYear: 1985,
    featured: true
  },
  {
    id: "brand-002",
    name: "Super Chef",
    slug: "super-chef",
    categoryIds: ["cat-002", "cat-005", "cat-010", "cat-021"], // Multiple categories
    logo: assets.superchef,
    heroImage: assets.supercheflogo,
    description: "Super Chef provides premium quality dairy and cheese products that meet the exacting standards of professional chefs and culinary enthusiasts worldwide.",
    story: "Super Chef was born from the understanding that exceptional cuisine requires exceptional ingredients. Our dairy selection process involves partnerships with certified producers committed to quality and sustainability.",
    features: ["Premium Grade Selection", "Professional Quality", "Chef Approved", "Temperature Controlled"],
    certifications: ["Quality Assured", "Professional Grade", "Fresh Daily"],
    foundedYear: 1998,
    featured: true
  },
  {
    id: "brand-003",
    name: "Royal Arm",
    slug: "royal-arm",
    categoryIds: ["cat-009", "cat-005", "cat-014", "cat-010"], // Multiple categories
    logo: assets.royal,
    heroImage: assets.royallogo,
    description: "Royal Arm specializes in premium basmati rice varieties, bringing authentic aromatic rice from traditional growing regions to discerning customers worldwide.",
    story: "Royal Arm represents the pinnacle of basmati rice quality, sourcing from heritage farms and employing traditional aging processes to deliver exceptional aroma and flavor.",
    features: ["Premium Basmati", "Traditional Aging", "Authentic Aroma", "Heritage Quality"],
    certifications: ["Premium Grade", "Authentic Varieties", "Quality Assured"],
    foundedYear: 1990,
    featured: true
  },
  {
    id: "brand-004",
    name: "Heinz",
    slug: "heinz",
    categoryIds: ["cat-015", "cat-019", "cat-020", "cat-016", "cat-022"], // Multiple categories
    logo: assets.heinz,
    heroImage: assets.heinzHero,
    description: "Heinz is a globally recognized brand synonymous with quality condiments and sauces, bringing over 150 years of culinary expertise to kitchens worldwide.",
    story: "Since 1869, Heinz has been pioneering quality in condiments and sauces, maintaining the highest standards while continuously innovating to meet evolving tastes.",
    features: ["Globally Recognized", "150+ Years Heritage", "Premium Ingredients", "Consistent Quality"],
    certifications: ["Global Standards", "Quality Heritage", "Trusted Brand"],
    foundedYear: 1869,
    featured: true
  },
  {
    id: "brand-005",
    name: "Thai Prestige",
    slug: "thai-prestige",
    categoryIds: ["cat-017", "cat-009", "cat-005", "cat-014"], // Multiple categories
    logo: assets.thaiPrestige,
    heroImage: assets.thaiPrestigeHero,
    description: "Thai Prestige brings authentic Thai flavors and premium coconut products directly from Thailand's finest producers to international markets.",
    story: "Thai Prestige represents the authentic taste of Thailand, specializing in coconut-based products that capture the essence of traditional Thai cuisine.",
    features: ["Authentic Thai", "Premium Coconut Products", "Traditional Methods", "Export Quality"],
    certifications: ["Thai Quality Standards", "Export Certified", "Authentic Products"],
    foundedYear: 1995,
    featured: false
  },
  {
    id: "brand-006",
    name: "Falcon Sea Food & Trading",
    slug: "falcon",
    categoryIds: ["cat-018", "cat-020", "cat-016"], // Multiple categories
    logo: assets.falcon,
    heroImage: assets.falconHero,
    description: "Falcon delivers premium canned seafood products with a commitment to sustainable fishing practices and exceptional quality standards.",
    story: "Falcon has been a trusted name in seafood, combining sustainable fishing practices with advanced preservation techniques to deliver premium products.",
    features: ["Sustainable Fishing", "Premium Seafood", "Advanced Processing", "Quality Assured"],
    certifications: ["Sustainably Sourced", "Ocean Safe", "Premium Quality"],
    foundedYear: 1992,
    featured: false
  },
  {
    id: "brand-007",
    name: "Agada",
    slug: "agada",
    categoryIds: ["cat-008", "cat-011", "cat-005", "cat-016"], // Multiple categories
    logo: assets.agadaLogo,
    heroImage: assets.agadaHero,
    description: "Agada specializes in artisanal fruit jams and preserves, using traditional recipes and the finest seasonal fruits for exceptional taste.",
    story: "Agada combines time-honored jam-making traditions with premium ingredients to create preserves that capture the pure essence of fresh fruit.",
    features: ["Artisanal Quality", "Traditional Recipes", "Premium Fruits", "Natural Ingredients"],
    certifications: ["Natural Ingredients", "Artisanal Made", "Premium Quality"],
    foundedYear: 2001,
    featured: false
  },
  {
    id: "brand-008",
    name: "Kericho",
    slug: "kericho",
    categoryIds: ["cat-012", "cat-005", "cat-011"], // Multiple categories
    logo: assets.kericho,
    heroImage: assets.kerishoHero,
    description: "Kericho brings premium African tea blends from the highlands of Kenya, offering exceptional quality and authentic flavors.",
    story: "Named after Kenya's famous tea-growing region, Kericho represents the finest African tea traditions and premium highland-grown leaves.",
    features: ["Highland Grown", "African Heritage", "Premium Blends", "Authentic Flavor"],
    certifications: ["Premium Tea Estates", "Highland Quality", "Authentic Origin"],
    foundedYear: 1988,
    featured: false
  },
  {
    id: "brand-009",
    name: "Twinings",
    slug: "twinings",
    categoryIds: ["cat-012", "cat-005", "cat-011"], // Multiple categories
    logo: assets.twinnings,
    heroImage: assets.twinningsHero,
    description: "Twinings is a heritage tea brand with over 300 years of expertise in crafting exceptional tea blends from the world's finest tea gardens.",
    story: "Since 1706, Twinings has been master tea blenders, creating distinctive teas that have graced royal tables and discerning tea lovers worldwide.",
    features: ["300+ Years Heritage", "Master Blenders", "Royal Warrant", "Global Recognition"],
    certifications: ["Royal Warrant", "Heritage Quality", "Master Crafted"],
    foundedYear: 1706,
    featured: true
  },
  {
    id: "brand-010",
    name: "Bertini",
    slug: "bertini",
    categoryIds: ["cat-006", "cat-021", "cat-022", "cat-005"], // Multiple categories
    logo: assets.bertini,
    heroImage: assets.bertiniHero,
    description: "Bertini represents the finest Italian olive oil tradition, producing premium extra virgin olive oils from carefully selected Mediterranean groves.",
    story: "Bertini embodies centuries of Italian olive oil craftsmanship, combining traditional methods with modern quality standards to produce exceptional oils.",
    features: ["Italian Heritage", "Extra Virgin", "Mediterranean Groves", "Traditional Methods"],
    certifications: ["Extra Virgin Certified", "Italian DOP", "Mediterranean Origin"],
    foundedYear: 1895,
    featured: false
  },
  {
    id: "brand-011",
    name: "Blue Diamond",
    slug: "blue-diamond",
    categoryIds: ["cat-003", "cat-013", "cat-005", "cat-014"], // Multiple categories
    logo: assets.blueDiamond,
    heroImage: assets.blueDiamondHero,
    description: "Blue Diamond is renowned for premium nuts and gourmet snacks, delivering exceptional quality and innovative flavors for discerning consumers.",
    story: "Blue Diamond has been setting the standard for premium nuts and snacks, combining California's finest almonds with innovative processing and flavoring techniques.",
    features: ["Premium Nuts", "California Almonds", "Gourmet Flavors", "Innovative Processing"],
    certifications: ["Premium Grade", "California Quality", "Gourmet Standards"],
    foundedYear: 1910,
    featured: false
  },

  // None Food Items 
  {
    id: "brand-012",
    name: "Fairy",
    slug: "fairy",
    categoryIds: ["cat-004"],
    logo: assets.fairy,
    heroImage: assets.fairyHero,
    description: "Superior Clean & Shine, designed for professionals.",
    story: "Catering the needs of professionals with its sparkling finish, with superior cleaning & shine, saving time, money and energy, while delivering great results for you and your guests.",
    features: ["Authentic Flavors", "Premium Quality", "Wide Variety", "International Standards"],
    certifications: ["ISO 22000", "HACCP Certified", "Quality Assured"],
    foundedYear: 1985,
    featured: false
  },

  {
    id: "brand-013",
    name: "Ariel",
    slug: "ariel",
    categoryIds: ["cat-004"],
    logo: assets.ariel,
    heroImage: assets.arielHero,
    description: "Superior cleaning in the toughest conditions",
    story: "Designed to remove all the tough stains professionals have, Ariel Professional will achieve superior cleaning for all your laundry needs.",
    features: ["Authentic Flavors", "Premium Quality", "Wide Variety", "International Standards"],
    certifications: ["ISO 22000", "HACCP Certified", "Quality Assured"],
    foundedYear: 1985,
    featured: false
  },

  {
    id: "brand-014",
    name: "Dove",
    slug: "dove",
    categoryIds: ["cat-004"],
    logo: assets.dove,
    heroImage: assets.doveHero,
    description: "American Garden is a leading brand offering premium condiments, sauces, and pantry essentials with authentic American flavors and international quality standards.",
    story: "American Garden has been bringing authentic American flavors to kitchens worldwide, combining traditional recipes with modern quality standards.",
    features: ["Authentic Flavors", "Premium Quality", "Wide Variety", "International Standards"],
    certifications: ["ISO 22000", "HACCP Certified", "Quality Assured"],
    foundedYear: 1985,
    featured: false
  },

  {
    id: "brand-015",
    name: "Andrex",
    slug: "andrex",
    categoryIds: ["cat-004"],
    logo: assets.andrex,
    heroImage: assets.andrexHero,
    description: "American Garden is a leading brand offering premium condiments, sauces, and pantry essentials with authentic American flavors and international quality standards.",
    story: "American Garden has been bringing authentic American flavors to kitchens worldwide, combining traditional recipes with modern quality standards.",
    features: ["Authentic Flavors", "Premium Quality", "Wide Variety", "International Standards"],
    certifications: ["ISO 22000", "HACCP Certified", "Quality Assured"],
    foundedYear: 1985,
    featured: false
  },

  {
    id: "brand-016",
    name: "Nivea",
    slug: "nivea",
    categoryIds: ["cat-004"],
    logo: assets.nivea,
    heroImage: assets.niveaHero,
    description: "American Garden is a leading brand offering premium condiments, sauces, and pantry essentials with authentic American flavors and international quality standards.",
    story: "American Garden has been bringing authentic American flavors to kitchens worldwide, combining traditional recipes with modern quality standards.",
    features: ["Authentic Flavors", "Premium Quality", "Wide Variety", "International Standards"],
    certifications: ["ISO 22000", "HACCP Certified", "Quality Assured"],
    foundedYear: 1985,
    featured: false
  },

  {
    id: "brand-017",
    name: "Unilever",
    slug: "unilever",
    categoryIds: ["cat-004"],
    logo: assets.unilever,
    heroImage: assets.unileverHero,
    description: "American Garden is a leading brand offering premium condiments, sauces, and pantry essentials with authentic American flavors and international quality standards.",
    story: "American Garden has been bringing authentic American flavors to kitchens worldwide, combining traditional recipes with modern quality standards.",
    features: ["Authentic Flavors", "Premium Quality", "Wide Variety", "International Standards"],
    certifications: ["ISO 22000", "HACCP Certified", "Quality Assured"],
    foundedYear: 1985,
    featured: false
  },

  {
    id: "brand-018",
    name: "Imperial Leather",
    slug: "imperial-leather",
    categoryIds: ["cat-004"],
    logo: assets.ImperialLeather,
    heroImage: assets.ImperialLeatherHero,
    description: "American Garden is a leading brand offering premium condiments, sauces, and pantry essentials with authentic American flavors and international quality standards.",
    story: "American Garden has been bringing authentic American flavors to kitchens worldwide, combining traditional recipes with modern quality standards.",
    features: ["Authentic Flavors", "Premium Quality", "Wide Variety", "International Standards"],
    certifications: ["ISO 22000", "HACCP Certified", "Quality Assured"],
    foundedYear: 1985,
    featured: false
  },

  {
    id: "brand-019",
    name: "Dr Beckmann",
    slug: "dr-beckmann",
    categoryIds: ["cat-004"],
    logo: assets.DrBeckmann,
    heroImage: assets.DrBeckmannHero,
    description: "American Garden is a leading brand offering premium condiments, sauces, and pantry essentials with authentic American flavors and international quality standards.",
    story: "American Garden has been bringing authentic American flavors to kitchens worldwide, combining traditional recipes with modern quality standards.",
    features: ["Authentic Flavors", "Premium Quality", "Wide Variety", "International Standards"],
    certifications: ["ISO 22000", "HACCP Certified", "Quality Assured"],
    foundedYear: 1985,
    featured: false
  },

  {
    id: "brand-012",
    name: "Persil",
    slug: "persil",
    categoryIds: ["cat-004"],
    logo: assets.persil,
    heroImage: assets.persilHero,
    description: "American Garden is a leading brand offering premium condiments, sauces, and pantry essentials with authentic American flavors and international quality standards.",
    story: "American Garden has been bringing authentic American flavors to kitchens worldwide, combining traditional recipes with modern quality standards.",
    features: ["Authentic Flavors", "Premium Quality", "Wide Variety", "International Standards"],
    certifications: ["ISO 22000", "HACCP Certified", "Quality Assured"],
    foundedYear: 1985,
    featured: false
  },
];

// Products (updated - keeping brandId but ensuring it matches the new structure)
export const products = [
  {
    id: "prod-001",
    name: "Premium Tomato Ketchup",
    slug: "premium-tomato-ketchup",
    brandId: "brand-001",
    categoryId: "cat-015",
    description: "Rich, thick tomato ketchup made from vine-ripened tomatoes with authentic American taste and premium quality ingredients.",
    shortDescription: "Premium tomato ketchup with authentic American flavor and rich consistency.",
    images: [
      "https://images.unsplash.com/photo-1599909022800-95c60b4197b5?w=800&q=80",
      "https://images.unsplash.com/photo-1615485291596-15b8b857b2c8?w=800&q=80"
    ],
    features: ["Vine Ripened Tomatoes", "Rich Consistency", "Authentic Taste", "Premium Quality"],
    specifications: {
      origin: "Premium Tomatoes",
      variety: "Classic Ketchup",
      packaging: "500ml Bottles",
      shelf_life: "18 Months"
    },
    sku: "AG-KET-001",
    status: "active",
    stock_quantity: 200,
    low_stock_threshold: 30,
    weight: "500",
    dimensions: "20x8x8cm",
    bestseller: true,
    featured: true
  },
  {
    id: "prod-002",
    name: "Classic Mayonnaise",
    slug: "classic-mayonnaise",
    brandId: "brand-001", 
    categoryId: "cat-015",
    description: "Creamy, smooth mayonnaise made with premium ingredients for the perfect balance of flavor and texture in every application.",
    shortDescription: "Premium mayonnaise with creamy texture and balanced flavor.",
    images: [
      "https://images.unsplash.com/photo-1506094379482-2151d6ce4af2?w=800&q=80",
      "https://images.unsplash.com/photo-1592145499406-ca9b6b4e9a7b?w=800&q=80"
    ],
    features: ["Creamy Texture", "Premium Ingredients", "Balanced Flavor", "Versatile Use"],
    specifications: {
      origin: "Premium Eggs & Oil",
      variety: "Classic Mayo",
      packaging: "400ml Jars",
      shelf_life: "12 Months"
    },
    sku: "AG-MAY-002",
    status: "active",
    stock_quantity: 150,
    low_stock_threshold: 25,
    weight: "400",
    dimensions: "15x10x10cm",
    bestseller: false,
    featured: true
  },

  // Super Chef Products (Dairy & Cheese)
  {
    id: "prod-003",
    name: "Premium Cheddar Cheese",
    slug: "premium-cheddar-cheese",
    brandId: "brand-002",
    categoryId: "cat-002",
    description: "Aged cheddar cheese with sharp, distinctive flavor perfect for culinary applications and gourmet cooking.",
    shortDescription: "Premium aged cheddar cheese with sharp, distinctive flavor.",
    images: [
      "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=800&q=80",
      "https://images.unsplash.com/photo-1552767059-ce182ead6c1b?w=800&q=80"
    ],
    features: ["Aged Quality", "Sharp Flavor", "Premium Grade", "Chef Approved"],
    specifications: {
      type: "Aged Cheddar",
      aging: "12 Months",
      packaging: "200g Blocks",
      storage: "Refrigerated"
    },
    sku: "SC-CHE-001",
    status: "active",
    stock_quantity: 80,
    low_stock_threshold: 15,
    weight: "200",
    dimensions: "10x8x3cm",
    bestseller: true,
    featured: true
  },
  {
    id: "prod-004",
    name: "Fresh Mozzarella",
    slug: "fresh-mozzarella",
    brandId: "brand-002",
    categoryId: "cat-002",
    description: "Fresh, creamy mozzarella cheese perfect for pizzas, salads, and Italian cuisine applications.",
    shortDescription: "Fresh, creamy mozzarella cheese ideal for Italian cuisine.",
    images: [
      "https://images.unsplash.com/photo-1618164436241-4473940d1f5c?w=800&q=80",
      "https://images.unsplash.com/photo-1571740943943-6c5ee8e2efbf?w=800&q=80"
    ],
    features: ["Fresh Daily", "Creamy Texture", "Italian Style", "Versatile Use"],
    specifications: {
      type: "Fresh Mozzarella",
      processing: "Fresh",
      packaging: "250g Packs",
      shelf_life: "7 Days"
    },
    sku: "SC-MOZ-002",
    status: "active",
    stock_quantity: 60,
    low_stock_threshold: 12,
    weight: "250",
    dimensions: "12x8x4cm",
    bestseller: false,
    featured: true
  },

  // Fairy Products 
  {
    id: "prod-006",
    name: "Washing Up Liquid",
    slug: "Washing-Up-Liquid",
    brandId: "brand-012",
    categoryId: "cat-004",
    description: "Fairy Professional Washing Up Liquid Antibacterial is a super concentrated liquid detergent for washing up and pre-soaking of tableware, pots & pans, kitchen utensils and other surfaces. Long-lasting efficient washing-up solution.",
    shortDescription: "Lifts grease and food residues from pots, pans, plates, cutlery, etc",
    images: [
      assets.washupLiquid1,
      assets.washupLiquid2,
      assets.washupLiquid3,
      assets.washupLiquid4,
    ],
    features: ["Kills 99.9% of bacteria on the sponge", "Lifts grease and food residues from pots, pans, plates, cutlery, etc", "Dissolves grease easily", "Also suitable for other surfaces as windows, mirrors, tables & seating", "Recommended for professional use"],
    specifications: {
      variety: "Safety & Ingredients",
      origin: "Fairy Professional®"
    },
    sku: "RA-BAS-001",
    status: "active",
    stock_quantity: 120,
    low_stock_threshold: 20,
    weight: "5000",
    dimensions: "2x5L",
    bestseller: true,
    featured: true
  },

  {
    id: "prod-007",
    name: "All in One Dishwasher Tablets",
    slug: "All-in-One-Dishwasher-Tablets",
    brandId: "brand-012",
    categoryId: "cat-004",
    description: "Fairy Professional Original All-in-One Dishwasher Tablets grants a strong cleaning action, fighting against everyday grease found in professional kitchens. Thanks to its powerful formula combining liquid and powder in one capsule, Fairy Professional Original delivers outstanding cleaning and shine to your pots, pans and dishes. Ideal format for professional. No unwrapping needed, just place the capsules in the dishwasher dispenser drawer",
    shortDescription: "Fairy Professional Original All-in-One capsules grant outstanding cleaning results for your pots, pans and dishes",
    images: [
      assets.dishwasherTablets1,
      assets.dishwasherTablets2,
      assets.dishwasherTablets3,
      assets.dishwasherTablets4,
    ],
    features: ["Fairy Professional Original All-in-One capsules grant outstanding cleaning results for your pots, pans and dishes", "Original formula is designed to tackle typical daily grease stains found in professional kitchens", "Enjoy outstanding results even in short washing cycles, thanks to the ultra-soluble capsules", "Ideal for professional kitchens, HACCP compliant"],
    specifications: {
      variety: "Safety & Ingredients",
      origin: "Fairy Professional®"
    },
    sku: "RA-BAS-001",
    status: "active",
    stock_quantity: 120,
    low_stock_threshold: 20,
    weight: "5000",
    dimensions: "2X140 Capsules",
    bestseller: true,
    featured: true
  },

  {
    id: "prod-008",
    name: "Commercial Automatic Dishwasher Rinse Aid",
    slug: "Commercial-Automatic-Dishwasher-Rinse-Aid",
    brandId: "brand-012",
    categoryId: "cat-004",
    description: "Fairy Professional Rinse Aid for commercial autodishwashing delivers rapid drying, protecting your dishes and machines from droplet formation and limescale built-up. For spotless results, use together with Fairy Professional Detergent.",
    shortDescription: "5-15% Non-Ionic Surfactants",
    images: [
      assets.DishwasherRinseAid1,
      assets.DishwasherRinseAid2,
      assets.DishwasherRinseAid3,
      assets.DishwasherRinseAid4,
    ],
    features: ["Offers shiny and fast drying results", "Helps prevent droplet and limescale formation", "Can be used across all water hardness", "To be used together with Fairy Professional Detergent"],
    specifications: {
      variety: "Safety & Ingredients",
      origin: "Fairy Professional®"
    },
    sku: "RA-BAS-001",
    status: "active",
    stock_quantity: 120,
    low_stock_threshold: 20,
    weight: "5000",
    dimensions: "2x5L",
    bestseller: true,
    featured: true
  },

  {
    id: "prod-009",
    name: "Commercial Automatic Dishwasher Detergent",
    slug: "Dishwasher-Detergent",
    brandId: "brand-012",
    categoryId: "cat-004",
    description: "Fairy Professional Detergent for commercial autodishwashing machines removes even the toughest stains such as starch and proteins from pasta or eggs. Thanks to its Fairy power and formula, it delivers brilliant cleaning across all water hardness. For spotless results, use together with Fairy Professional Rinse Aid.",
    shortDescription: "Lifts grease and food residues from pots, pans, plates, cutlery, etc",
    images: [
      assets.DishwasherDetergent1,
      assets.DishwasherDetergent2,
      assets.DishwasherDetergent3,
      assets.DishwasherDetergent4,
    ],
    features: ["With Fairy power for brilliant cleaning", "Helps to remove tough stains such as starch and protein", "Can be used across all water hardness", "To be used together with Fairy Professional Rinse Aid"],
    specifications: {
      variety: "Safety & Ingredients",
      origin: "Fairy Professional®"
    },
    sku: "RA-BAS-001",
    status: "active",
    stock_quantity: 120,
    low_stock_threshold: 20,
    weight: "5000",
    dimensions: "10L",
    bestseller: true,
    featured: true
  },

  {
    id: "prod-010",
    name: "Powder Detergent",
    slug: "PowderDetergent",
    brandId: "brand-013",
    categoryId: "cat-004",
    description: "Ariel Professional Washing Powder Regular is a professional detergent specially formulated to deliver No. 1 cleaning results for professionals: excellent stain removal, deep down cleaning, brilliant whiteness, great freshness and efficiency at low temperature.",
    shortDescription: "High performing ingredients which deliver outstanding stain removal and cleaning on the toughest professional stains",
    images: [
      assets.PowderDetergent1,
      assets.PowderDetergent2,
      assets.PowderDetergent3,
      assets.PowderDetergent4,
      assets.PowderDetergent5,
    ],
    features: ["High performing ingredients which deliver outstanding stain removal and cleaning on the toughest professional stains", "Contains specific whiteness technologies which keep your whites white for longer", "The perfume system delivers a non-overpowering fresh scent to your professional laundry", "TGreat cleaning results even without pre-washing or pre-soaking to help you save water and energy", "Phosphate and bleach free", "Recommended for professional use"],
    specifications: {
      variety: "Safety & Ingredients",
      origin: "Ariel Professional®"
    },
    sku: "RA-BAS-001",
    status: "active",
    stock_quantity: 120,
    low_stock_threshold: 20,
    weight: "5000",
    dimensions: "Power 6.6kg 120 Washes",
    bestseller: true,
    featured: true
  },

];

// Helper functions (UPDATED for many-to-many relationships)
export const getProductsByBrand = (brandId) => {
  return products.filter(product => product.brandId === brandId);
};

export const getBrandsByCategory = (categoryId) => {
  return brands.filter(brand => brand.categoryIds && brand.categoryIds.includes(categoryId));
};

export const getProductsByCategory = (categoryId) => {
  return products.filter(product => product.categoryId === categoryId);
};

export const getBrandById = (brandId) => {
  return brands.find(brand => brand.id === brandId);
};

export const getCategoryById = (categoryId) => {
  return categories.find(category => category.id === categoryId);
};

export const getProductById = (productId) => {
  return products.find(product => product.id === productId);
};

export const getProductBySlug = (slug) => {
  return products.find(product => product.slug === slug);
};

export const getBrandBySlug = (slug) => {
  return brands.find(brand => brand.slug === slug);
};

export const getCategoryBySlug = (slug) => {
  return categories.find(category => category.slug === slug);
};

export const getFeaturedProducts = () => {
  return products.filter(product => product.featured);
};

export const getBestsellers = () => {
  return products.filter(product => product.bestseller);
};

export const getFeaturedBrands = () => {
  return brands.filter(brand => brand.featured);
};

export const getFeaturedCategories = () => {
  return categories.filter(category => category.featured);
};

// NEW HELPER: Get all categories for a specific brand
export const getCategoriesByBrand = (brandId) => {
  const brand = getBrandById(brandId);
  if (!brand || !brand.categoryIds) return [];
  return categories.filter(category => brand.categoryIds.includes(category.id));
};

// NEW HELPER: Get brands that belong to multiple categories
export const getMultiCategoryBrands = () => {
  return brands.filter(brand => brand.categoryIds && brand.categoryIds.length > 1);
};