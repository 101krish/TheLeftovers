import { Recipe } from '../types';

export const SAMPLE_RECIPES: Recipe[] = [
  {
    id: 'rustic-frittata',
    title: 'Rustic Vegetable Frittata',
    tagline: 'A light yet hearty morning staple, utilizing seasonal greens and farm-fresh eggs for a tactile breakfast experience.',
    prepTime: '20 min',
    tags: ['Vegetarian', '20 min'],
    servings: 2,
    imageUrl: 'https://images.unsplash.com/photo-1584365685547-9a5fb6f3a70c?q=80&w=1200&auto=format&fit=crop',
    imageAlt: 'A professional food photography shot of a vibrant, golden-brown vegetable frittata in a seasoned cast iron skillet.',
    ingredients: [
      { id: 'ing-1', name: 'Large organic eggs', amount: 6, unit: '', category: 'protein' },
      { id: 'ing-2', name: 'Baby spinach leaves', amount: 100, unit: 'g', category: 'produce' },
      { id: 'ing-3', name: 'Feta cheese, crumbled', amount: 50, unit: 'g', category: 'dairy' },
      { id: 'ing-4', name: 'Small red onion, sliced', amount: 1, unit: '', category: 'produce' },
      { id: 'ing-5', name: 'Smoked paprika', amount: 0.25, unit: 'tsp', category: 'spices' },
    ],
    missingIngredients: [
      'Extra virgin olive oil',
      'Sea salt & black pepper'
    ],
    steps: [
      {
        id: 'step-1',
        number: 1,
        title: 'PREPARATION',
        description: 'Preheat your oven broiler to high. In a medium-sized bowl, whisk together the organic eggs with smoked paprika, salt, and freshly cracked black pepper until airy and pale yellow.',
        timerMinutes: 2
      },
      {
        id: 'step-2',
        number: 2,
        title: 'SAUTÉING',
        description: 'Heat a drizzle of olive oil in a 10-inch oven-proof cast iron skillet over medium-high heat. Add the sliced red onion and sauté for 4-5 minutes until softened and beginning to caramelize.',
        timerMinutes: 5
      },
      {
        id: 'step-3',
        number: 3,
        title: 'WILTING GREENS',
        description: 'Add the baby spinach to the skillet. Cook for 1-2 minutes, stirring frequently, until the leaves are just wilted. Spread the mixture evenly across the base of the pan.',
        timerMinutes: 2
      },
      {
        id: 'step-4',
        number: 4,
        title: 'SETTING & FINISHING',
        description: 'Pour the egg mixture into the pan. Let sit undisturbed for 2 minutes to set the bottom. Sprinkle the crumbled feta over the top and transfer to the broiler for 3-5 minutes until the top is puffed and golden.',
        timerMinutes: 4
      }
    ],
    chefNote: {
      text: 'Frittatas are exceptionally forgiving. If you have leftover roasted potatoes or stray mushrooms in your crisper, toss them in at step 02. The key is to avoid overcooking under the broiler—pull it out while the center still has a slight jiggle.',
      authorName: 'Chef Antoine',
      authorTitle: 'Culinary Editor',
      avatarUrl: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?q=80&w=200&auto=format&fit=crop'
    }
  },
  {
    id: 'chickpea-stew',
    title: 'Spiced Moroccan Chickpea Stew',
    tagline: 'A fragrant, single-pot pantry miracle layered with warm cumin, coriander, wilted greens, and lemon juice.',
    prepTime: '25 min',
    tags: ['Vegan', 'Gluten-Free', '25 min'],
    servings: 2,
    imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=1200&auto=format&fit=crop',
    imageAlt: 'A bowl of rich, rustic spiced chickpea stew topped with cilantro and lemon wedges.',
    ingredients: [
      { id: 'ing-11', name: 'Chickpeas, rinsed & drained', amount: 400, unit: 'g', category: 'pantry' },
      { id: 'ing-12', name: 'Crushed tomatoes', amount: 200, unit: 'g', category: 'pantry' },
      { id: 'ing-13', name: 'Garlic cloves, minced', amount: 3, unit: 'cloves', category: 'produce' },
      { id: 'ing-14', name: 'Ground cumin & coriander', amount: 1, unit: 'tsp', category: 'spices' },
      { id: 'ing-15', name: 'Chopped kale or spinach', amount: 80, unit: 'g', category: 'produce' }
    ],
    missingIngredients: [
      'Olive oil & vegetable stock',
      'Fresh lemon juice'
    ],
    steps: [
      {
        id: 'c-step-1',
        number: 1,
        title: 'AROMATICS',
        description: 'In a deep heavy skillet, warm olive oil over medium heat. Sauté minced garlic, cumin, and coriander for 1 minute until fragrant.',
        timerMinutes: 1
      },
      {
        id: 'c-step-2',
        number: 2,
        title: 'SIMMERING',
        description: 'Add crushed tomatoes, rinsed chickpeas, and 1/2 cup vegetable stock or water. Cover and simmer for 12 minutes to meld flavors.',
        timerMinutes: 12
      },
      {
        id: 'c-step-3',
        number: 3,
        title: 'FINISHING',
        description: 'Stir in chopped kale until wilted, about 2 minutes. Squeeze fresh lemon juice over the top before serving hot.',
        timerMinutes: 2
      }
    ],
    chefNote: {
      text: 'Serve alongside crusty sourdough or flatbread. For extra body, mash a third of the chickpeas against the side of the pot while simmering.',
      authorName: 'Chef Elena',
      authorTitle: 'Pantry Specialist',
      avatarUrl: 'https://images.unsplash.com/photo-1583394293214-28ded15ee548?q=80&w=200&auto=format&fit=crop'
    }
  },
  {
    id: 'crispy-rice-skillet',
    title: 'Crispy Garlic Rice & Fried Egg Skillet',
    tagline: 'Transform day-old leftover rice into golden, nutty, crispy perfection topped with a lacy-edged sunny egg.',
    prepTime: '15 min',
    tags: ['Quick', '15 min', 'Budget'],
    servings: 2,
    imageUrl: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?q=80&w=1200&auto=format&fit=crop',
    imageAlt: 'Crispy fried rice skillet topped with runny egg yolks and sliced scallions.',
    ingredients: [
      { id: 'ing-21', name: 'Cold leftover cooked rice', amount: 300, unit: 'g', category: 'pantry' },
      { id: 'ing-22', name: 'Farm-fresh eggs', amount: 2, unit: '', category: 'protein' },
      { id: 'ing-23', name: 'Garlic cloves, thinly sliced', amount: 4, unit: 'cloves', category: 'produce' },
      { id: 'ing-24', name: 'Green onions, scallions', amount: 3, unit: 'stalks', category: 'produce' },
      { id: 'ing-25', name: 'Soy sauce or tamari', amount: 1.5, unit: 'tbsp', category: 'pantry' }
    ],
    missingIngredients: [
      'Neutral cooking oil or sesame oil',
      'Chili flakes or sriracha'
    ],
    steps: [
      {
        id: 'r-step-1',
        number: 1,
        title: 'CRISPY GARLIC',
        description: 'In a hot skillet, sizzle sliced garlic in oil until pale golden and crisp. Remove half for garnish.',
        timerMinutes: 2
      },
      {
        id: 'r-step-2',
        number: 2,
        title: 'RICE CRUNCH',
        description: 'Press leftover cold rice flat into the hot skillet. Let it sear untouched for 4 minutes until a crispy crust forms on the bottom.',
        timerMinutes: 4
      },
      {
        id: 'r-step-3',
        number: 3,
        title: 'SUNNY EGGS',
        description: 'Push rice to the side or fry 2 eggs separately in hot oil until edges are dark crispy and yolks stay runny.',
        timerMinutes: 3
      }
    ],
    chefNote: {
      text: 'Using cold, slightly dried leftover rice from the fridge is essential here. Fresh hot rice retains too much moisture to get properly crisp.',
      authorName: 'Chef Marcus',
      authorTitle: 'Kitchen Innovator',
      avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=200&auto=format&fit=crop'
    }
  }
];

export const COMMON_SUBSTITUTIONS: Record<string, string[]> = {
  'feta cheese': ['Goat cheese', 'Crumbled cotija', 'Nutritional yeast', 'Ricotta'],
  'baby spinach': ['Torn kale', 'Swiss chard', 'Arugula', 'Frozen spinach (thawed)'],
  'red onion': ['Yellow onion', 'Shallots', 'Green onion stalks', 'Leeks'],
  'chickpeas': ['White navy beans', 'Cannellini beans', 'Lentils', 'Black beans'],
  'eggs': ['Silken tofu scramble', 'Chickpea flour slurry', 'Just Egg substitute'],
  'kale': ['Spinach', 'Bok choy', 'Collard greens', 'Cabbage'],
  'tomatoes': ['Tomato paste + water', 'Roasted red peppers', 'Tomatillos']
};
