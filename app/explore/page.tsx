"use client" // This page needs client-side interactivity

import { useState, useMemo, ChangeEvent, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { characters, Character } from "@/lib/characters"; // Use alias path
import { getAllCharacters } from "@/lib/custom-characters"; // Add import for custom characters
import CharacterCard from "@/components/character-card"; // Use alias path
import { Input } from "@/components/ui/input"; // Use Shadcn Input
import { Button } from "@/components/ui/button"; // Use Shadcn Button
import { Search, Filter, ChevronRight, SlidersHorizontal, Sparkles, Plus, Trophy, Star, Fire } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getCharacterImage, getDummyCharacterImage } from "@/lib/image-storage";
import { Skeleton } from "@/components/ui/skeleton";

// Generate a background gradient based on the character name
function getAvatarGradient(name: string): string {
  const gradients = [
    "from-purple-600 to-indigo-600",
    "from-indigo-600 to-blue-600",
    "from-blue-600 to-cyan-600",
    "from-cyan-600 to-teal-600",
    "from-teal-600 to-green-600",
    "from-pink-600 to-rose-600",
    "from-rose-600 to-red-600",
    "from-orange-600 to-amber-600"
  ];
  
  // Use the character's initial as a simple hash function
  const index = name.charCodeAt(0) % gradients.length;
  return gradients[index];
}

export default function ExplorePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'rating' | 'popular' | 'newest'>('popular');
  const [charactersForCards, setCharactersForCards] = useState<Character[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'default' | 'custom'>('all');
  const [loading, setLoading] = useState(true);

  // Initialize from URL parameters if present
  useEffect(() => {
    const filter = searchParams.get('filter');
    if (filter === 'trending') {
      setSortBy('newest');
    } else if (filter === 'popular') {
      setSortBy('popular');
    }

    const searchQuery = searchParams.get('q');
    if (searchQuery) {
      setSearchTerm(searchQuery);
    }

    const tag = searchParams.get('tag');
    if (tag) {
      setSelectedTag(tag);
    }

    // Load all characters (built-in + custom)
    setLoading(true);
    const allCharacters = getAllCharacters();
    
    // Process characters with additional properties
    const processedChars = allCharacters.map((char: Character, index: number) => {
      // Check if it's a custom character (has isCustom property)
      const isCustom = (char as any).isCustom;
      
      return {
        ...char,
        avatar: null, // Will be handled by CharacterCard component
        rating: parseFloat((4.2 + Math.random() * 0.8).toFixed(1)), // Random rating between 4.2-5.0
        category: char.category || char.tags[0] || "General", // Use category or first tag
        verified: !isCustom && index % 3 === 0, // Only built-in characters can be verified
        totalChats: Math.floor(Math.random() * 25000) + 5000, // Random popularity count
        createdDate: isCustom ? new Date() : new Date(Date.now() - Math.floor(Math.random() * 90) * 24 * 60 * 60 * 1000) // Random date in last 90 days for built-in
      };
    });

    setCharactersForCards(processedChars);
    setLoading(false);
    
    // Listen for custom character changes
    const handleCustomCharactersChanged = () => {
      setLoading(true);
      const updatedCharacters = getAllCharacters();
      setCharactersForCards(updatedCharacters.map((char: Character, index: number) => {
        const isCustom = (char as any).isCustom;
        return {
          ...char,
          avatar: null,
          rating: parseFloat((4.2 + Math.random() * 0.8).toFixed(1)),
          category: char.category || char.tags[0] || "General",
          verified: !isCustom && index % 3 === 0,
          totalChats: Math.floor(Math.random() * 25000) + 5000,
          createdDate: isCustom ? new Date() : new Date(Date.now() - Math.floor(Math.random() * 90) * 24 * 60 * 60 * 1000)
        };
      }));
      setLoading(false);
    };
    
    window.addEventListener('custom-characters-changed', handleCustomCharactersChanged);
    return () => {
      window.removeEventListener('custom-characters-changed', handleCustomCharactersChanged);
    };
  }, [searchParams]);

  // Get all unique tags from characters for filtering
  const allTags = useMemo(() => {
    const tagsSet = new Set<string>();
    charactersForCards.forEach(char => char.tags?.forEach(tag => tagsSet.add(tag)));
    return Array.from(tagsSet).sort();
  }, [charactersForCards]);

  // Filter characters based on search term, selected tag, and tab
  const filteredCharacters = useMemo(() => {
    // First filter by tab
    let filtered = charactersForCards.filter(char => {
      const isCustom = (char as any).isCustom;
      
      if (activeTab === 'all') return true;
      if (activeTab === 'default') return !isCustom;
      if (activeTab === 'custom') return isCustom;
      return true;
    });
    
    // Then filter by search term and tag
    filtered = filtered.filter(char => {
      const nameMatch = char.name.toLowerCase().includes(searchTerm.toLowerCase());
      const descriptionMatch = char.description.toLowerCase().includes(searchTerm.toLowerCase());
      const tagMatch = !selectedTag || (char.tags && char.tags.includes(selectedTag));
      return (nameMatch || descriptionMatch) && tagMatch;
    });

    // Apply sorting
    if (sortBy === 'rating') {
      filtered = [...filtered].sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortBy === 'popular') {
      filtered = [...filtered].sort((a, b) => (b.totalChats || 0) - (a.totalChats || 0));
    } else if (sortBy === 'newest') {
      filtered = [...filtered].sort((a, b) => {
        if (!a.createdDate || !b.createdDate) return 0;
        return b.createdDate.getTime() - a.createdDate.getTime();
      });
    }

    return filtered;
  }, [searchTerm, selectedTag, charactersForCards, sortBy, activeTab]);

  // Get featured characters (top 5 rated)
  const featuredCharacters = useMemo(() => {
    return [...charactersForCards]
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, 5);
  }, [charactersForCards]);

  // Count of custom characters
  const customCharCount = useMemo(() => {
    return charactersForCards.filter(char => (char as any).isCustom).length;
  }, [charactersForCards]);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleTagClick = (tag: string | null) => {
    setSelectedTag(tag);
  };

  const handleCharacterClick = (id: string) => {
    router.push(`/chat/${id}`);
  };

  const handleFeaturedClick = (id: string) => {
    router.push(`/profile/${id}`);
  };

  return (
    <div className="container mx-auto flex flex-col flex-grow p-4 md:p-6 space-y-6 overflow-y-auto pb-20 z-10">
      <div className="text-center mb-4">
        <span className="inline-block px-4 py-1 bg-purple-900/50 rounded-full text-purple-300 text-sm font-medium mb-4">
          DISCOVER
        </span>
        <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-300">
          Explore Characters
        </h1>
        <p className="text-gray-200 max-w-2xl mx-auto">
          Find the perfect AI companion to chat with from our collection of unique personalities.
        </p>
      </div>
      
      {/* Featured Characters */}
      {!loading && featuredCharacters.length > 0 && (
        <div className="bg-gradient-to-br from-indigo-900/30 to-purple-900/30 backdrop-blur-md p-6 rounded-2xl border border-purple-500/20 shadow-[0_0_50px_rgba(139,92,246,0.15)]">
          <div className="flex items-center mb-4">
            <Trophy className="h-5 w-5 text-yellow-400 mr-2" />
            <h2 className="text-xl font-bold text-white">Featured Characters</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {featuredCharacters.map((char, index) => {
              const characterId = char.id.toString();
              const avatarGradient = getAvatarGradient(char.name);
              let profileImage = null;
              
              // Try to get character image
              const savedImage = getCharacterImage(characterId);
              if (savedImage) {
                profileImage = savedImage;
              } else if (char.avatar) {
                profileImage = char.avatar;
              } else {
                profileImage = getDummyCharacterImage(characterId);
              }
              
              return (
                <div 
                  key={char.id}
                  className="flex flex-col items-center p-3 bg-indigo-900/40 rounded-xl border border-purple-500/20 hover:border-purple-500/40 cursor-pointer transition-all duration-300 hover:scale-[1.02]"
                  onClick={() => handleFeaturedClick(characterId)}
                >
                  <div className={`flex-shrink-0 relative w-16 h-16 rounded-full bg-gradient-to-br ${avatarGradient} p-0.5`}>
                    <Avatar className="w-full h-full">
                      {profileImage ? (
                        <AvatarImage src={profileImage} alt={char.name} />
                      ) : (
                        <AvatarFallback className="bg-indigo-800 text-white">
                          {char.name.charAt(0)}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    {index === 0 && (
                      <div className="absolute -top-1 -right-1 bg-yellow-500 rounded-full p-0.5">
                        <Star className="h-3 w-3 text-white fill-white" />
                      </div>
                    )}
                  </div>
                  <h3 className="mt-2 font-medium text-sm text-white text-center">{char.name}</h3>
                  <div className="flex items-center mt-1">
                    <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                    <span className="text-xs ml-1 text-yellow-100">{char.rating}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      
      <div className="bg-indigo-900/20 backdrop-blur-md p-6 rounded-2xl border border-purple-500/20 shadow-[0_0_50px_rgba(139,92,246,0.15)]">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <Tabs defaultValue="all" className="w-full" onValueChange={(value) => setActiveTab(value as any)}>
              <TabsList className="bg-indigo-800/40 border border-purple-500/20 grid grid-cols-3">
                <TabsTrigger value="all" className="data-[state=active]:bg-purple-600">All Characters</TabsTrigger>
                <TabsTrigger value="default" className="data-[state=active]:bg-purple-600">Built-in</TabsTrigger>
                <TabsTrigger value="custom" className="flex items-center gap-1 data-[state=active]:bg-purple-600">
                  Custom
                  {customCharCount > 0 && (
                    <Badge variant="secondary" className="ml-1 bg-indigo-700/70">{customCharCount}</Badge>
                  )}
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="flex items-center bg-indigo-800/40 border-purple-500/20 hover:bg-purple-600/30">
              <SlidersHorizontal className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Sort by:</span> 
              <select 
                className="ml-1 bg-transparent focus:outline-none text-white"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
              >
                <option value="popular">Popular</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">Newest</option>
              </select>
            </Button>
            
            <Button
              variant="default"
              size="sm" 
              className="flex items-center gap-1 bg-purple-600 hover:bg-purple-700 shadow-[0_0_15px_rgba(168,85,247,0.4)]"
              onClick={() => router.push('/custom-characters')}
            >
              <Plus className="h-4 w-4" />
              <span>Create</span>
            </Button>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-purple-300" />
          <Input
            type="text"
            placeholder="Search by name or description..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="pl-10 bg-indigo-800/40 border-purple-500/20 placeholder:text-purple-300/70 text-white"
          />
        </div>

        {/* Tag Filters */}
        <div className="overflow-x-auto pb-4 mb-4">
          <div className="flex flex-nowrap gap-2 w-max">
            <Button
              variant={!selectedTag ? "default" : "outline"}
              size="sm"
              className={!selectedTag 
                ? "bg-purple-600 hover:bg-purple-700" 
                : "bg-indigo-800/40 border-purple-500/20 hover:bg-purple-600/30 text-white"
              }
              onClick={() => handleTagClick(null)}
            >
              All
            </Button>
            {allTags.map(tag => (
              <Button
                key={tag}
                variant={selectedTag === tag ? "default" : "outline"}
                size="sm"
                className={selectedTag === tag 
                  ? "bg-purple-600 hover:bg-purple-700" 
                  : "bg-indigo-800/40 border-purple-500/20 hover:bg-purple-600/30 text-white"
                }
                onClick={() => handleTagClick(tag)}
              >
                {tag}
              </Button>
            ))}
          </div>
        </div>

        {/* Character Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-indigo-800/40 backdrop-blur-sm rounded-xl p-4 border border-purple-500/20">
                <div className="flex flex-col items-center">
                  <Skeleton className="h-16 w-16 rounded-full mb-3" />
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-3 w-16 mb-2" />
                  <Skeleton className="h-3 w-full mb-1" />
                  <Skeleton className="h-3 w-5/6" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredCharacters.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredCharacters.map(char => (
              <div 
                key={char.id} 
                className="cursor-pointer transform hover:scale-[1.02] transition-transform"
              >
                <CharacterCard character={char} />
                
                {/* Custom character badge */}
                {(char as any).isCustom && (
                  <div className="mt-1 flex justify-center">
                    <Badge variant="outline" className="flex items-center gap-1 text-xs bg-indigo-800/40 border-purple-500/20 text-purple-300">
                      <Sparkles className="h-3 w-3" />
                      Custom
                    </Badge>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 border border-purple-500/20 rounded-xl bg-indigo-900/30 backdrop-blur-md">
            <Sparkles className="h-12 w-12 mx-auto mb-4 text-purple-400 opacity-50" />
            <h3 className="text-xl font-semibold mb-2 text-purple-200">No Characters Found</h3>
            <p className="text-gray-300 max-w-md mx-auto mb-6">
              Try adjusting your search or filters to find characters, or create your own custom character.
            </p>
            <Button 
              onClick={() => router.push('/custom-characters')}
              className="bg-purple-600 hover:bg-purple-700 shadow-[0_0_15px_rgba(168,85,247,0.4)] mx-auto flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Create Your Own Character
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
