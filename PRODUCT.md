# AvitoGeorgia — Product Context

**Domain archetype**: marketplace-classifieds
<!-- Enum: fintech-trust | consumer-visual | consumer-social | marketplace-classifieds | professional-tool | tool-internal -->

**Product**: Classifieds/marketplace platform for Georgia — the Avito equivalent for buying/selling goods locally. Users list items, browse, chat, and promote via paid boost.

**Domain**: General classifieds across categories (electronics, vehicles, real estate, clothing, furniture, services, etc.). Georgia-specific — GEL currency, Georgian cities, KA/RU/EN locales.

**Target users**:
- **GUEST** (primary discovery traffic): browse without account — listings, search, seller profiles. Most users start here.
- **USER** (seller + buyer): email-OTP auth. Posts listings, chats, favorites.
- **PREMIUM** (29.99 GEL/mo): unlimited listings, badge, search priority. Monetization core.
- **ADMIN**: moderation, user/category management, platform settings.

**Value proposition**: Fast local marketplace for Georgia. No account needed to browse. Post for free (limited). Pay to boost or go Premium for unlimited listings + badge.

**Emotional goal**: shift user from "where can I sell this quickly, locally" to "listed in 60 seconds, buyers in the chat".

**Visual direction**: Modern marketplace × classifieds. Refs: Avito, Facebook Marketplace, Craigslist modernized. NOT fintech trust — marketplace trust. Emphasis: speed, clarity, price visibility, categories, local-first.

**Locale**: Georgian (primary), Russian, English. Cities: Тбилиси, Батуми, Кутаиси, Рустави, Гори, Зугдиди.

**Expected content on all screens**:
- Listing categories: electronics, vehicles, real estate (rent/sale), clothing, furniture, services, jobs, events
- Prices in GEL
- Georgian cities + districts
- Chat threads between buyer-seller
- Promotion offers (boost, premium)
- Seller profiles with ratings, listings count, member-since

**FORBIDDEN content** (wrong-domain placeholder data):
- Tax/ФНС/juridical services (belongs to p2ptax)
- Dating/social categories (belongs to moto-social or others)
- Crypto/trading references
- Russian-specific categories like "Услуги НДФЛ"

**Monetization**:
- Free tier: 3 active listings, standard visibility
- Promote listing (one-time): ~5 GEL
- Premium (monthly): 29.99 GEL — unlimited listings, badge, search priority

<!-- TODO: create SA schema on diagrams.love and add: sa_schema: cm... -->
