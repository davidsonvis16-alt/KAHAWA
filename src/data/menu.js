// Images are served from Unsplash's CDN. To use your own photos, drop files in
// /public/images/menu/ and swap the `img` value for '/images/menu/<file>.jpg'.
const u = (id, w = 900) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`

export const img = u

export const categories = [
  { id: 'coffee', name: 'Hot Coffee', blurb: 'Single-origin Kenyan AA, roasted in Nairobi', img: u('1509042239860-f550ce710b93', 400) },
  { id: 'cold', name: 'Iced & Shakes', blurb: 'Cold brews, frappés and thick shakes', img: u('1461023058943-07fcbe16d735', 400) },
  { id: 'breakfast', name: 'All-Day Breakfast', blurb: 'Served from open till close', img: u('1533089860892-a7c6f0a88666', 400) },
  { id: 'burgers', name: 'Burgers', blurb: 'Smashed, stacked, on brioche', img: u('1568901346375-23c9450c58cd', 400) },
  { id: 'chicken', name: 'Chicken', blurb: 'Crispy, grilled and peri-peri', img: u('1626082927389-6cd097cdc6ec', 400) },
  { id: 'mains', name: 'Mains & Bowls', blurb: 'Curries, pasta, pizza and salads', img: u('1565557623262-b51c2513a641', 400) },
  { id: 'bakery', name: 'Bakery & Desserts', blurb: 'Baked every morning', img: u('1578985545062-69928b1d9587', 400) },
  { id: 'tea', name: 'Tea & Juices', blurb: 'Chai, dawa and fresh-pressed', img: u('1576092768241-dec231879fc3', 400) },
]

/* ---------- reusable option groups ---------- */
const coffeeSize = { id: 'size', name: 'Size', type: 'single', required: true, choices: [
  { id: 'reg', name: 'Regular · 12oz', price: 0 }, { id: 'lg', name: 'Large · 16oz', price: 70 } ] }
const milk = { id: 'milk', name: 'Milk', type: 'single', required: true, choices: [
  { id: 'whole', name: 'Whole milk', price: 0 }, { id: 'oat', name: 'Oat milk', price: 80 },
  { id: 'almond', name: 'Almond milk', price: 80 }, { id: 'lactose', name: 'Lactose-free', price: 50 } ] }
const coffeeExtras = { id: 'extras', name: 'Make it yours', type: 'multi', choices: [
  { id: 'shot', name: 'Extra espresso shot', price: 60 }, { id: 'caramel', name: 'Caramel syrup', price: 50 },
  { id: 'vanilla', name: 'Vanilla syrup', price: 50 }, { id: 'hazel', name: 'Hazelnut syrup', price: 50 },
  { id: 'cream', name: 'Whipped cream', price: 40 } ] }
const burgerExtras = { id: 'extras', name: 'Add-ons', type: 'multi', choices: [
  { id: 'cheese', name: 'Extra cheddar', price: 80 }, { id: 'bacon', name: 'Beef bacon', price: 150 },
  { id: 'egg', name: 'Fried egg', price: 60 }, { id: 'jalap', name: 'Jalapeños', price: 50 },
  { id: 'patty', name: 'Double patty', price: 290 } ] }
const sides = { id: 'side', name: 'Choose a side', type: 'single', required: true, choices: [
  { id: 'fries', name: 'Hand-cut fries', price: 0 }, { id: 'masala', name: 'Masala fries', price: 60 },
  { id: 'wedges', name: 'Potato wedges', price: 40 }, { id: 'salad', name: 'Garden salad', price: 0 },
  { id: 'ugali', name: 'Ugali & kachumbari', price: 0 } ] }
const eggs = { id: 'eggs', name: 'How do you like your eggs?', type: 'single', required: true, choices: [
  { id: 'fried', name: 'Fried', price: 0 }, { id: 'scrambled', name: 'Scrambled', price: 0 },
  { id: 'poached', name: 'Poached', price: 0 }, { id: 'omelette', name: 'Spanish omelette', price: 50 } ] }
const heat = { id: 'heat', name: 'Heat level', type: 'single', required: true, choices: [
  { id: 'mild', name: 'Mild', price: 0 }, { id: 'medium', name: 'Medium', price: 0 }, { id: 'hot', name: 'Hot', price: 0 }, { id: 'xhot', name: 'Pili-pili hot', price: 0 } ] }
const juiceSize = { id: 'size', name: 'Size', type: 'single', required: true, choices: [
  { id: 'glass', name: 'Glass', price: 0 }, { id: 'jug', name: 'Jug · serves 4', price: 450 } ] }

const coffee = [coffeeSize, milk, coffeeExtras]

export const menu = [
  /* ---------------- HOT COFFEE ---------------- */
  { id: 'cappuccino', cat: 'coffee', name: 'Cappuccino', price: 330, kcal: 140, tags: ['popular'],
    desc: 'Double ristretto of Kiambu AA under a thick cap of velvety foam, dusted with cocoa.',
    img: u('1572442388796-11668a67e53d'), options: coffee },
  { id: 'cafe-latte', cat: 'coffee', name: 'Café Latte', price: 330, kcal: 190, tags: ['popular'],
    desc: 'Smooth espresso and silky steamed milk, finished with latte art.',
    img: u('1541167760496-1628856ab772'), options: coffee },
  { id: 'americano', cat: 'coffee', name: 'Americano', price: 260, kcal: 10,
    desc: 'Two shots pulled long over hot water. Bright, clean, with a blackcurrant finish.',
    img: u('1514432324607-a09d9b4aefdd'), options: [coffeeSize, coffeeExtras] },
  { id: 'caramel-macchiato', cat: 'coffee', name: 'Caramel Macchiato', price: 390, kcal: 250, tags: ['new'],
    desc: 'Vanilla-sweetened milk marked with espresso and a lattice of house caramel.',
    img: u('1509042239860-f550ce710b93'), options: coffee },
  { id: 'mocha', cat: 'coffee', name: 'Café Mocha', price: 380, kcal: 290,
    desc: 'Espresso, dark Kenyan cocoa and steamed milk, topped with whipped cream.',
    img: u('1442512595331-e89e73853f31'), options: coffee },
  { id: 'flat-white', cat: 'coffee', name: 'Flat White', price: 340, kcal: 120,
    desc: 'A short, strong ristretto with a thin layer of microfoam. The barista favourite.',
    img: u('1511920170033-f8396924c348'), options: [milk, coffeeExtras] },
  { id: 'espresso', cat: 'coffee', name: 'Double Espresso', price: 220, kcal: 5,
    desc: 'Our signature blend, pulled for 28 seconds. Caramel body, citrus finish.',
    img: u('1517701604599-bb29b565090c') },
  { id: 'pour-over', cat: 'coffee', name: 'Nyeri Pour-Over', price: 360, kcal: 5, tags: ['new'],
    desc: 'Single-estate Nyeri peaberry, hand-poured through a V60. Notes of hibiscus and plum.',
    img: u('1497935586351-b67a49e012bf') },

  /* ---------------- ICED & SHAKES ---------------- */
  { id: 'iced-latte', cat: 'cold', name: 'Iced Latte', price: 350, kcal: 160, tags: ['popular'],
    desc: 'Espresso poured over ice and cold milk. Add a syrup to make it sing.',
    img: u('1461023058943-07fcbe16d735'), options: coffee },
  { id: 'cold-brew', cat: 'cold', name: '18-Hour Cold Brew', price: 370, kcal: 15,
    desc: 'Steeped slowly overnight for a chocolatey, low-acid cup. Served over big ice.',
    img: u('1559496417-e7f25cb247f3'), options: [coffeeSize, coffeeExtras] },
  { id: 'choc-shake', cat: 'cold', name: 'Chocolate Fudge Shake', price: 480, kcal: 620, tags: ['popular'],
    desc: 'Vanilla ice cream blended with fudge sauce and crushed brownie, crowned with cream.',
    img: u('1572490122747-3968b75cc699') },
  { id: 'berry-shake', cat: 'cold', name: 'Strawberry Shake', price: 460, kcal: 540,
    desc: 'Fresh Limuru strawberries and soft-serve, blended thick enough for a spoon.',
    img: u('1579954115545-a95591f28bfc') },
  { id: 'iced-tea', cat: 'cold', name: 'Passion Iced Tea', price: 290, kcal: 90,
    desc: 'Black tea shaken with passion fruit, lime and mint over ice.',
    img: u('1556679343-c7306c1976bc') },

  /* ---------------- BREAKFAST ---------------- */
  { id: 'big-breakfast', cat: 'breakfast', name: 'The Big Kahawa Breakfast', price: 990, kcal: 1150, tags: ['popular'],
    desc: 'Two eggs, beef sausages, beef bacon, baked beans, grilled tomato, sautéed mushrooms, toast and a coffee.',
    img: u('1533089860892-a7c6f0a88666'), options: [eggs] },
  { id: 'pancakes', cat: 'breakfast', name: 'Buttermilk Pancake Stack', price: 620, kcal: 780, tags: ['popular'],
    desc: 'Three fluffy pancakes, salted butter, berries and a jug of maple syrup.',
    img: u('1567620905732-2d1ec7ab7445'),
    options: [{ id: 'top', name: 'Toppings', type: 'multi', choices: [
      { id: 'banana', name: 'Caramelised banana', price: 80 }, { id: 'nutella', name: 'Nutella', price: 120 },
      { id: 'bacon', name: 'Crispy beef bacon', price: 150 } ] }] },
  { id: 'french-toast', cat: 'breakfast', name: 'Brioche French Toast', price: 640, kcal: 720,
    desc: 'Thick-cut brioche soaked in cinnamon custard, griddled golden, with fruit and honey.',
    img: u('1484723091739-30a097e8f929') },
  { id: 'avo-toast', cat: 'breakfast', name: 'Smashed Avo on Sourdough', price: 680, kcal: 520, tags: ['veg'],
    desc: 'Hass avocado, lime, chilli flakes and feta on toasted sourdough, with two poached eggs.',
    img: u('1525351484163-7529414344d8'), options: [eggs] },
  { id: 'pancake-classic', cat: 'breakfast', name: 'Berry Pancakes', price: 590, kcal: 690, tags: ['veg'],
    desc: 'Short stack with a warm mixed-berry compote and whipped honey butter.',
    img: u('1528207776546-365bb710ee93') },

  /* ---------------- BURGERS ---------------- */
  { id: 'classic-burger', cat: 'burgers', name: 'Classic Smash Burger', price: 890, kcal: 980, tags: ['popular'],
    desc: 'Two smashed beef patties, cheddar, pickles, onions and house sauce on toasted brioche.',
    img: u('1568901346375-23c9450c58cd'), options: [sides, burgerExtras] },
  { id: 'bbq-burger', cat: 'burgers', name: 'Smoky BBQ Bacon Burger', price: 1050, kcal: 1180,
    desc: '200g beef, beef bacon, onion rings, smoked cheddar and sticky BBQ glaze.',
    img: u('1550547660-d9450f859349'), options: [sides, burgerExtras] },
  { id: 'double-cheese', cat: 'burgers', name: 'Double Cheese Stack', price: 990, kcal: 1240, tags: ['new'],
    desc: 'Two patties, four slices of cheese, caramelised onions and mustard mayo.',
    img: u('1571091718767-18b5b1457add'), options: [sides, burgerExtras] },
  { id: 'mushroom-burger', cat: 'burgers', name: 'Mushroom Swiss Burger', price: 950, kcal: 1020,
    desc: 'Beef patty, garlic-butter mushrooms, melted Swiss and rocket.',
    img: u('1594212699903-ec8a3eca50f5'), options: [sides, burgerExtras] },

  /* ---------------- CHICKEN ---------------- */
  { id: 'crispy-bucket', cat: 'chicken', name: 'Crispy Chicken Bucket · 8pc', price: 1890, kcal: 2100, tags: ['popular'],
    desc: 'Eight pieces of buttermilk-brined chicken, double-dipped and fried to a deep crunch. Feeds 3–4.',
    img: u('1626082927389-6cd097cdc6ec'), options: [heat] },
  { id: 'crispy-3pc', cat: 'chicken', name: '3-Piece Crispy Meal', price: 790, kcal: 1050,
    desc: 'Three pieces of our signature crispy chicken with a side and coleslaw.',
    img: u('1562967914-608f82629710'), options: [heat, sides] },
  { id: 'wings', cat: 'chicken', name: 'Peri-Peri Wings · 10pc', price: 850, kcal: 880, tags: ['spicy'],
    desc: 'Flame-grilled wings tossed in our African bird\'s-eye peri-peri, with garlic dip.',
    img: u('1527477396000-e27163b481c2'), options: [heat] },
  { id: 'quarter-chicken', cat: 'chicken', name: 'Quarter Grilled Chicken', price: 780, kcal: 760,
    desc: 'Marinated overnight in lemon, garlic and herbs, grilled and served with a side.',
    img: u('1599487488170-d11ec9c172f0'), options: [sides, heat] },
  { id: 'chicken-wrap', cat: 'chicken', name: 'Crispy Chicken Wrap', price: 690, kcal: 640,
    desc: 'Crispy strips, lettuce, tomato and chipotle mayo rolled in a toasted tortilla.',
    img: u('1626700051175-6818013e1d4f'), options: [sides] },

  /* ---------------- MAINS ---------------- */
  { id: 'chicken-tikka', cat: 'mains', name: 'Chicken Tikka Masala', price: 950, kcal: 870, tags: ['popular'],
    desc: 'Tandoori chicken in a creamy tomato masala with pilau rice and garlic naan.',
    img: u('1565557623262-b51c2513a641') },
  { id: 'buddha-bowl', cat: 'mains', name: 'Garden Power Bowl', price: 760, kcal: 540, tags: ['veg'],
    desc: 'Quinoa, roast sweet potato, avocado, chickpeas and greens with tahini-lemon dressing.',
    img: u('1546069901-ba9599a7e63c') },
  { id: 'chicken-salad', cat: 'mains', name: 'Grilled Chicken Caesar', price: 820, kcal: 610,
    desc: 'Cos lettuce, grilled chicken, parmesan, croutons and house Caesar dressing.',
    img: u('1512621776951-a57141f2eefd') },
  { id: 'pasta', cat: 'mains', name: 'Creamy Chicken Penne', price: 880, kcal: 920,
    desc: 'Penne tossed with grilled chicken, mushrooms and a garlic-parmesan cream.',
    img: u('1621996346565-e3dbc646d9a9') },
  { id: 'pizza-margherita', cat: 'mains', name: 'Margherita Pizza', price: 850, kcal: 1100, tags: ['veg'],
    desc: 'Stone-baked base, San Marzano tomato, fior di latte and fresh basil.',
    img: u('1565299624946-b28f40a0ae38') },
  { id: 'pizza-pepperoni', cat: 'mains', name: 'Beef Pepperoni Pizza', price: 990, kcal: 1320,
    desc: 'Loaded with spicy beef pepperoni, mozzarella and a drizzle of hot honey.',
    img: u('1513104890138-7c749659a591') },
  { id: 'steak', cat: 'mains', name: 'Pepper Steak & Chips', price: 1450, kcal: 1100, tags: ['new'],
    desc: '250g sirloin, grilled to order, with peppercorn sauce and hand-cut chips.',
    img: u('1600891964092-4316c288032e'),
    options: [{ id: 'cook', name: 'Cooked', type: 'single', required: true, choices: [
      { id: 'mr', name: 'Medium rare', price: 0 }, { id: 'm', name: 'Medium', price: 0 }, { id: 'wd', name: 'Well done', price: 0 } ] }] },
  { id: 'fries', cat: 'mains', name: 'Loaded Masala Fries', price: 420, kcal: 640, tags: ['spicy', 'veg'],
    desc: 'Hand-cut fries tossed in a tangy tomato-chilli masala with coriander.',
    img: u('1573080496219-bb080dd4f877') },

  /* ---------------- BAKERY & DESSERTS ---------------- */
  { id: 'fudge-cake', cat: 'bakery', name: 'Chocolate Fudge Cake', price: 450, kcal: 590, tags: ['popular'],
    desc: 'Three layers of dark chocolate sponge with fudge frosting. Served warm on request.',
    img: u('1578985545062-69928b1d9587') },
  { id: 'cheesecake', cat: 'bakery', name: 'Berry Cheesecake', price: 480, kcal: 520,
    desc: 'Baked vanilla cheesecake on a digestive base with a mixed-berry glaze.',
    img: u('1565958011703-44f9829ba187') },
  { id: 'croissant', cat: 'bakery', name: 'Butter Croissant', price: 240, kcal: 290, tags: ['veg'],
    desc: 'Laminated over three days with Kenyan cultured butter. Shatters properly.',
    img: u('1555507036-ab1f4038808a') },
  { id: 'donuts', cat: 'bakery', name: 'Glazed Doughnuts · 3pc', price: 350, kcal: 690,
    desc: 'Soft brioche doughnuts with vanilla, chocolate and strawberry glazes.',
    img: u('1551024601-bec78aea704b') },
  { id: 'sourdough', cat: 'bakery', name: 'Sourdough Loaf', price: 520, kcal: 1800, tags: ['veg'],
    desc: 'Our 36-hour country loaf. Crackly crust, open crumb. Take one home.',
    img: u('1509440159596-0249088772ff') },

  /* ---------------- TEA & JUICES ---------------- */
  { id: 'masala-chai', cat: 'tea', name: 'Masala Chai', price: 220, kcal: 150, tags: ['popular'],
    desc: 'Kericho black tea simmered with milk, ginger, cardamom and cinnamon.',
    img: u('1576092768241-dec231879fc3'), options: [coffeeSize, milk] },
  { id: 'dawa', cat: 'tea', name: 'Dawa', price: 280, kcal: 90,
    desc: 'Hot water, fresh ginger, lemon and honey. The Nairobi cure-all.',
    img: u('1544145945-f90425340c7e') },
  { id: 'orange-juice', cat: 'tea', name: 'Fresh Orange Juice', price: 330, kcal: 120,
    desc: 'Pressed to order from Makueni oranges. Nothing added.',
    img: u('1600271886742-f049cd451bba'), options: [juiceSize] },
]

export const byId = Object.fromEntries(menu.map((m) => [m.id, m]))

export const combos = [
  { id: 'combo-morning', name: 'Morning Ritual', save: 150, items: ['cappuccino', 'croissant'],
    note: 'Any regular coffee + a butter croissant, till 11am', img: u('1495474472287-4d71bcdd2085') },
  { id: 'combo-burger', name: 'Smash Meal Deal', save: 200, items: ['classic-burger', 'choc-shake'],
    note: 'Classic smash burger, fries and a thick shake', img: u('1550547660-d9450f859349') },
  { id: 'combo-family', name: 'Family Feast', save: 450, items: ['crispy-bucket', 'fries', 'orange-juice'],
    note: '8pc bucket, loaded fries and a jug of OJ', img: u('1562967914-608f82629710') },
]

export const locations = [
  { id: 'westlands', name: 'Westlands', addr: 'The Mall, Waiyaki Way, Nairobi', hours: '6:30am – 11pm', phone: '+254 700 100 201' },
  { id: 'kilimani', name: 'Kilimani', addr: 'Argwings Kodhek Rd, Nairobi', hours: '6:30am – 10pm', phone: '+254 700 100 202' },
  { id: 'cbd', name: 'Kimathi St · CBD', addr: 'Kimathi Street, Nairobi CBD', hours: '6am – 9pm', phone: '+254 700 100 203' },
  { id: 'karen', name: 'Karen', addr: 'Karen Hub, Karen Rd, Nairobi', hours: '7am – 10pm', phone: '+254 700 100 204' },
  { id: 'mombasa', name: 'Nyali', addr: 'City Mall, Links Rd, Mombasa', hours: '7am – 11pm', phone: '+254 700 100 205' },
]

export const heroImages = {
  main: u('1509042239860-f550ce710b93', 1400),
  burger: u('1568901346375-23c9450c58cd', 700),
  chicken: u('1626082927389-6cd097cdc6ec', 700),
  pancakes: u('1567620905732-2d1ec7ab7445', 700),
  interior: u('1554118811-1e0d58224f24', 1600),
  interior2: u('1501339847302-ac426a4a7cbb', 1200),
  beans: u('1447933601403-0c6688de566e', 1400),
  beans2: u('1559056199-641a0ac8b55e', 1200),
}
