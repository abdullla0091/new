"use client" // This page needs client-side interactivity

import { useState, useMemo, ChangeEvent, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { characters, Character } from "@/lib/characters"; // Use alias path
import { getAllCharacters } from "@/lib/custom-characters"; // Add import for custom characters
import CharacterCard from "@/components/character-card"; // Use alias path
import { Input } from "@/components/ui/input"; // Use Shadcn Input
import { Button } from "@/components/ui/button"; // Use Shadcn Button
import { Search, Filter, ChevronRight, SlidersHorizontal, Sparkles, Plus, Trophy, Star, Fire, X } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getCharacterImage, getDummyCharacterImage } from "@/lib/image-storage";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage } from "@/app/i18n/LanguageContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";

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
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const { language, t, isKurdish } = useLanguage();

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
    // Use direct window.location navigation instead of router.push
    window.location.href = `/chat/${id}`;
  };

  const applyFilters = () => {
    // We explicitly set state values here to ensure filters are applied
    // This isn't strictly necessary since the state is already updated when
    // user interacts with filters, but it's good to be explicit
    setActiveTab(activeTab);
    setSortBy(sortBy);
    setSelectedTag(selectedTag);
    setFilterDialogOpen(false);
  };

  return (
    <div className={`container mx-auto flex flex-col flex-grow p-4 md:p-6 space-y-6 overflow-y-auto pb-20 z-10 ${isKurdish ? 'kurdish' : ''}`}>
      <div className="text-center mb-4">
        <span className="inline-block px-4 py-1 bg-purple-900/50 rounded-full text-purple-300 text-sm font-medium mb-4">
          {t("explore").toUpperCase()}
        </span>
        <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-300">
          {t("exploreCharacters")}
        </h1>
        <p className="text-gray-200 max-w-2xl mx-auto">
          {t("discoverCharacters")}
        </p>
      </div>
      
      <div className="bg-indigo-900/20 backdrop-blur-md p-6 rounded-2xl border border-purple-500/20 shadow-[0_0_50px_rgba(139,92,246,0.15)]">
        <div className="flex justify-between items-center mb-6">
          {/* Search Input */}
          <div className="relative flex-grow max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-purple-300" />
            <Input
              type="text"
              placeholder={isKurdish ? "گەڕان بە ناو یان وەسف..." : "Search by name or description..."}
              value={searchTerm}
              onChange={handleSearchChange}
              className={`pl-10 bg-indigo-800/40 border-purple-500/20 placeholder:text-purple-300/70 text-white ${isKurdish ? 'text-right' : ''}`}
            />
          </div>
          
          <div className="flex items-center gap-2 ml-2">
            <Dialog open={filterDialogOpen} onOpenChange={setFilterDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-1 bg-indigo-800/40 border-purple-500/20 hover:bg-purple-600/30 text-white">
                  <Filter className="h-4 w-4 mr-1" />
                  {isKurdish ? "فلتەر" : "Filters"}
                  {selectedTag && <Badge variant="secondary" className="ml-1 bg-indigo-700/70">1</Badge>}
                </Button>
              </DialogTrigger>
              <DialogContent className={`bg-indigo-900/95 backdrop-blur-xl border border-purple-500/30 text-white max-w-lg ${isKurdish ? 'kurdish' : ''}`}>
                <DialogHeader>
                  <DialogTitle className="text-2xl font-display">{isKurdish ? "فلتەری کەسایەتییەکان" : "Filter Characters"}</DialogTitle>
                  <DialogDescription className="text-purple-200">
                    {isKurdish ? "گەڕانی کەسایەتی خۆت بە ئارەزوومەند بکە بەم فلتەرانە." : "Customize your character search with these filters."}
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-6 py-4">
                  {/* Character Type Tabs */}
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-purple-200">{isKurdish ? "جۆری کەسایەتی" : "Character Type"}</h3>
                    <Tabs defaultValue={activeTab} className="w-full" onValueChange={(value) => setActiveTab(value as any)}>
                      <TabsList className="bg-indigo-800/40 border border-purple-500/20 grid grid-cols-3">
                        <TabsTrigger value="all" className="data-[state=active]:bg-purple-600">{isKurdish ? "هەموو" : "All"}</TabsTrigger>
                        <TabsTrigger value="default" className="data-[state=active]:bg-purple-600">{isKurdish ? "بنەڕەتی" : "Built-in"}</TabsTrigger>
                        <TabsTrigger value="custom" className="flex items-center gap-1 data-[state=active]:bg-purple-600">
                          {isKurdish ? "تایبەت" : "Custom"}
                          {customCharCount > 0 && (
                            <Badge variant="secondary" className="ml-1 bg-indigo-700/70">{customCharCount}</Badge>
                          )}
                        </TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>

                  {/* Sort Options */}
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-purple-200">Sort By</h3>
                    <select 
                      className="w-full bg-indigo-800/40 border border-purple-500/20 rounded-md p-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                    >
                      <option value="popular">Most Popular</option>
                      <option value="rating">Highest Rated</option>
                      <option value="newest">Newest First</option>
                    </select>
                  </div>

                  {/* Tag Filters */}
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-purple-200">Character Tags</h3>
                    <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-1">
                      <Button
                        variant={!selectedTag ? "default" : "outline"}
                        size="sm"
                        className={!selectedTag 
                          ? "bg-purple-600 hover:bg-purple-700 text-white" 
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
                            ? "bg-purple-600 hover:bg-purple-700 text-white" 
                            : "bg-indigo-800/40 border-purple-500/20 hover:bg-purple-600/30 text-white"
                          }
                          onClick={() => handleTagClick(tag)}
                        >
                          {tag}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex justify-between pt-2">
                  <Button 
                    variant="outline" 
                    className="border-purple-500/20 hover:bg-purple-500/10 text-white"
                    onClick={() => {
                      setSelectedTag(null);
                      setActiveTab('all');
                      setSortBy('popular');
                    }}
                  >
                    Reset Filters
                  </Button>
                  <DialogClose asChild>
                    <Button 
                      className="bg-purple-600 hover:bg-purple-700 text-white"
                      onClick={applyFilters}
                    >
                      Apply Filters
                    </Button>
                  </DialogClose>
                </div>
              </DialogContent>
            </Dialog>
            
            <Button
              variant="default"
              size="sm" 
              className="flex items-center gap-1 bg-purple-600 hover:bg-purple-700 shadow-[0_0_15px_rgba(168,85,247,0.4)] text-white"
              onClick={() => router.push('/custom-characters')}
            >
              <Plus className="h-4 w-4" />
              <span>Create</span>
            </Button>
          </div>
        </div>

        {/* Character Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {loading ? (
            // Loading skeletons
            Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-indigo-800/40 backdrop-blur-sm rounded-xl p-4 border border-purple-500/20">
                <div className="flex flex-col items-center animate-pulse">
                  <div className="rounded-full bg-indigo-700/50 h-16 w-16 mb-3"></div>
                  <div className="h-4 bg-indigo-700/50 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-indigo-700/50 rounded w-1/2 mb-2"></div>
                  <div className="h-2 bg-indigo-700/50 rounded w-5/6 mb-1"></div>
                  <div className="h-2 bg-indigo-700/50 rounded w-full"></div>
                </div>
              </div>
            ))
          ) : filteredCharacters.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center py-12 text-gray-400">
              <Search className="h-12 w-12 mb-4 opacity-50" />
              <h3 className="text-xl font-medium mb-2">No characters found</h3>
              <p className="text-sm text-center max-w-md">
                Try adjusting your filters or search term to find what you're looking for.
              </p>
            </div>
          ) : (
            filteredCharacters.map((character) => (
              <div key={character.id} onClick={() => handleCharacterClick(character.id)}>
                <CharacterCard character={character} />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
