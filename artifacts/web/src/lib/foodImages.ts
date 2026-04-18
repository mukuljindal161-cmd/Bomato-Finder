const BASE = "https://images.unsplash.com";

// All photo IDs verified 200 OK
const P = {
  STEAK:    `${BASE}/photo-1544025162-d76694265947?w=120&h=120&fit=crop&q=80`,
  NOODLES:  `${BASE}/photo-1569050467447-ce54b3bbc37d?w=120&h=120&fit=crop&q=80`,
  INDIAN:   `${BASE}/photo-1585937421612-70a008356fbe?w=120&h=120&fit=crop&q=80`,
  SAMOSA:   `${BASE}/photo-1601050690597-df0568f70950?w=120&h=120&fit=crop&q=80`,
  BIRYANI:  `${BASE}/photo-1589302168068-964664d93dc0?w=120&h=120&fit=crop&q=80`,
  BREAD:    `${BASE}/photo-1615361200141-f45040f367be?w=120&h=120&fit=crop&q=80`,
  DESSERT:  `${BASE}/photo-1547592180-85f173990554?w=120&h=120&fit=crop&q=80`,
  SALAD:    `${BASE}/photo-1512621776951-a57141f2eefd?w=120&h=120&fit=crop&q=80`,
  SOUP:     `${BASE}/photo-1547592166-23ac45744acd?w=120&h=120&fit=crop&q=80`,
  SEAFOOD:  `${BASE}/photo-1485921325833-c519f76c4927?w=120&h=120&fit=crop&q=80`,
  FRENCH:   `${BASE}/photo-1550966871-3ed3cdb5ed0c?w=120&h=120&fit=crop&q=80`,
  KOREAN:   `${BASE}/photo-1553163147-622ab57be1c7?w=120&h=120&fit=crop&q=80`,
  AVOCADO:  `${BASE}/photo-1546069901-ba9599a7e63c?w=120&h=120&fit=crop&q=80`,
  MUSHROOM: `${BASE}/photo-1572802419224-296b0aeee0d9?w=120&h=120&fit=crop&q=80`,
  FRIES:    `${BASE}/photo-1604908176997-125f25cc6f3d?w=120&h=120&fit=crop&q=80`,
  BURGER:   `${BASE}/photo-1568901346375-23c9450c58cd?w=120&h=120&fit=crop&q=80`,
  MEAT:     `${BASE}/photo-1546833999-b9f581a1996d?w=120&h=120&fit=crop&q=80`,
  MANGO:    `${BASE}/photo-1557800636-894a64c1696f?w=120&h=120&fit=crop&q=80`,
  CAKE:     `${BASE}/photo-1551024601-bec78aea704b?w=120&h=120&fit=crop&q=80`,
  GENERAL:  `${BASE}/photo-1553621042-f6e147245754?w=120&h=120&fit=crop&q=80`,
};

const KEYWORD_MAP: [RegExp, string][] = [
  // Italian
  [/bruschetta/i,                                       P.AVOCADO],
  [/arancini|risotto/i,                                 P.GENERAL],
  [/carpaccio/i,                                        P.MEAT],
  [/tagliatelle|pappardelle|ragu|pasta|cacio|spaghetti|fettuccine|linguine/i, P.NOODLES],
  [/branzino|sea bass/i,                                P.SEAFOOD],
  [/osso buco|veal|braised/i,                           P.MEAT],
  [/tiramisu/i,                                         P.DESSERT],
  [/panna cotta/i,                                      P.CAKE],
  [/pollo|chicken/i,                                    P.MEAT],

  // Japanese
  [/sushi|nigiri|roll|sashimi/i,                        P.SEAFOOD],
  [/gyoza|dumpling|mandu|wonton|dim sum|bao/i,          P.GENERAL],
  [/edamame/i,                                          P.SALAD],
  [/miso/i,                                             P.SOUP],
  [/wagyu|donburi/i,                                    P.STEAK],
  [/teriyaki/i,                                         P.MEAT],

  // Indian
  [/samosa/i,                                           P.SAMOSA],
  [/tikka|tandoor|butter chicken|murgh/i,               P.INDIAN],
  [/rogan josh|lamb curry/i,                            P.INDIAN],
  [/palak|saag|dal|daal|lentil|paneer/i,                P.INDIAN],
  [/biryani/i,                                          P.BIRYANI],
  [/naan|roti|paratha|garlic bread/i,                   P.BREAD],
  [/jeera rice|basmati|fried rice/i,                    P.BIRYANI],

  // French
  [/foie gras|escargot/i,                               P.FRENCH],
  [/onion soup/i,                                       P.SOUP],
  [/duck/i,                                             P.MEAT],
  [/bourguignon|beef stew/i,                            P.STEAK],
  [/salmon/i,                                           P.SEAFOOD],
  [/creme brulee|crème brûlée/i,                        P.CAKE],
  [/profiterole|eclair|tarte|pastry/i,                  P.DESSERT],
  [/ratatouille/i,                                      P.SALAD],

  // Mexican
  [/guacamole|avocado/i,                                P.AVOCADO],
  [/nachos|quesadilla|taco|burrito|enchilada|carnitas/i, P.BURGER],
  [/churro/i,                                           P.DESSERT],
  [/tres leche/i,                                       P.CAKE],

  // Seafood
  [/oyster|shrimp|prawn|lobster|crab|ceviche/i,         P.SEAFOOD],
  [/fish.{0,15}chip|fried fish/i,                       P.SEAFOOD],
  [/tuna/i,                                             P.SEAFOOD],

  // Chinese
  [/peking duck/i,                                      P.MEAT],
  [/spring roll/i,                                      P.GENERAL],
  [/mapo tofu|tofu/i,                                   P.INDIAN],
  [/kung pao/i,                                         P.MEAT],
  [/egg tart/i,                                         P.CAKE],

  // Mediterranean & Greek
  [/hummus|falafel|vine leave|mezze|spanakopita/i,      P.SALAD],
  [/octopus|calamari/i,                                 P.SEAFOOD],
  [/halloumi/i,                                         P.BREAD],
  [/lamb chop|rack of lamb/i,                           P.STEAK],
  [/baklava|loukoumades/i,                              P.DESSERT],

  // Korean
  [/japchae/i,                                          P.NOODLES],
  [/bibimbap/i,                                         P.KOREAN],
  [/korean bbq|pork belly|bulgogi/i,                    P.STEAK],
  [/doenjang|jjigae|kimchi/i,                           P.KOREAN],
  [/bingsu/i,                                           P.CAKE],

  // Vegan / Garden
  [/avocado toast|tartine/i,                            P.AVOCADO],
  [/beet|buddha bowl|jackfruit|grain bowl/i,            P.SALAD],
  [/cashew cheesecake/i,                                P.CAKE],

  // Argentine
  [/empanada/i,                                         P.SAMOSA],
  [/provoleta/i,                                        P.BREAD],
  [/choripan|chorizo/i,                                 P.BURGER],
  [/bife|sirloin|ojo de bife|entrana/i,                 P.STEAK],
  [/chimichurri fries|fries|chips|potato/i,             P.FRIES],
  [/grilled veg/i,                                      P.SALAD],

  // Thai / Vietnamese
  [/tom yum/i,                                          P.SOUP],
  [/pho|bun bo/i,                                       P.NOODLES],
  [/fresh spring roll/i,                                P.GENERAL],
  [/papaya salad/i,                                     P.SALAD],
  [/pad thai|drunken noodle|pad see ew/i,               P.NOODLES],
  [/mango sticky rice/i,                                P.MANGO],

  // Generic fallbacks (broad — keep at end)
  [/steak|ribeye|wagyu|prime|sirloin/i,                 P.STEAK],
  [/lamb|mutton/i,                                      P.STEAK],
  [/beef|pork|meat/i,                                   P.MEAT],
  [/seafood|fish|salmon|tuna|shrimp|prawn/i,            P.SEAFOOD],
  [/soup|bisque|broth/i,                                P.SOUP],
  [/noodle|ramen|udon|soba/i,                           P.NOODLES],
  [/rice/i,                                             P.BIRYANI],
  [/bread|naan|toast/i,                                 P.BREAD],
  [/salad|greens|vegetable/i,                           P.SALAD],
  [/mushroom|truffle/i,                                 P.MUSHROOM],
  [/cake|tart|dessert|sweet|gelato|ice cream|chocolate|pudding/i, P.DESSERT],
  [/fries|chips|potato/i,                               P.FRIES],
  [/burger/i,                                           P.BURGER],
];

const CATEGORY_FALLBACKS: Record<string, string> = {
  "starters":         P.AVOCADO,
  "pasta":            P.NOODLES,
  "mains":            P.MEAT,
  "sushi rolls":      P.SEAFOOD,
  "nigiri & sashimi": P.SEAFOOD,
  "curries":          P.INDIAN,
  "breads & rice":    P.BREAD,
  "entrées":          P.FRENCH,
  "desserts":         P.DESSERT,
  "steaks":           P.STEAK,
  "sides":            P.FRIES,
  "soups":            P.SOUP,
  "noodles":          P.NOODLES,
};

export function getFoodImage(name: string, category: string): string {
  for (const [pattern, url] of KEYWORD_MAP) {
    if (pattern.test(name)) return url;
  }
  return CATEGORY_FALLBACKS[category.toLowerCase()] ?? P.GENERAL;
}
