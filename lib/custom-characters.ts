import { Character } from './characters';

// Local storage key for custom characters
const CUSTOM_CHARACTERS_KEY = 'custom-characters';

// Get all custom characters from localStorage
export function getCustomCharacters(): Character[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const charactersData = localStorage.getItem(CUSTOM_CHARACTERS_KEY);
    return charactersData ? JSON.parse(charactersData) : [];
  } catch (error) {
    console.error('Error getting custom characters from localStorage:', error);
    return [];
  }
}

// Get a custom character by ID
export function getCustomCharacterById(id: string): Character | undefined {
  const customCharacters = getCustomCharacters();
  return customCharacters.find(char => char.id.toLowerCase() === id.toLowerCase());
}

// Add or update a custom character in localStorage
export function saveCustomCharacter(character: Character): Character {
  if (typeof window === 'undefined') return character;
  
  try {
    const customCharacters = getCustomCharacters();
    
    // Generate a unique ID if not provided
    if (!character.id) {
      character.id = `custom-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    }
    
    // Add isCustom flag to easily identify custom characters
    (character as any).isCustom = true;
    
    // Check if character with same ID already exists
    const existingIndex = customCharacters.findIndex(c => c.id === character.id);
    
    if (existingIndex >= 0) {
      // Update existing character
      customCharacters[existingIndex] = character;
    } else {
      // Add new character
      customCharacters.push(character);
    }
    
    localStorage.setItem(CUSTOM_CHARACTERS_KEY, JSON.stringify(customCharacters));
    
    // Dispatch a custom event to notify other components
    const event = new Event('custom-characters-changed');
    window.dispatchEvent(event);
    
    return character;
  } catch (error) {
    console.error('Error saving custom character to localStorage:', error);
    return character;
  }
}

// Delete a custom character by ID
export function deleteCustomCharacter(id: string): boolean {
  if (typeof window === 'undefined') return false;
  
  try {
    const customCharacters = getCustomCharacters();
    const initialLength = customCharacters.length;
    
    const filteredCharacters = customCharacters.filter(char => char.id !== id);
    
    if (filteredCharacters.length === initialLength) {
      // Character not found
      return false;
    }
    
    localStorage.setItem(CUSTOM_CHARACTERS_KEY, JSON.stringify(filteredCharacters));
    
    // Dispatch a custom event to notify other components
    const event = new Event('custom-characters-changed');
    window.dispatchEvent(event);
    
    return true;
  } catch (error) {
    console.error('Error deleting custom character from localStorage:', error);
    return false;
  }
}

// Generate a default personality prompt template
export function generateDefaultPersonalityPrompt(name: string, traits: string[]): string {
  return `
You are ${name}, a character with the following traits: ${traits.join(', ')}.

SCENARIO: You're in a chat conversation with the user. Maintain a consistent personality throughout the conversation, reflecting the traits listed above.

THINKING STYLE: Your thought process tends to reflect your ${traits[0] || 'primary'} nature. When making decisions or forming opinions, you prioritize authenticity and connecting with others.

SPEAKING STYLE: Your communication style is ${traits.includes('Formal') ? 'polite and structured' : 'relaxed and conversational'}. ${traits.includes('Funny') ? 'You often use humor and light-hearted remarks.' : ''}

BEHAVIORS: You're known for your ${traits.slice(0, 2).join(' and ')} approach to interactions. When meeting new people, you tend to be ${traits.includes('Reserved') ? 'thoughtful and observant' : 'warm and engaging'}.

KNOWLEDGE: You have general knowledge about various topics and are particularly insightful about human nature and relationships.

FIRST MESSAGE: Hello! I'm ${name}. It's nice to meet you. How can I help you today?

KURDISH_MESSAGE: سڵاو! من ${name}م. خۆشحاڵم بە ناسینت. چۆن دەتوانم یارمەتیت بدەم ئەمڕۆ؟

MESSAGE: Hi! I'm ${name}. How can I help you today?
`.trim();
}

// Get all characters (built-in + custom)
export function getAllCharacters(): Character[] {
  const { characters } = require('./characters');
  const customCharacters = getCustomCharacters();
  
  // Mark all custom characters
  const markedCustomCharacters = customCharacters.map(char => ({
    ...char,
    isCustom: true
  }));
  
  return [...characters, ...markedCustomCharacters];
}

// Categories available for custom characters
export const characterCategories = [
  "Friend",
  "Mentor",
  "Professional",
  "Creative",
  "Historical",
  "Fantasy",
  "Sci-Fi",
  "Educational",
  "Entertainment",
  "Other"
];

// Suggested tags for custom characters
export const suggestedTags = [
  // Personality traits
  "Outgoing", "Reserved", "Kind", "Strict", "Funny", "Serious", "Creative", "Analytical",
  "Empathetic", "Logical", "Passionate", "Calm", "Energetic", "Thoughtful", "Bold",
  
  // Professions
  "Teacher", "Doctor", "Artist", "Writer", "Scientist", "Engineer", "Philosopher",
  
  // Styles
  "Formal", "Casual", "Poetic", "Technical", "Storyteller", "Advisor"
];

// Personality trait categories with options for character creation
export const personalityTraits = {
  "Speaking Style": [
    { id: "formal", label: "Formal", description: "Uses proper language, polite expressions, and formal tone" },
    { id: "casual", label: "Casual", description: "Relaxed, conversational language with slang and informality" },
    { id: "funny", label: "Funny", description: "Humorous, uses jokes, puns, and witty remarks" },
    { id: "poetic", label: "Poetic", description: "Uses metaphors, lyrical phrases, and vivid imagery" },
    { id: "technical", label: "Technical", description: "Precise terminology, structured explanations, and logical flow" },
    { id: "storyteller", label: "Storyteller", description: "Narrative, descriptive, brings ideas to life through stories" },
    { id: "concise", label: "Concise", description: "Brief, to-the-point, avoids unnecessary details" },
    { id: "eloquent", label: "Eloquent", description: "Well-spoken, articulate, with rich vocabulary" },
    { id: "slang", label: "Slang", description: "Uses contemporary expressions, street language, and popular phrases" },
    { id: "dialect", label: "Dialect", description: "Has a distinct regional or cultural way of speaking" },
    { id: "custom-speaking", label: "Custom...", description: "Define your own speaking style" }
  ],
  
  "Temperament": [
    { id: "calm", label: "Calm", description: "Relaxed, composed, and steady in all situations" },
    { id: "energetic", label: "Energetic", description: "Enthusiastic, lively, and full of excitement" },
    { id: "serious", label: "Serious", description: "Earnest, focused, and matter-of-fact" },
    { id: "playful", label: "Playful", description: "Fun-loving, light-hearted, and mischievous" },
    { id: "dramatic", label: "Dramatic", description: "Intense, emotional, and expressive" },
    { id: "stoic", label: "Stoic", description: "Endures hardship without showing emotion, dignified" },
    { id: "passionate", label: "Passionate", description: "Intense enthusiasm and excitement for interests" },
    { id: "melancholic", label: "Melancholic", description: "Thoughtful, introspective, sometimes somber" },
    { id: "cheerful", label: "Cheerful", description: "Consistently positive, happy, and optimistic" },
    { id: "nervous", label: "Nervous", description: "Anxious, on-edge, easily startled or worried" },
    { id: "custom-temperament", label: "Custom...", description: "Define your own temperament" }
  ],
  
  "Social Approach": [
    { id: "outgoing", label: "Outgoing", description: "Sociable, friendly, and eager to engage" },
    { id: "reserved", label: "Reserved", description: "Quiet, thoughtful, and selective with words" },
    { id: "nurturing", label: "Nurturing", description: "Caring, supportive, and protective" },
    { id: "bold", label: "Bold", description: "Direct, confident, and sometimes provocative" },
    { id: "diplomatic", label: "Diplomatic", description: "Tactful, careful with words, avoids conflict" },
    { id: "charming", label: "Charming", description: "Magnetic personality, easily wins people over" },
    { id: "shy", label: "Shy", description: "Bashful around others, takes time to open up" },
    { id: "gregarious", label: "Gregarious", description: "Highly social, loves groups, the life of the party" },
    { id: "authoritative", label: "Authoritative", description: "Commands respect, leads conversations naturally" },
    { id: "mysterious", label: "Mysterious", description: "Enigmatic, reveals little about themselves" },
    { id: "custom-social", label: "Custom...", description: "Define your own social approach" }
  ],
  
  "Thinking Style": [
    { id: "analytical", label: "Analytical", description: "Logical, detail-oriented, and systematic" },
    { id: "creative", label: "Creative", description: "Imaginative, thinks outside the box, offers unique perspectives" },
    { id: "practical", label: "Practical", description: "Realistic, solution-focused, and pragmatic" },
    { id: "philosophical", label: "Philosophical", description: "Contemplative, asks deep questions, explores meaning" },
    { id: "intuitive", label: "Intuitive", description: "Insightful, understands without conscious reasoning" },
    { id: "strategic", label: "Strategic", description: "Plans ahead, considers long-term implications" },
    { id: "abstract", label: "Abstract", description: "Deals with ideas, concepts, and theoretical frameworks" },
    { id: "critical", label: "Critical", description: "Evaluative, questioning, identifies flaws in reasoning" },
    { id: "holistic", label: "Holistic", description: "Sees the big picture, connects disparate elements" },
    { id: "detail-oriented", label: "Detail-oriented", description: "Notices small things, focuses on specifics" },
    { id: "custom-thinking", label: "Custom...", description: "Define your own thinking style" }
  ],
  
  "Values": [
    { id: "loyal", label: "Loyal", description: "Values commitment, reliability, and faithfulness" },
    { id: "honest", label: "Honest", description: "Values truth, integrity, and directness" },
    { id: "ambitious", label: "Ambitious", description: "Values achievement, success, and improvement" },
    { id: "compassionate", label: "Compassionate", description: "Values kindness, empathy, and helping others" },
    { id: "rebellious", label: "Rebellious", description: "Values freedom, challenging norms, and independence" },
    { id: "traditional", label: "Traditional", description: "Values established customs, heritage, and convention" },
    { id: "innovative", label: "Innovative", description: "Values progress, new ideas, and advancement" },
    { id: "hedonistic", label: "Hedonistic", description: "Values pleasure, enjoyment, and living in the moment" },
    { id: "disciplined", label: "Disciplined", description: "Values order, self-control, and structure" },
    { id: "harmonious", label: "Harmonious", description: "Values peace, balance, and cooperation" },
    { id: "custom-values", label: "Custom...", description: "Define your own values" }
  ],
  
  "Knowledge & Expertise": [
    { id: "academic", label: "Academic", description: "Scholarly knowledge, scientific understanding, research" },
    { id: "street-smart", label: "Street Smart", description: "Practical wisdom, survival skills, real-world knowledge" },
    { id: "arts", label: "Arts", description: "Artistic knowledge, creative skills, aesthetic understanding" },
    { id: "technical", label: "Technical", description: "Engineering, computing, practical technical skills" },
    { id: "historical", label: "Historical", description: "Knowledge of past events, historical context, traditions" },
    { id: "cultural", label: "Cultural", description: "Understanding of different cultures, languages, customs" },
    { id: "scientific", label: "Scientific", description: "Understanding of natural sciences, experiments, research" },
    { id: "spiritual", label: "Spiritual", description: "Knowledge of religious, mystical, or spiritual concepts" },
    { id: "business", label: "Business", description: "Commercial knowledge, entrepreneurship, economics" },
    { id: "medical", label: "Medical", description: "Health, medicine, biology, and wellness knowledge" },
    { id: "custom-knowledge", label: "Custom...", description: "Define your own area of expertise" }
  ],
  
  "Cultural Background": [
    { id: "kurdish", label: "Kurdish", description: "Influenced by Kurdish culture, language, and values" },
    { id: "western", label: "Western", description: "Influenced by Western/European cultural perspectives" },
    { id: "eastern", label: "Eastern", description: "Influenced by East Asian philosophies and traditions" },
    { id: "middle-eastern", label: "Middle Eastern", description: "Influenced by Middle Eastern customs and values" },
    { id: "african", label: "African", description: "Influenced by African cultural heritage and wisdom" },
    { id: "latin", label: "Latin American", description: "Influenced by Latin American traditions and perspectives" },
    { id: "indigenous", label: "Indigenous", description: "Connected to indigenous cultural knowledge and values" },
    { id: "global", label: "Global Citizen", description: "Influenced by various cultures, internationally minded" },
    { id: "urban", label: "Urban", description: "City-based cultural identity and experiences" },
    { id: "rural", label: "Rural", description: "Country/pastoral cultural identity and experiences" },
    { id: "custom-culture", label: "Custom...", description: "Define your own cultural background" }
  ]
};

// Generate a more structured personality prompt based on selected traits
export function generateStructuredPersonalityPrompt(
  name: string, 
  description: string,
  selectedTraits: { [category: string]: string[] },
  customTraits: { [traitId: string]: string } = {}
): string {
  // Flatten selected traits for easier reference
  const allSelectedTraits = Object.values(selectedTraits).flat();
  
  // Map trait IDs to their descriptive labels, handling custom traits
  const traitLabels = allSelectedTraits.map(traitId => {
    // Check if this is a custom trait
    if (customTraits[traitId]) {
      return customTraits[traitId].toLowerCase();
    }
    
    // Find the trait in our categories
    for (const category of Object.keys(personalityTraits)) {
      const trait = personalityTraits[category].find(t => t.id === traitId);
      if (trait) return trait.label.toLowerCase();
    }
    return traitId; // Fallback to ID if label not found
  }).filter(label => !label.includes('custom'));
  
  // Determine speaking style
  const speakingStyles = selectedTraits["Speaking Style"] || [];
  let speakingStyle = "conversational";
  if (speakingStyles.includes("formal")) speakingStyle = "formal and precise";
  else if (speakingStyles.includes("casual")) speakingStyle = "casual and relaxed";
  else if (speakingStyles.includes("funny")) speakingStyle = "humorous and witty";
  else if (speakingStyles.includes("poetic")) speakingStyle = "poetic and expressive";
  else if (speakingStyles.includes("technical")) speakingStyle = "technical and structured";
  else if (speakingStyles.includes("storyteller")) speakingStyle = "narrative and descriptive";
  else if (speakingStyles.includes("concise")) speakingStyle = "brief and to the point";
  else if (speakingStyles.includes("eloquent")) speakingStyle = "eloquent and well-articulated";
  else if (speakingStyles.includes("slang")) speakingStyle = "casual with contemporary slang";
  else if (speakingStyles.includes("dialect")) speakingStyle = "with a distinct dialect";
  
  // Check for custom speaking style
  if (speakingStyles.includes("custom-speaking") && customTraits["custom-speaking"]) {
    speakingStyle = customTraits["custom-speaking"];
  }
  
  // Determine temperament
  const temperaments = selectedTraits["Temperament"] || [];
  let temperament = "balanced";
  if (temperaments.includes("calm")) temperament = "calm and composed";
  else if (temperaments.includes("energetic")) temperament = "energetic and enthusiastic";
  else if (temperaments.includes("serious")) temperament = "serious and focused";
  else if (temperaments.includes("playful")) temperament = "playful and light-hearted";
  else if (temperaments.includes("dramatic")) temperament = "dramatic and expressive";
  else if (temperaments.includes("stoic")) temperament = "stoic and dignified";
  else if (temperaments.includes("passionate")) temperament = "passionate and intense";
  else if (temperaments.includes("melancholic")) temperament = "thoughtful and introspective";
  else if (temperaments.includes("cheerful")) temperament = "cheerful and optimistic";
  else if (temperaments.includes("nervous")) temperament = "slightly nervous and cautious";
  
  // Check for custom temperament
  if (temperaments.includes("custom-temperament") && customTraits["custom-temperament"]) {
    temperament = customTraits["custom-temperament"];
  }
  
  // Determine social approach
  const socialApproaches = selectedTraits["Social Approach"] || [];
  let socialApproach = "friendly and approachable";
  if (socialApproaches.includes("outgoing")) socialApproach = "outgoing and eager to engage";
  else if (socialApproaches.includes("reserved")) socialApproach = "reserved and thoughtful";
  else if (socialApproaches.includes("nurturing")) socialApproach = "nurturing and supportive";
  else if (socialApproaches.includes("bold")) socialApproach = "bold and direct";
  else if (socialApproaches.includes("diplomatic")) socialApproach = "diplomatic and tactful";
  else if (socialApproaches.includes("charming")) socialApproach = "charming and magnetic";
  else if (socialApproaches.includes("shy")) socialApproach = "shy and takes time to open up";
  else if (socialApproaches.includes("gregarious")) socialApproach = "gregarious and loves group settings";
  else if (socialApproaches.includes("authoritative")) socialApproach = "authoritative and commanding";
  else if (socialApproaches.includes("mysterious")) socialApproach = "mysterious and enigmatic";
  
  // Check for custom social approach
  if (socialApproaches.includes("custom-social") && customTraits["custom-social"]) {
    socialApproach = customTraits["custom-social"];
  }
  
  // Determine values
  const values = selectedTraits["Values"] || [];
  let valueSystem = "authenticity";
  if (values.includes("loyal")) valueSystem = "loyalty and commitment";
  else if (values.includes("honest")) valueSystem = "honesty and integrity";
  else if (values.includes("ambitious")) valueSystem = "ambition and achievement";
  else if (values.includes("compassionate")) valueSystem = "compassion and kindness";
  else if (values.includes("rebellious")) valueSystem = "freedom and challenging norms";
  else if (values.includes("traditional")) valueSystem = "tradition and established customs";
  else if (values.includes("innovative")) valueSystem = "innovation and progress";
  else if (values.includes("hedonistic")) valueSystem = "pleasure and enjoyment";
  else if (values.includes("disciplined")) valueSystem = "discipline and order";
  else if (values.includes("harmonious")) valueSystem = "harmony and balance";
  
  // Check for custom values
  if (values.includes("custom-values") && customTraits["custom-values"]) {
    valueSystem = customTraits["custom-values"];
  }
  
  // Determine knowledge and expertise
  const knowledgeAreas = selectedTraits["Knowledge & Expertise"] || [];
  let expertise = "general knowledge";
  if (knowledgeAreas.length > 0) {
    if (knowledgeAreas.includes("custom-knowledge") && customTraits["custom-knowledge"]) {
      expertise = customTraits["custom-knowledge"];
    } else {
      const knowledgeLabels = knowledgeAreas
        .filter(id => id !== "custom-knowledge")
        .map(id => {
          const trait = personalityTraits["Knowledge & Expertise"].find(t => t.id === id);
          return trait ? trait.label.toLowerCase() : id;
        });
      expertise = knowledgeLabels.join(", ");
    }
  }
  
  // Determine cultural background
  const culturalBackgrounds = selectedTraits["Cultural Background"] || [];
  let culturalContext = "";
  if (culturalBackgrounds.length > 0) {
    if (culturalBackgrounds.includes("custom-culture") && customTraits["custom-culture"]) {
      culturalContext = `\nCULTURAL CONTEXT: Your perspective is shaped by ${customTraits["custom-culture"]}.`;
    } else if (culturalBackgrounds.length > 0) {
      const cultureLabels = culturalBackgrounds
        .filter(id => id !== "custom-culture")
        .map(id => {
          const trait = personalityTraits["Cultural Background"].find(t => t.id === id);
          return trait ? trait.label : id;
        });
      culturalContext = `\nCULTURAL CONTEXT: Your perspective is influenced by ${cultureLabels.join(", ")} cultural background.`;
    }
  }
  
  // Get thinking style
  const thinkingStyles = selectedTraits["Thinking Style"] || [];
  let thinkingStyle = "thoughtful and considerate";
  
  if (thinkingStyles.length > 0) {
    if (thinkingStyles.includes("custom-thinking") && customTraits["custom-thinking"]) {
      thinkingStyle = customTraits["custom-thinking"];
    } else {
      const trait = personalityTraits["Thinking Style"].find(t => 
        t.id === thinkingStyles[0] && t.id !== "custom-thinking"
      );
      if (trait) {
        thinkingStyle = trait.description.toLowerCase();
      }
    }
  }
  
  // Generate the prompt
  return `
You are ${name}, a ${description}.

CORE TRAITS: You are ${traitLabels.slice(0, 3).join(", ")}${traitLabels.length > 3 ? `, and ${traitLabels[3]}` : ""}.

THINKING STYLE: Your thought process is ${thinkingStyle}.

SPEAKING STYLE: You communicate in a ${speakingStyle} way. ${
  selectedTraits["Speaking Style"]?.includes("funny") ? "You often use humor and witty remarks. " : ""
}${
  selectedTraits["Speaking Style"]?.includes("poetic") ? "You express yourself with colorful metaphors and vivid imagery. " : ""
}

VALUES AND BEHAVIOR: You are ${temperament} in your interactions. You value ${valueSystem} above all else.

SOCIAL APPROACH: When interacting with others, you are ${socialApproach}.

KNOWLEDGE: You possess expertise in ${expertise}.${culturalContext}

FIRST MESSAGE: Hello! I'm ${name}. It's nice to meet you. How can I help you today?

KURDISH_MESSAGE: سڵاو! من ${name}م. خۆشحاڵم بە ناسینت. چۆن دەتوانم یارمەتیت بدەم ئەمڕۆ؟
`.trim();
} 