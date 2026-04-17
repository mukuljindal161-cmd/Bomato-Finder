import { db } from "@workspace/db";
import {
  restaurantsTable,
  cuisinesTable,
  restaurantCuisinesTable,
  menuCategoriesTable,
  menuItemsTable,
} from "@workspace/db";
import { eq, sql } from "drizzle-orm";

const RESTAURANTS = [
  {
    id: 1,
    name: "The Golden Fork",
    slug: "the-golden-fork",
    description: "Authentic Italian and Mediterranean cuisine in a warm, welcoming atmosphere.",
    imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&q=80",
    rating: "4.8",
    reviewCount: 1243,
    priceLevel: 3,
    deliveryTimeMin: 25,
    deliveryTimeMax: 35,
    isOpen: true,
    distance: "1.2 km",
    cuisines: ["Italian", "Mediterranean"],
  },
  {
    id: 2,
    name: "Sakura Garden",
    slug: "sakura-garden",
    description: "Premium Japanese sushi and seasonal specialties crafted with precision.",
    imageUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=80",
    rating: "4.6",
    reviewCount: 892,
    priceLevel: 3,
    deliveryTimeMin: 30,
    deliveryTimeMax: 45,
    isOpen: true,
    distance: "2.1 km",
    cuisines: ["Japanese", "Sushi"],
  },
  {
    id: 3,
    name: "Spice Route",
    slug: "spice-route",
    description: "Bold Indian curries and aromatic spices from across the subcontinent.",
    imageUrl: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=80",
    rating: "4.5",
    reviewCount: 734,
    priceLevel: 2,
    deliveryTimeMin: 20,
    deliveryTimeMax: 30,
    isOpen: true,
    distance: "0.8 km",
    cuisines: ["Indian", "Curry"],
  },
  {
    id: 4,
    name: "La Maison Bistro",
    slug: "la-maison-bistro",
    description: "Classic French bistro fare with European flair and a curated wine list.",
    imageUrl: "https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?w=1200&q=80",
    rating: "4.9",
    reviewCount: 2104,
    priceLevel: 4,
    deliveryTimeMin: 40,
    deliveryTimeMax: 55,
    isOpen: true,
    distance: "3.5 km",
    cuisines: ["French", "European"],
  },
  {
    id: 5,
    name: "Taco Fiesta",
    slug: "taco-fiesta",
    description: "Fresh Tex-Mex tacos, burritos, and nachos made with daily ingredients.",
    imageUrl: "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=1200&q=80",
    rating: "4.3",
    reviewCount: 567,
    priceLevel: 1,
    deliveryTimeMin: 15,
    deliveryTimeMax: 25,
    isOpen: true,
    distance: "0.5 km",
    cuisines: ["Mexican", "Tex-Mex"],
  },
  {
    id: 6,
    name: "The Coastal Table",
    slug: "the-coastal-table",
    description: "Fresh seafood and American coastal classics, right from the ocean to your table.",
    imageUrl: "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=1200&q=80",
    rating: "4.7",
    reviewCount: 1089,
    priceLevel: 3,
    deliveryTimeMin: 35,
    deliveryTimeMax: 50,
    isOpen: false,
    distance: "4.2 km",
    cuisines: ["Seafood", "American"],
  },
  {
    id: 7,
    name: "Dragon Palace",
    slug: "dragon-palace",
    description: "Authentic Chinese dim sum and Cantonese classics in a vibrant setting.",
    imageUrl: "https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?w=1200&q=80",
    rating: "4.4",
    reviewCount: 823,
    priceLevel: 2,
    deliveryTimeMin: 25,
    deliveryTimeMax: 40,
    isOpen: true,
    distance: "1.8 km",
    cuisines: ["Chinese", "Dim Sum"],
  },
  {
    id: 8,
    name: "Olive & Thyme",
    slug: "olive-and-thyme",
    description: "Greek and Mediterranean small plates, dips, and mezze sharing boards.",
    imageUrl: "https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?w=1200&q=80",
    rating: "4.6",
    reviewCount: 445,
    priceLevel: 2,
    deliveryTimeMin: 20,
    deliveryTimeMax: 35,
    isOpen: true,
    distance: "1.1 km",
    cuisines: ["Greek", "Mediterranean"],
  },
  {
    id: 9,
    name: "Seoul Kitchen",
    slug: "seoul-kitchen",
    description: "Korean BBQ and traditional dishes bursting with umami and heat.",
    imageUrl: "https://images.unsplash.com/photo-1517244683847-7456b63c5969?w=1200&q=80",
    rating: "4.5",
    reviewCount: 678,
    priceLevel: 2,
    deliveryTimeMin: 30,
    deliveryTimeMax: 45,
    isOpen: true,
    distance: "2.7 km",
    cuisines: ["Korean", "BBQ"],
  },
  {
    id: 10,
    name: "The Garden Brasserie",
    slug: "the-garden-brasserie",
    description: "Organic vegetarian and vegan dishes celebrating seasonal produce.",
    imageUrl: "https://images.unsplash.com/photo-1526234362653-3b75a0c07438?w=1200&q=80",
    rating: "4.2",
    reviewCount: 312,
    priceLevel: 2,
    deliveryTimeMin: 20,
    deliveryTimeMax: 30,
    isOpen: true,
    distance: "0.9 km",
    cuisines: ["Vegetarian", "Vegan", "Organic"],
  },
  {
    id: 11,
    name: "El Gaucho Steakhouse",
    slug: "el-gaucho-steakhouse",
    description: "Premium Argentine steaks, grilled to perfection over an open flame.",
    imageUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?w=1200&q=80",
    rating: "4.8",
    reviewCount: 1567,
    priceLevel: 4,
    deliveryTimeMin: 45,
    deliveryTimeMax: 60,
    isOpen: true,
    distance: "5.3 km",
    cuisines: ["Steakhouse", "Argentine"],
  },
  {
    id: 12,
    name: "Noodle House",
    slug: "noodle-house",
    description: "Thai and Vietnamese noodle bowls made fresh to order with aromatic broths.",
    imageUrl: "https://images.unsplash.com/photo-1617093727343-374698b1b08d?w=1200&q=80",
    rating: "4.1",
    reviewCount: 289,
    priceLevel: 1,
    deliveryTimeMin: 15,
    deliveryTimeMax: 25,
    isOpen: false,
    distance: "1.4 km",
    cuisines: ["Thai", "Vietnamese", "Noodles"],
  },
];

const MENU: Record<number, { category: string; items: { name: string; description: string; price: number; isVeg?: boolean }[] }[]> = {
  1: [
    { category: "Starters", items: [
      { name: "Bruschetta al Pomodoro", description: "Grilled sourdough with fresh tomatoes, basil, and EVOO", price: 11, isVeg: true },
      { name: "Arancini", description: "Crispy risotto balls filled with mozzarella and herbs", price: 13, isVeg: true },
      { name: "Carpaccio di Manzo", description: "Thin-sliced beef with rocket, capers, and parmesan", price: 16 },
    ]},
    { category: "Pasta", items: [
      { name: "Tagliatelle al Ragù", description: "Slow-cooked Bolognese with fresh egg pasta", price: 22 },
      { name: "Pappardelle ai Funghi", description: "Wide pasta with wild mushrooms and truffle cream", price: 24, isVeg: true },
      { name: "Cacio e Pepe", description: "Classic Roman pasta with pecorino and black pepper", price: 19, isVeg: true },
    ]},
    { category: "Mains", items: [
      { name: "Branzino al Forno", description: "Oven-baked sea bass with lemon, capers, and olive oil", price: 32 },
      { name: "Pollo alla Milanese", description: "Breaded chicken cutlet with arugula and cherry tomatoes", price: 26 },
      { name: "Osso Buco", description: "Braised veal shank with gremolata and saffron risotto", price: 38 },
    ]},
    { category: "Desserts", items: [
      { name: "Tiramisu", description: "Classic espresso and mascarpone dessert", price: 10, isVeg: true },
      { name: "Panna Cotta", description: "Vanilla cream with berry coulis", price: 9, isVeg: true },
    ]},
  ],
  2: [
    { category: "Starters", items: [
      { name: "Edamame", description: "Steamed salted soybeans", price: 6, isVeg: true },
      { name: "Gyoza (6 pcs)", description: "Pan-fried pork and cabbage dumplings with ponzu", price: 12 },
      { name: "Miso Soup", description: "Traditional dashi broth with tofu and wakame", price: 5, isVeg: true },
    ]},
    { category: "Sushi Rolls", items: [
      { name: "Salmon Avocado Roll (8 pcs)", description: "Fresh salmon, ripe avocado, cucumber", price: 15 },
      { name: "Spicy Tuna Roll (8 pcs)", description: "Tuna, sriracha mayo, cucumber", price: 16 },
      { name: "Dragon Roll (8 pcs)", description: "Prawn tempura, avocado top, eel sauce", price: 19 },
      { name: "Rainbow Roll (8 pcs)", description: "California roll topped with assorted sashimi", price: 21 },
    ]},
    { category: "Nigiri & Sashimi", items: [
      { name: "Salmon Nigiri (2 pcs)", description: "Hand-pressed rice with fresh salmon", price: 9 },
      { name: "Tuna Sashimi (5 pcs)", description: "Premium bluefin slices with wasabi", price: 18 },
    ]},
    { category: "Mains", items: [
      { name: "Chicken Teriyaki", description: "Grilled chicken thigh with teriyaki glaze and rice", price: 22 },
      { name: "Wagyu Donburi", description: "Premium wagyu beef over steamed rice with egg yolk", price: 34 },
    ]},
  ],
  3: [
    { category: "Starters", items: [
      { name: "Samosa (2 pcs)", description: "Crispy pastry filled with spiced potato and peas", price: 7, isVeg: true },
      { name: "Chicken Tikka", description: "Tandoor-grilled chicken with mint chutney", price: 14 },
      { name: "Paneer Tikka", description: "Marinated cottage cheese skewers with peppers", price: 13, isVeg: true },
    ]},
    { category: "Curries", items: [
      { name: "Butter Chicken", description: "Slow-cooked chicken in creamy tomato sauce", price: 17 },
      { name: "Lamb Rogan Josh", description: "Kashmiri braised lamb with aromatic spices", price: 20 },
      { name: "Palak Paneer", description: "Fresh cottage cheese in spiced spinach gravy", price: 15, isVeg: true },
      { name: "Dal Makhani", description: "Slow-cooked black lentils with butter and cream", price: 14, isVeg: true },
    ]},
    { category: "Breads & Rice", items: [
      { name: "Garlic Naan", description: "Tandoor-baked bread with garlic and butter", price: 4, isVeg: true },
      { name: "Biryani (Chicken)", description: "Aromatic basmati rice with spiced chicken and saffron", price: 18 },
      { name: "Jeera Rice", description: "Basmati rice tempered with cumin", price: 6, isVeg: true },
    ]},
  ],
  4: [
    { category: "Entrées", items: [
      { name: "French Onion Soup", description: "Slow-cooked onion broth topped with Gruyère crouton", price: 14, isVeg: true },
      { name: "Foie Gras Torchon", description: "Duck liver with brioche and fig compote", price: 22 },
      { name: "Escargots de Bourgogne", description: "Baked snails in garlic-herb butter", price: 18 },
    ]},
    { category: "Plats Principaux", items: [
      { name: "Steak Frites", description: "Bavette steak with crispy frites and béarnaise", price: 36 },
      { name: "Bouillabaisse", description: "Classic Provençal seafood stew with rouille and crostini", price: 40 },
      { name: "Duck Confit", description: "Slow-rendered duck leg with Puy lentils and jus", price: 34 },
      { name: "Sole Meunière", description: "Pan-fried sole in lemon-brown butter with capers", price: 38 },
    ]},
    { category: "Desserts", items: [
      { name: "Crème Brûlée", description: "Classic vanilla custard with caramelised sugar crust", price: 12, isVeg: true },
      { name: "Île Flottante", description: "Soft meringue floating in vanilla crème anglaise", price: 11, isVeg: true },
    ]},
  ],
  5: [
    { category: "Tacos (2 pcs)", items: [
      { name: "Carne Asada Tacos", description: "Grilled beef, pico de gallo, cilantro, lime", price: 11 },
      { name: "Al Pastor Tacos", description: "Marinated pork, pineapple, onion, cilantro", price: 11 },
      { name: "Fish Tacos", description: "Battered tilapia, slaw, chipotle crema", price: 12 },
      { name: "Black Bean Tacos", description: "Spiced black beans, avocado, pickled jalapeño", price: 9, isVeg: true },
    ]},
    { category: "Burritos & Bowls", items: [
      { name: "Chicken Burrito", description: "Grilled chicken, rice, beans, cheese, sour cream", price: 13 },
      { name: "Veggie Bowl", description: "Cilantro rice, black beans, corn, guacamole", price: 11, isVeg: true },
    ]},
    { category: "Sides & Extras", items: [
      { name: "Nachos with Cheese", description: "Crispy tortilla chips, melted cheddar, jalapeños", price: 9, isVeg: true },
      { name: "Guacamole & Chips", description: "Fresh-smashed avocado with tomato and lime", price: 8, isVeg: true },
      { name: "Churros", description: "Cinnamon-sugar fried dough with chocolate dip", price: 7, isVeg: true },
    ]},
  ],
  6: [
    { category: "Starters", items: [
      { name: "Clam Chowder", description: "New England style with crusty sourdough bowl", price: 14 },
      { name: "Shrimp Cocktail", description: "Chilled jumbo shrimp with house cocktail sauce", price: 17 },
      { name: "Oysters on the Half Shell (6 pcs)", description: "Fresh Pacific oysters with mignonette", price: 22 },
    ]},
    { category: "Mains", items: [
      { name: "Lobster Tail", description: "Butter-poached 8oz tail with drawn butter and lemon", price: 55 },
      { name: "Pan-Seared Salmon", description: "Atlantic salmon, asparagus, lemon caper beurre blanc", price: 32 },
      { name: "Fish & Chips", description: "Beer-battered cod with hand-cut fries and tartare", price: 24 },
      { name: "Crab Cake Plate", description: "Two jumbo crab cakes with remoulade and greens", price: 38 },
    ]},
  ],
  7: [
    { category: "Dim Sum", items: [
      { name: "Har Gow (4 pcs)", description: "Steamed prawn dumplings in thin rice flour wrapper", price: 10 },
      { name: "Siu Mai (4 pcs)", description: "Pork and prawn open-top steamed dumplings", price: 10 },
      { name: "Cheung Fun (Shrimp)", description: "Silky rice noodle rolls with prawn", price: 11 },
      { name: "Char Siu Bao (3 pcs)", description: "Baked BBQ pork buns", price: 9 },
      { name: "Egg Tarts (3 pcs)", description: "Flaky pastry with silky egg custard", price: 8, isVeg: true },
    ]},
    { category: "Mains", items: [
      { name: "Peking Duck (Half)", description: "Crispy roasted duck with pancakes, hoisin, and scallion", price: 42 },
      { name: "Kung Pao Chicken", description: "Wok-tossed chicken with peanuts and chilli", price: 18 },
      { name: "Mapo Tofu", description: "Silken tofu in spicy Sichuan sauce", price: 15, isVeg: true },
      { name: "Prawn Fried Rice", description: "Wok-fried jasmine rice with tiger prawns and egg", price: 17 },
    ]},
  ],
  8: [
    { category: "Mezze", items: [
      { name: "Hummus with Pita", description: "Smooth chickpea dip with EVOO and warm pita", price: 9, isVeg: true },
      { name: "Spanakopita", description: "Spinach and feta phyllo triangles", price: 11, isVeg: true },
      { name: "Grilled Halloumi", description: "Cypriot cheese with lemon, honey, and herbs", price: 13, isVeg: true },
      { name: "Tzatziki", description: "Strained yoghurt with cucumber, dill, and garlic", price: 8, isVeg: true },
    ]},
    { category: "Mains", items: [
      { name: "Lamb Kleftiko", description: "Slow-baked lamb shoulder with potatoes and orzo", price: 28 },
      { name: "Grilled Sea Bream", description: "Whole fish with lemon, oregano, and olive oil", price: 30 },
      { name: "Moussaka", description: "Layered eggplant, spiced beef, and béchamel", price: 22 },
    ]},
    { category: "Desserts", items: [
      { name: "Baklava", description: "Layered phyllo with honey, walnuts, and pistachios", price: 9, isVeg: true },
      { name: "Loukoumades", description: "Greek honey doughnuts with cinnamon and sesame", price: 8, isVeg: true },
    ]},
  ],
  9: [
    { category: "Starters", items: [
      { name: "Pajeon", description: "Crispy green onion pancake with soy dipping sauce", price: 12, isVeg: true },
      { name: "Japchae", description: "Glass noodles with vegetables and sesame", price: 14, isVeg: true },
    ]},
    { category: "BBQ", items: [
      { name: "Samgyeopsal (Pork Belly)", description: "Grilled thick-cut pork belly with ssam wraps", price: 24 },
      { name: "Galbi (Beef Short Rib)", description: "Marinated LA-cut short ribs, grilled at the table", price: 30 },
      { name: "Bulgogi", description: "Thinly sliced marinated beef with mushrooms and onion", price: 22 },
    ]},
    { category: "Rice & Stews", items: [
      { name: "Bibimbap", description: "Rice bowl with vegetables, egg, and gochujang", price: 16, isVeg: true },
      { name: "Sundubu Jjigae", description: "Spicy soft tofu stew with seafood and egg", price: 17 },
      { name: "Kimchi Jjigae", description: "Fermented kimchi stew with pork and tofu", price: 15 },
    ]},
  ],
  10: [
    { category: "Salads & Bowls", items: [
      { name: "Quinoa Power Bowl", description: "Roasted veg, chickpeas, tahini, and mixed greens", price: 16, isVeg: true },
      { name: "Heirloom Tomato Salad", description: "With burrata, basil oil, and aged balsamic", price: 14, isVeg: true },
    ]},
    { category: "Mains", items: [
      { name: "Mushroom Wellington", description: "Mixed mushroom and lentil pastry with red wine jus", price: 22, isVeg: true },
      { name: "Cauliflower Steak", description: "Roasted with harissa, pomegranate, and herb yoghurt", price: 19, isVeg: true },
      { name: "Lentil Dhal", description: "Slow-cooked red lentils with turmeric and coconut", price: 15, isVeg: true },
      { name: "Beetroot Burger", description: "Beetroot-walnut patty, avocado, sprouts on brioche", price: 17, isVeg: true },
    ]},
    { category: "Desserts", items: [
      { name: "Chocolate Avocado Mousse", description: "Rich dark chocolate mousse, vegan", price: 10, isVeg: true },
      { name: "Chia Pudding", description: "Coconut chia pudding with mango and passion fruit", price: 9, isVeg: true },
    ]},
  ],
  11: [
    { category: "Starters", items: [
      { name: "Beef Empanadas (3 pcs)", description: "Flaky pastry with spiced minced beef and olives", price: 13 },
      { name: "Provoleta", description: "Grilled provolone with chimichurri and chilli flakes", price: 15, isVeg: true },
      { name: "Choripán", description: "Argentine chorizo in a crusty roll with chimichurri", price: 12 },
    ]},
    { category: "Steaks", items: [
      { name: "Bife de Chorizo (300g)", description: "Argentine sirloin, charred on open flame", price: 42 },
      { name: "Ojo de Bife (350g)", description: "Prime ribeye, rich marbling, robust flavour", price: 52 },
      { name: "Entraña (250g)", description: "Skirt steak, grilled medium rare, with salsa criolla", price: 36 },
    ]},
    { category: "Sides", items: [
      { name: "Fries with Chimichurri", description: "Hand-cut fries with house chimichurri", price: 9 },
      { name: "Grilled Vegetables", description: "Seasonal veg with olive oil and herbs", price: 10, isVeg: true },
    ]},
  ],
  12: [
    { category: "Soups", items: [
      { name: "Tom Yum Soup", description: "Spicy and sour broth with shrimp, lemongrass, and mushrooms", price: 10 },
      { name: "Pho Bo", description: "Vietnamese beef noodle soup with fresh herbs and bean sprouts", price: 15 },
      { name: "Bun Bo Hue", description: "Spicy lemongrass beef noodle soup with pork sausage", price: 16 },
    ]},
    { category: "Starters", items: [
      { name: "Fresh Spring Rolls (2 pcs)", description: "Rice paper rolls with tofu, vegetables, and peanut sauce", price: 8, isVeg: true },
      { name: "Green Papaya Salad", description: "Shredded papaya, cherry tomatoes, chilli, lime dressing", price: 12, isVeg: true },
    ]},
    { category: "Noodles", items: [
      { name: "Pad Thai", description: "Stir-fried rice noodles with eggs, peanuts, and lime", price: 14 },
      { name: "Drunken Noodles", description: "Wide rice noodles with basil, chilli, and your choice of protein", price: 15 },
      { name: "Pad See Ew", description: "Soy-glazed flat noodles with broccoli and egg", price: 14 },
    ]},
    { category: "Desserts", items: [
      { name: "Mango Sticky Rice", description: "Sweet glutinous rice with ripe mango and coconut cream", price: 8, isVeg: true },
    ]},
  ],
};

export async function seed() {
  console.log("🌱 Seeding database...");

  const existingRestaurants = await db.select({ id: restaurantsTable.id }).from(restaurantsTable).limit(1);
  if (existingRestaurants.length > 0) {
    console.log("✅ Database already seeded, skipping.");
    return;
  }

  for (const r of RESTAURANTS) {
    const [inserted] = await db
      .insert(restaurantsTable)
      .values({
        name: r.name,
        slug: r.slug,
        description: r.description,
        imageUrl: r.imageUrl,
        rating: r.rating,
        reviewCount: r.reviewCount,
        priceLevel: r.priceLevel,
        deliveryTimeMin: r.deliveryTimeMin,
        deliveryTimeMax: r.deliveryTimeMax,
        isOpen: r.isOpen,
        distance: r.distance,
      })
      .returning({ id: restaurantsTable.id });

    const restaurantId = inserted.id;

    for (const cuisineName of r.cuisines) {
      let [cuisine] = await db
        .select()
        .from(cuisinesTable)
        .where(eq(cuisinesTable.name, cuisineName))
        .limit(1);

      if (!cuisine) {
        [cuisine] = await db
          .insert(cuisinesTable)
          .values({ name: cuisineName })
          .returning();
      }

      await db
        .insert(restaurantCuisinesTable)
        .values({ restaurantId, cuisineId: cuisine.id })
        .onConflictDoNothing();
    }

    const menuData = MENU[r.id];
    if (menuData) {
      let catOrder = 0;
      for (const section of menuData) {
        const [cat] = await db
          .insert(menuCategoriesTable)
          .values({ restaurantId, name: section.category, displayOrder: catOrder++ })
          .returning();

        let itemOrder = 0;
        for (const item of section.items) {
          await db.insert(menuItemsTable).values({
            restaurantId,
            categoryId: cat.id,
            name: item.name,
            description: item.description,
            price: item.price.toFixed(2),
            isVeg: item.isVeg ?? false,
            displayOrder: itemOrder++,
          });
        }
      }
    }

    console.log(`  ✓ Seeded: ${r.name}`);
  }

  console.log("✅ Seeding complete.");
}
