export type MenuItem = {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
};

export type RestaurantMenu = {
  restaurantId: number;
  items: MenuItem[];
};

export const menus: Record<number, RestaurantMenu> = {
  1: {
    restaurantId: 1,
    items: [
      { id: 101, name: "Bruschetta al Pomodoro", description: "Toasted bread with fresh tomatoes, garlic, and basil", price: 9.5, category: "Starters" },
      { id: 102, name: "Burrata con Prosciutto", description: "Creamy burrata with aged prosciutto and arugula", price: 14, category: "Starters" },
      { id: 103, name: "Tagliatelle al Ragù", description: "Fresh egg pasta with slow-cooked Bolognese meat sauce", price: 18, category: "Pasta" },
      { id: 104, name: "Pappardelle al Tartufo", description: "Wide ribbon pasta with black truffle and pecorino", price: 24, category: "Pasta" },
      { id: 105, name: "Osso Buco alla Milanese", description: "Braised veal shank with gremolata and saffron risotto", price: 32, category: "Mains" },
      { id: 106, name: "Branzino al Forno", description: "Roasted sea bass with capers, olives, and cherry tomatoes", price: 28, category: "Mains" },
      { id: 107, name: "Tiramisù", description: "Classic espresso-soaked ladyfingers with mascarpone cream", price: 9, category: "Desserts" },
      { id: 108, name: "Panna Cotta", description: "Vanilla cream with fresh berry coulis", price: 8, category: "Desserts" },
    ],
  },
  2: {
    restaurantId: 2,
    items: [
      { id: 201, name: "Edamame", description: "Steamed salted soybeans", price: 5.5, category: "Starters" },
      { id: 202, name: "Gyoza", description: "Pan-fried pork and cabbage dumplings with ponzu", price: 9, category: "Starters" },
      { id: 203, name: "Salmon Nigiri (2 pcs)", description: "Hand-pressed sushi rice with fresh Atlantic salmon", price: 8, category: "Sushi" },
      { id: 204, name: "Tuna Tataki Roll", description: "Seared tuna, avocado, cucumber, spicy mayo", price: 16, category: "Sushi" },
      { id: 205, name: "Rainbow Roll (8 pcs)", description: "California roll topped with assorted sashimi", price: 22, category: "Sushi" },
      { id: 206, name: "Tonkotsu Ramen", description: "Rich pork broth, chashu, soft egg, nori, bamboo shoots", price: 17, category: "Mains" },
      { id: 207, name: "Chicken Katsu Curry", description: "Crispy chicken cutlet with Japanese curry and steamed rice", price: 19, category: "Mains" },
      { id: 208, name: "Mochi Ice Cream (3 pcs)", description: "Choice of matcha, mango, or strawberry", price: 8, category: "Desserts" },
    ],
  },
  3: {
    restaurantId: 3,
    items: [
      { id: 301, name: "Samosa (2 pcs)", description: "Crispy pastry filled with spiced potatoes and peas", price: 6, category: "Starters" },
      { id: 302, name: "Onion Bhaji", description: "Golden fried onion fritters with mint chutney", price: 7, category: "Starters" },
      { id: 303, name: "Butter Chicken", description: "Tender chicken in a rich, creamy tomato-spiced sauce", price: 17, category: "Mains" },
      { id: 304, name: "Lamb Rogan Josh", description: "Slow-cooked lamb with aromatic Kashmiri spices", price: 20, category: "Mains" },
      { id: 305, name: "Paneer Tikka Masala", description: "Grilled cottage cheese cubes in a vibrant masala gravy", price: 16, category: "Mains" },
      { id: 306, name: "Dal Tadka", description: "Yellow lentils tempered with cumin, garlic, and tomatoes", price: 13, category: "Mains" },
      { id: 307, name: "Garlic Naan", description: "Tandoor-baked flatbread brushed with garlic butter", price: 4, category: "Breads" },
      { id: 308, name: "Gulab Jamun", description: "Soft milk-solid dumplings in rose-cardamom syrup", price: 7, category: "Desserts" },
    ],
  },
  4: {
    restaurantId: 4,
    items: [
      { id: 401, name: "Soupe à l'Oignon", description: "Classic French onion soup with Gruyère crouton", price: 13, category: "Starters" },
      { id: 402, name: "Escargots de Bourgogne", description: "Burgundy snails in garlic-herb butter, six pieces", price: 17, category: "Starters" },
      { id: 403, name: "Steak Frites", description: "French-cut entrecôte with Béarnaise and hand-cut fries", price: 36, category: "Mains" },
      { id: 404, name: "Duck Confit", description: "Slow-cooked duck leg with lentils du Puy and jus", price: 34, category: "Mains" },
      { id: 405, name: "Bouillabaisse", description: "Provençal fisherman's stew with rouille and crusty bread", price: 38, category: "Mains" },
      { id: 406, name: "Crème Brûlée", description: "Silky vanilla custard with a caramelised sugar crust", price: 11, category: "Desserts" },
      { id: 407, name: "Tarte Tatin", description: "Upside-down caramelised apple tart with crème fraîche", price: 12, category: "Desserts" },
    ],
  },
  5: {
    restaurantId: 5,
    items: [
      { id: 501, name: "Guacamole & Chips", description: "Freshly mashed avocado with lime, cilantro, and jalapeño", price: 8, category: "Starters" },
      { id: 502, name: "Queso Fundido", description: "Melted cheese dip with chorizo and warm tortillas", price: 10, category: "Starters" },
      { id: 503, name: "Street Tacos (3 pcs)", description: "Choice of carne asada, chicken tinga, or carnitas with onion and salsa", price: 14, category: "Tacos" },
      { id: 504, name: "Fish Tacos (2 pcs)", description: "Beer-battered cod, cabbage slaw, chipotle crema", price: 13, category: "Tacos" },
      { id: 505, name: "Burrito Bowl", description: "Rice, beans, protein of choice, pico de gallo, sour cream", price: 15, category: "Bowls" },
      { id: 506, name: "Enchiladas Verdes", description: "Corn tortillas filled with chicken, topped with tomatillo sauce", price: 16, category: "Mains" },
      { id: 507, name: "Churros & Chocolate", description: "Cinnamon-dusted churros with warm dark chocolate sauce", price: 7, category: "Desserts" },
    ],
  },
  6: {
    restaurantId: 6,
    items: [
      { id: 601, name: "Oysters (6 pcs)", description: "Fresh Pacific oysters with mignonette and lemon", price: 18, category: "Starters" },
      { id: 602, name: "Clam Chowder", description: "New England style, served in a sourdough bread bowl", price: 14, category: "Starters" },
      { id: 603, name: "Grilled Whole Lobster", description: "1.5 lb Maine lobster with garlic herb butter and fries", price: 52, category: "Mains" },
      { id: 604, name: "Pan-Seared Halibut", description: "Alaskan halibut with cauliflower purée and capers", price: 36, category: "Mains" },
      { id: 605, name: "Shrimp Po'Boy", description: "Crispy shrimp, lettuce, tomato, remoulade on a hoagie", price: 19, category: "Mains" },
      { id: 606, name: "Lemon Tart", description: "Silky lemon curd in a butter pastry shell", price: 10, category: "Desserts" },
    ],
  },
  7: {
    restaurantId: 7,
    items: [
      { id: 701, name: "Spring Rolls (4 pcs)", description: "Crispy vegetable rolls with sweet chilli dipping sauce", price: 8, category: "Starters" },
      { id: 702, name: "Dumplings / Har Gow (4 pcs)", description: "Steamed shrimp dumplings in delicate rice paper", price: 9, category: "Dim Sum" },
      { id: 703, name: "Char Siu Bao (3 pcs)", description: "Fluffy steamed buns with barbecue pork filling", price: 8.5, category: "Dim Sum" },
      { id: 704, name: "Peking Duck (half)", description: "Crispy lacquered duck with pancakes, hoisin, and cucumber", price: 38, category: "Mains" },
      { id: 705, name: "Mapo Tofu", description: "Silken tofu in spicy Sichuan bean paste with minced pork", price: 16, category: "Mains" },
      { id: 706, name: "Beef Chow Fun", description: "Wok-fried rice noodles with beef, bean sprouts, and scallions", price: 17, category: "Mains" },
      { id: 707, name: "Mango Pudding", description: "Smooth chilled mango pudding with fresh fruit", price: 6, category: "Desserts" },
    ],
  },
  8: {
    restaurantId: 8,
    items: [
      { id: 801, name: "Tzatziki & Pita", description: "Thick Greek yogurt with cucumber, garlic, and fresh pita", price: 8, category: "Starters" },
      { id: 802, name: "Spanakopita", description: "Flaky phyllo pie filled with spinach and feta", price: 10, category: "Starters" },
      { id: 803, name: "Lamb Souvlaki", description: "Grilled marinated lamb skewers with herbed rice and tzatziki", price: 22, category: "Mains" },
      { id: 804, name: "Grilled Octopus", description: "Charred octopus with lemon, capers, and olive oil", price: 26, category: "Mains" },
      { id: 805, name: "Moussaka", description: "Layered aubergine, minced lamb, and béchamel", price: 19, category: "Mains" },
      { id: 806, name: "Baklava", description: "Layered filo pastry with pistachios and honey syrup", price: 8, category: "Desserts" },
    ],
  },
  9: {
    restaurantId: 9,
    items: [
      { id: 901, name: "Japchae", description: "Stir-fried glass noodles with vegetables and beef", price: 11, category: "Starters" },
      { id: 902, name: "Pajeon", description: "Crispy green onion and seafood pancake", price: 13, category: "Starters" },
      { id: 903, name: "Korean BBQ Beef Ribs", description: "Marinated short ribs grilled tableside with banchan", price: 34, category: "BBQ" },
      { id: 904, name: "Samgyeopsal", description: "Thick-cut pork belly grilled with sesame oil and garlic", price: 28, category: "BBQ" },
      { id: 905, name: "Bibimbap", description: "Stone pot rice with mixed vegetables, beef, and gochujang", price: 18, category: "Bowls" },
      { id: 906, name: "Sundubu Jjigae", description: "Spicy soft tofu stew with clams and egg", price: 16, category: "Soups" },
      { id: 907, name: "Bingsu", description: "Shaved ice dessert with red bean, mochi, and condensed milk", price: 9, category: "Desserts" },
    ],
  },
  10: {
    restaurantId: 10,
    items: [
      { id: 1001, name: "Roasted Beetroot Salad", description: "Golden and red beets, goat cheese, toasted walnuts, honey dressing", price: 13, category: "Starters" },
      { id: 1002, name: "Wild Mushroom Soup", description: "Creamy forest mushroom velouté with truffle oil", price: 11, category: "Starters" },
      { id: 1003, name: "Mushroom Risotto", description: "Arborio rice, wild mushrooms, Parmesan, white wine", price: 18, category: "Mains" },
      { id: 1004, name: "Lentil & Sweet Potato Dhal", description: "Spiced red lentil curry with coconut milk and roasted vegetables", price: 15, category: "Mains" },
      { id: 1005, name: "Roasted Cauliflower Steak", description: "Charred cauliflower, chermoula, chickpea purée", price: 17, category: "Mains" },
      { id: 1006, name: "Vegan Chocolate Torte", description: "Rich dark chocolate ganache on an almond base", price: 9, category: "Desserts" },
    ],
  },
  11: {
    restaurantId: 11,
    items: [
      { id: 1101, name: "Provoleta", description: "Grilled provolone cheese with chimichurri and fresh bread", price: 14, category: "Starters" },
      { id: 1102, name: "Empanadas (3 pcs)", description: "Baked pastry pockets filled with spiced beef and olives", price: 12, category: "Starters" },
      { id: 1103, name: "Bife de Chorizo 300g", description: "Argentine sirloin, cooked to order, served with roasted potatoes", price: 44, category: "Steaks" },
      { id: 1104, name: "Lomo 250g", description: "Tender beef tenderloin with red wine reduction and vegetables", price: 48, category: "Steaks" },
      { id: 1105, name: "Asado de Tira", description: "Slow-grilled short ribs, classic chimichurri and salsa criolla", price: 38, category: "Steaks" },
      { id: 1106, name: "Dulce de Leche Cheesecake", description: "Creamy cheesecake with Argentine caramel sauce", price: 11, category: "Desserts" },
    ],
  },
  12: {
    restaurantId: 12,
    items: [
      { id: 1201, name: "Tom Yum Soup", description: "Spicy and sour broth with shrimp, lemongrass, and mushrooms", price: 10, category: "Soups" },
      { id: 1202, name: "Fresh Spring Rolls (2 pcs)", description: "Rice paper rolls with tofu, vegetables, and peanut sauce", price: 8, category: "Starters" },
      { id: 1203, name: "Pad Thai", description: "Stir-fried rice noodles with eggs, peanuts, and lime", price: 14, category: "Noodles" },
      { id: 1204, name: "Pho Bo", description: "Vietnamese beef noodle soup with fresh herbs and bean sprouts", price: 15, category: "Noodles" },
      { id: 1205, name: "Bun Bo Hue", description: "Spicy lemongrass beef noodle soup with pork sausage", price: 16, category: "Noodles" },
      { id: 1206, name: "Green Papaya Salad", description: "Shredded papaya, cherry tomatoes, chilli, lime dressing", price: 12, category: "Salads" },
      { id: 1207, name: "Mango Sticky Rice", description: "Sweet glutinous rice with ripe mango and coconut cream", price: 8, category: "Desserts" },
    ],
  },
};
