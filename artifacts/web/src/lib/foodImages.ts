const BASE = "https://images.unsplash.com";
const Q = "?w=120&h=120&fit=crop&q=80";

// All IDs verified 200 OK and confirmed food photos (no restaurant interiors)
const GROUPS = {
  STARTER:   [`${BASE}/photo-1546069901-ba9599a7e63c${Q}`, `${BASE}/photo-1540914124281-342587941389${Q}`, `${BASE}/photo-1574484284002-952d92456975${Q}`, `${BASE}/photo-1603360946369-dc9bb6258143${Q}`],
  PASTA:     [`${BASE}/photo-1569050467447-ce54b3bbc37d${Q}`, `${BASE}/photo-1563245372-f21724e3856d${Q}`, `${BASE}/photo-1482049016688-2d3e1b311543${Q}`, `${BASE}/photo-1476224203421-9ac39bcb3327${Q}`],
  SOUP:      [`${BASE}/photo-1547592166-23ac45744acd${Q}`, `${BASE}/photo-1493770348161-369560ae357d${Q}`, `${BASE}/photo-1467003909585-2f8a72700288${Q}`, `${BASE}/photo-1432139555190-58524dae6a55${Q}`],
  SALAD:     [`${BASE}/photo-1512621776951-a57141f2eefd${Q}`, `${BASE}/photo-1519984388953-d2406bc725e1${Q}`, `${BASE}/photo-1626200419199-391ae4be7a41${Q}`, `${BASE}/photo-1504674900247-0877df9cc836${Q}`],
  STEAK:     [`${BASE}/photo-1544025162-d76694265947${Q}`, `${BASE}/photo-1546833999-b9f581a1996d${Q}`, `${BASE}/photo-1559847844-5315695dadae${Q}`, `${BASE}/photo-1586190848861-99aa4a171e90${Q}`],
  SEAFOOD:   [`${BASE}/photo-1485921325833-c519f76c4927${Q}`, `${BASE}/photo-1613844237701-8f3664fc2eff${Q}`, `${BASE}/photo-1553621042-f6e147245754${Q}`, `${BASE}/photo-1514190051997-0f6f39ca5cde${Q}`],
  INDIAN:    [`${BASE}/photo-1585937421612-70a008356fbe${Q}`, `${BASE}/photo-1414235077428-338989a2e8c0${Q}`, `${BASE}/photo-1601050690597-df0568f70950${Q}`, `${BASE}/photo-1589302168068-964664d93dc0${Q}`],
  BREAD:     [`${BASE}/photo-1615361200141-f45040f367be${Q}`, `${BASE}/photo-1568901346375-23c9450c58cd${Q}`, `${BASE}/photo-1606787366850-de6330128bfc${Q}`, `${BASE}/photo-1572802419224-296b0aeee0d9${Q}`],
  RICE:      [`${BASE}/photo-1589302168068-964664d93dc0${Q}`, `${BASE}/photo-1613844237701-8f3664fc2eff${Q}`, `${BASE}/photo-1626200419199-391ae4be7a41${Q}`, `${BASE}/photo-1553163147-622ab57be1c7${Q}`],
  DESSERT:   [`${BASE}/photo-1547592180-85f173990554${Q}`, `${BASE}/photo-1551024601-bec78aea704b${Q}`, `${BASE}/photo-1557800636-894a64c1696f${Q}`, `${BASE}/photo-1452195100486-9cc805987862${Q}`],
  FRENCH:    [`${BASE}/photo-1550966871-3ed3cdb5ed0c${Q}`, `${BASE}/photo-1603360946369-dc9bb6258143${Q}`, `${BASE}/photo-1586190848861-99aa4a171e90${Q}`, `${BASE}/photo-1540914124281-342587941389${Q}`],
  KOREAN:    [`${BASE}/photo-1553163147-622ab57be1c7${Q}`, `${BASE}/photo-1544025162-d76694265947${Q}`, `${BASE}/photo-1546833999-b9f581a1996d${Q}`, `${BASE}/photo-1613844237701-8f3664fc2eff${Q}`],
  FRIES:     [`${BASE}/photo-1604908176997-125f25cc6f3d${Q}`, `${BASE}/photo-1519984388953-d2406bc725e1${Q}`, `${BASE}/photo-1540914124281-342587941389${Q}`, `${BASE}/photo-1476224203421-9ac39bcb3327${Q}`],
  GENERAL:   [`${BASE}/photo-1476224203421-9ac39bcb3327${Q}`, `${BASE}/photo-1482049016688-2d3e1b311543${Q}`, `${BASE}/photo-1493770348161-369560ae357d${Q}`, `${BASE}/photo-1563245372-f21724e3856d${Q}`],
};

function pick(group: string[], itemId: number): string {
  return group[((itemId % group.length) + group.length) % group.length];
}

const KEYWORD_MAP: [RegExp, keyof typeof GROUPS][] = [
  // Pasta & Italian
  [/bruschetta|arancini|carpaccio|antipasto/i,                             "STARTER"],
  [/pasta|tagliatelle|pappardelle|ragu|bolognese|cacio|spaghetti|fettuccine|gnocchi/i, "PASTA"],
  [/branzino|sea bass|salmon|tuna|trout/i,                                 "SEAFOOD"],
  [/osso buco|veal|pollo|chicken/i,                                        "STEAK"],
  [/tiramisu|panna cotta|crème brûlée|creme brulee|profiterole|tarte|cake|gelato|ice cream|bingsu|tres leche|cheesecake/i, "DESSERT"],

  // Japanese
  [/sushi|nigiri|roll|sashimi/i,                                           "SEAFOOD"],
  [/gyoza|dumpling|mandu|wonton|dim sum|bao/i,                             "STARTER"],
  [/edamame|seaweed/i,                                                     "SALAD"],
  [/miso|tom yum|ramen|pho|udon|soba/i,                                    "SOUP"],
  [/wagyu|teriyaki|yakitori|donburi/i,                                     "STEAK"],
  [/pad thai|pad see ew|drunken noodle|japchae|noodle|bun bo/i,            "PASTA"],

  // Indian
  [/samosa|pakora|chaat/i,                                                 "INDIAN"],
  [/tikka|tandoor|butter chicken|murgh|chicken curry|rogan josh|vindaloo/i,"INDIAN"],
  [/palak|saag|dal|daal|lentil|paneer|sabzi|chana/i,                      "INDIAN"],
  [/biryani/i,                                                             "RICE"],
  [/naan|roti|paratha|garlic bread/i,                                      "BREAD"],
  [/jeera rice|basmati|fried rice/i,                                       "RICE"],

  // French & Fine Dining
  [/foie gras|escargot|velouté|bisque/i,                                   "FRENCH"],
  [/onion soup|bouillabaisse|vichyssoise/i,                                "SOUP"],
  [/duck|confit|magret/i,                                                  "STEAK"],
  [/bourguignon|beef stew|braised/i,                                       "STEAK"],
  [/ratatouille|provençal/i,                                               "SALAD"],

  // Mexican
  [/guacamole|avocado/i,                                                   "SALAD"],
  [/nachos|quesadilla|taco|burrito|enchilada|carnitas/i,                   "BREAD"],
  [/churro|tres leches/i,                                                  "DESSERT"],

  // Seafood & Fish
  [/oyster|shrimp|prawn|lobster|crab|ceviche|octopus|calamari|mussel|clam/i, "SEAFOOD"],
  [/fish.{0,15}chip|grilled fish|fried fish|fish fillet/i,                "SEAFOOD"],

  // Grill & BBQ
  [/steak|ribeye|sirloin|bife|ojo de bife|entrana|wagyu|churrasco/i,      "STEAK"],
  [/lamb chop|rack of lamb|lamb|pork belly|bulgogi|korean bbq/i,          "STEAK"],
  [/empanada|choripan|chorizo|sausage/i,                                   "STARTER"],
  [/provoleta|halloumi|cheese/i,                                           "BREAD"],

  // Asian sides
  [/spring roll|fresh roll/i,                                              "STARTER"],
  [/bibimbap|doenjang|kimchi|jjigae/i,                                     "KOREAN"],
  [/peking duck/i,                                                         "STEAK"],
  [/mapo tofu|tofu/i,                                                      "INDIAN"],
  [/kung pao|szechuan/i,                                                   "STEAK"],
  [/egg tart|egg roll/i,                                                   "DESSERT"],

  // Mediterranean & Greek
  [/hummus|falafel|tzatziki|tahini|mezze/i,                               "STARTER"],
  [/vine leave|spanakopita|stuffed/i,                                      "STARTER"],
  [/baklava|loukoumades/i,                                                 "DESSERT"],
  [/papaya salad|green salad/i,                                            "SALAD"],
  [/mango sticky rice|sticky rice/i,                                       "DESSERT"],

  // Vegetarian
  [/buddha bowl|grain bowl|jackfruit|beet|quinoa/i,                       "SALAD"],
  [/mushroom|truffle/i,                                                    "STARTER"],

  // Generic fallbacks (broad — keep at end)
  [/steak|ribeye|meat|beef|pork|grilled/i,                                "STEAK"],
  [/chicken|pollo|vol.au|duck/i,                                          "STEAK"],
  [/fish|seafood|shrimp|prawn|lobster/i,                                  "SEAFOOD"],
  [/soup|bisque|broth|chowder/i,                                          "SOUP"],
  [/noodle|pasta|ramen|udon|soba/i,                                       "PASTA"],
  [/rice/i,                                                               "RICE"],
  [/bread|toast|naan/i,                                                   "BREAD"],
  [/salad|greens|vegetable|veg/i,                                         "SALAD"],
  [/fries|chips|potato/i,                                                 "FRIES"],
  [/cake|tart|dessert|sweet|gelato|chocolate|pudding|mousse/i,            "DESSERT"],
];

const CATEGORY_FALLBACKS: Record<string, keyof typeof GROUPS> = {
  "starters":         "STARTER",
  "pasta":            "PASTA",
  "mains":            "STEAK",
  "sushi rolls":      "SEAFOOD",
  "nigiri & sashimi": "SEAFOOD",
  "curries":          "INDIAN",
  "breads & rice":    "BREAD",
  "entrées":          "FRENCH",
  "desserts":         "DESSERT",
  "steaks":           "STEAK",
  "sides":            "FRIES",
  "soups":            "SOUP",
  "noodles":          "PASTA",
};

export function getFoodImage(name: string, category: string, itemId: number): string {
  for (const [pattern, groupKey] of KEYWORD_MAP) {
    if (pattern.test(name)) return pick(GROUPS[groupKey], itemId);
  }
  const fallbackKey = CATEGORY_FALLBACKS[category.toLowerCase()] ?? "GENERAL";
  return pick(GROUPS[fallbackKey], itemId);
}
