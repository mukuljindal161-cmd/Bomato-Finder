const CUISINE_FALLBACKS: Record<string, string> = {
  italian:       "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&q=80",
  mediterranean: "https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?w=1200&q=80",
  greek:         "https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?w=1200&q=80",
  japanese:      "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=1200&q=80",
  sushi:         "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=1200&q=80",
  indian:        "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=1200&q=80",
  curry:         "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=1200&q=80",
  french:        "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=80",
  european:      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=80",
  mexican:       "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=1200&q=80",
  "tex-mex":     "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=1200&q=80",
  seafood:       "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=1200&q=80",
  american:      "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=1200&q=80",
  chinese:       "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=1200&q=80",
  "dim sum":     "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=1200&q=80",
  korean:        "https://images.unsplash.com/photo-1498654896293-37aacf113fd9?w=1200&q=80",
  bbq:           "https://images.unsplash.com/photo-1544025162-d76694265947?w=1200&q=80",
  vegetarian:    "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=1200&q=80",
  vegan:         "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=1200&q=80",
  organic:       "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=1200&q=80",
  steakhouse:    "https://images.unsplash.com/photo-1544025162-d76694265947?w=1200&q=80",
  argentine:     "https://images.unsplash.com/photo-1544025162-d76694265947?w=1200&q=80",
  thai:          "https://images.unsplash.com/photo-1617093727343-374698b1b08d?w=1200&q=80",
  vietnamese:    "https://images.unsplash.com/photo-1617093727343-374698b1b08d?w=1200&q=80",
  noodles:       "https://images.unsplash.com/photo-1617093727343-374698b1b08d?w=1200&q=80",
};

const DEFAULT_FALLBACK =
  "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=80";

export function getCuisineFallback(cuisines: string[]): string {
  for (const cuisine of cuisines) {
    const key = cuisine.toLowerCase();
    if (CUISINE_FALLBACKS[key]) return CUISINE_FALLBACKS[key];
  }
  return DEFAULT_FALLBACK;
}
