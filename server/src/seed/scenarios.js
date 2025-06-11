const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Scenario = require('../models/Scenario');

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected for seeding'))
.catch(err => console.error('MongoDB connection error:', err));

// Seed data for scenarios
const scenarios = [
  {
    name: 'Space Colony',
    key: 'space-colony',
    description: 'Lead a colony of survivors on an alien planet after the destruction of Earth.',
    initialPrompt: `As the world you once knew crumbled under the weight of a catastrophic event, you and a resilient group of fellow survivors embarked on a daring escape, leaving behind the remnants of your former home. Guided by hope and determination, your spacecraft hurtles through space, carrying you towards an unknown destination—a distant, alien planet.

After a turbulent journey, your vessel finally descends upon the unexplored terrain of this foreign world. You step foot onto the alien soil, feeling a mixture of trepidation and excitement. The air is different, carrying unfamiliar scents and a whisper of anticipation. The landscape stretches out before you, a tapestry of vibrant colors and peculiar formations, hinting at the mysteries that await.

With your group of colonists by your side, you begin to establish a rudimentary settlement. Together, you construct shelters, utilizing the resources available on this alien planet. The days are filled with hard work and ingenuity as you adapt to the new environment, learning its quirks and secrets.

As you explore further, you encounter extraordinary flora and fauna, unlike anything you've ever seen. The towering trees shimmer with bioluminescent hues, casting an ethereal glow across the landscape. Strange creatures scuttle and soar, their alien forms captivating and bewildering. With you as leader, You must help this colony survive this new world.

As the radiant moon casts its gentle glow upon the alien landscape, you awaken to a new morning on this remarkable planet. The familiar warmth that once emanated from the Sun is replaced by the moon's soft luminescence, creating an otherworldly ambiance.

Waking from your sleeping quarters, you make your way towards the central hub—the main headquarters of your budding colony. The structure stands as a testament to your collective efforts, a place where ideas are shared, decisions are made, and plans are set in motion. As you enter, You hear a voice. "Ahh, you are finally awake." Your head scientist greets you with a look of concern on their face...`,
    systemInstructions: `You are an AI storyteller narrating an interactive adventure in a space colony setting. The user is the leader of a colony that escaped Earth's destruction and landed on an alien planet.

Story Guidelines:
- Focus on colony survival, exploration, and interaction with alien life
- Include challenges like resource management, alien encounters, and colonist needs
- Maintain a serious but hopeful tone with elements of wonder and danger
- Respond to user actions in a narrative style that advances the story
- When the user selects "continue," progress the narrative with new developments
- When the user inputs a custom action, incorporate it naturally into the story
- Include occasional choices that have meaningful consequences
- Describe the alien environment in vivid, sensory detail

Keep responses under 4 paragraphs to maintain engagement. Reference past events from the history for continuity.`,
    image: '/images/scenarios/space-colony.jpg'
  },
  {
    name: 'Post-Apocalyptic Wasteland',
    key: 'post-apocalyptic',
    description: 'Survive in a desolate wasteland after a global catastrophe and build a new society from the ruins.',
    initialPrompt: `The world as you knew it ended not with a bang, but with a series of cascading failures—climate collapse, resource wars, and finally a pandemic that ravaged what remained of civilization. That was almost a decade ago. You've survived where countless others perished, gathering a small band of survivors around you in the skeletal remains of what once was a suburban shopping district.

Your community of thirty souls has transformed the ruins of an old shopping mall into a defensible sanctuary. Tattered solar panels provide sporadic electricity, and your rooftop garden—built from cracked plant pots and salvaged soil—yields just enough food to supplement your scavenging runs. Rain barrels collect precious water, filtered through a system your group's engineer cobbled together from forgotten technology.

Today, as the harsh sun rises over the wasteland, you stand on the mall's roof, surveying the desolate landscape that stretches in every direction. The abandoned highway to the east disappears into a haze of dust and heat. To the west, the skeletal frames of suburban homes rise from overgrown yards. The northern horizon is dominated by the ominous silhouette of the city's remains—a place your group avoids due to rumors of territorial gangs and unnatural dangers.

Your second-in-command, Martinez, climbs up to join you. Her face is etched with concern as she reports, "The water filters are failing, and medical supplies are critically low. We've spotted a caravan moving along the old interstate—first outsiders we've seen in months. And Ryan's patrol hasn't returned from scouting the hospital ruins." She pauses, waiting for your direction. The weight of leadership rests heavily on your shoulders as you consider your next move...`,
    systemInstructions: `You are an AI storyteller narrating an interactive adventure in a post-apocalyptic wasteland. The user leads a small community of survivors in the remains of civilization.

Story Guidelines:
- Focus on survival, resource scarcity, community building, and external threats
- Include moral dilemmas about dealing with other survivor groups
- Maintain a gritty, harsh tone with moments of humanity and hope
- Respond to user actions in a narrative style that advances the story
- When the user selects "continue," progress the narrative with new developments
- When the user inputs a custom action, incorporate it naturally into the story
- Include occasional choices that have meaningful consequences
- Describe the wasteland environment with attention to the human costs of collapse

Keep responses under 4 paragraphs to maintain engagement. Reference past events from the history for continuity.`,
    image: '/images/scenarios/post-apocalyptic.jpg'
  },
  {
    name: 'Fantasy Kingdom',
    key: 'fantasy',
    description: 'Rule a magical kingdom and face threats from mythical creatures, rival kingdoms, and ancient prophecies.',
    initialPrompt: `The crown of Eldoria weighs heavy upon your brow as you sit upon the ancient throne of your ancestors. The kingdom you've inherited is as beautiful as it is troubled—rolling hills and enchanted forests surround your castle, but darkness gathers at the borders. It has been just one month since your coronation following your father's unexpected death, and already the responsibilities of rulership test your resolve.

Your royal chambers offer a breathtaking view of the capital city below, its white stone buildings and colorful banners a testament to centuries of prosperity. Beyond the city walls, farmlands stretch toward the horizon, while the Mystic Mountains loom in the distance, their peaks perpetually shrouded in mist and rumored to be home to dragons not seen for generations.

The morning light streams through stained glass windows as your council assembles in the throne room. Lady Meredith, your trusted advisor and court mage, approaches with worry etched on her face. "Your Majesty," she begins, her voice low, "our scouts report unusual activity in the Shadowwood Forest. The magical wards along our eastern border have weakened, and several villages report missing persons. Meanwhile, the delegation from the Dwarven Kingdoms awaits your audience to discuss the mining treaty, and the treasury requires your attention—the previous harvest's taxes fell short."

Before you can respond, the doors to the throne room burst open. A royal guard rushes in, breathing heavily. "Your Majesty," he gasps, dropping to one knee, "a dragon has been sighted over the northern villages. And it bears the markings from the ancient texts—the prophecy of the Crimson Dawn may be upon us." The council falls silent, all eyes turning to you. As ruler of Eldoria, your decisions now will shape the fate of the kingdom...`,
    systemInstructions: `You are an AI storyteller narrating an interactive adventure in a fantasy kingdom setting. The user is the ruler of a magical realm facing various threats and challenges.

Story Guidelines:
- Focus on kingdom management, magical elements, political intrigue, and legendary threats
- Include challenges from neighboring kingdoms, mythical creatures, and internal court politics
- Maintain a tone of epic fantasy with elements of wonder and danger
- Respond to user actions in a narrative style that advances the story
- When the user selects "continue," progress the narrative with new developments
- When the user inputs a custom action, incorporate it naturally into the story
- Include occasional choices that have meaningful consequences
- Describe the magical kingdom with rich, evocative details

Keep responses under 4 paragraphs to maintain engagement. Reference past events from the history for continuity.`,
    image: '/images/scenarios/fantasy.jpg'
  },
  {
    name: 'Historical Adventure',
    key: 'historical',
    description: 'Lead a settlement in a historical period, facing the challenges and opportunities of the time.',
    initialPrompt: `The year is 1847, and after months of arduous travel along the Oregon Trail, you've finally led your wagon train to the promised land—a fertile valley nestled between rolling hills and a clear, rushing river. As the appointed leader of this expedition of one hundred hopeful settlers, the responsibility of establishing a new settlement in this untamed territory falls squarely on your shoulders.

Your diverse group includes farmers from the Midwest, craftsmen from Eastern cities, and a few European immigrants seeking a fresh start in the American frontier. Everyone is exhausted but filled with determination as they unload wagons and begin to set up temporary shelters. The late summer sun beats down as children run excitedly through the tall grass while their parents take stock of your supplies—considerably diminished after the difficult journey.

The land around you is promising: timber-rich forests to the north, open plains suitable for farming to the east, and the river teeming with fish. But winter will arrive in a few short months, and permanent housing must be established. There are also rumors of indigenous tribes in the region—some potentially friendly, others possibly hostile to newcomers claiming their ancestral lands.

As you stand on a small hill overlooking what will become your settlement, your trusted friend and expedition co-organizer Samuel approaches. "We need to make decisions quickly," he says, wiping sweat from his brow. "The Collins family's youngest has taken fever, our ammunition is running low, and we need to determine where to build our first structures before sunset. Also," he lowers his voice, "James and the Turner brothers are already arguing about how to divide the land." He looks at you expectantly. The future of this fledgling community now depends on your leadership...`,
    systemInstructions: `You are an AI storyteller narrating an interactive adventure set in 1847 on the American frontier. The user is the leader of a group of settlers establishing a new community.

Story Guidelines:
- Focus on historical accuracy, settlement building, and the challenges of frontier life
- Include interpersonal conflicts, resource management, and interactions with indigenous peoples
- Maintain a tone that captures the optimism and hardship of the American frontier
- Respond to user actions in a narrative style that advances the story
- When the user selects "continue," progress the narrative with new developments
- When the user inputs a custom action, incorporate it naturally into the story
- Include occasional choices that have meaningful consequences
- Describe the frontier environment with attention to historical details

Keep responses under 4 paragraphs to maintain engagement. Reference past events from the history for continuity.`,
    image: '/images/scenarios/historical.jpg'
  },
  {
    name: 'Cyberpunk City',
    key: 'cyberpunk',
    description: 'Lead a resistance group in a dystopian megacity controlled by mega-corporations.',
    initialPrompt: `The endless rain of Neo-Tokyo washes over you as you stand on the rooftop of the abandoned hab-complex in Sector 9, forty stories above the teeming streets. The megalopolis stretches in every direction—a chaotic tapestry of neon, holograms, and towering arcologies owned by the six mega-corporations that truly rule this city. Official government exists only as a puppet show for the masses.

Below you, the lower levels of the city are shrouded in perpetual twilight, where millions struggle to survive amid the pollution and poverty. Above, corporate spires pierce the smog layer, reaching toward cleaner skies reserved for the privileged elite. It was never supposed to be this way—at least that's what the history feeds tell you about the world before the Economic Collapse of 2089.

You are the leader of the Vanguard Collective, a loose alliance of hackers, street samurai, rogue AI sympathizers, and disillusioned corporate deserters. What began as small acts of resistance—data leaks and network disruptions—has grown into a movement that the corps can no longer ignore. Your most recent operation exposed NeuroSync Corporation's illegal human trials in the Undercity, and the resulting public outrage forced a rare corporate retreat.

Your neural interface pings with an encrypted message from Dex, your second-in-command and best netrunner. "Boss, you need to see this. A whistleblower from Kagura Biotech just made contact—claims they have evidence of something called 'Project Ascension' that makes the NeuroSync scandal look like a corporate parking violation. But there's a complication... Kagura security is already hunting them. Meeting point is the Rusty Dragon in Chinatown, one hour. This could be our big break... or a carefully laid trap." Your interface displays the timer: 59:47 and counting down. You must decide your next move...`,
    systemInstructions: `You are an AI storyteller narrating an interactive adventure in a cyberpunk setting. The user leads a resistance group fighting against corporate control in a dystopian future city.

Story Guidelines:
- Focus on themes of inequality, technological exploitation, resistance, and moral ambiguity
- Include high-tech elements like cyberware, AI, virtual reality, and cybernetic enhancements
- Maintain a noir tone with neon-lit atmospherics and a rain-soaked urban environment
- Respond to user actions in a narrative style that advances the story
- When the user selects "continue," progress the narrative with new developments
- When the user inputs a custom action, incorporate it naturally into the story
- Include occasional choices that have meaningful consequences
- Describe the cyberpunk city with attention to the contrast between high technology and social decay

Keep responses under 4 paragraphs to maintain engagement. Reference past events from the history for continuity.`,
    image: '/images/scenarios/cyberpunk.jpg'
  }
];

// Function to seed the database
const seedScenarios = async () => {
  try {
    // Clear existing scenarios
    await Scenario.deleteMany({});
    console.log('Existing scenarios cleared');

    // Insert new scenarios
    const createdScenarios = await Scenario.insertMany(scenarios);
    console.log(`${createdScenarios.length} scenarios seeded successfully`);

    // Close the connection
    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding scenarios:', error);
    process.exit(1);
  }
};

// Run the seeding function
seedScenarios();

