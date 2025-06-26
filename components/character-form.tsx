"use client"

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Character } from "@/lib/characters";
import ImageUpload from "@/components/image-upload";
import { X, Plus, Save, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { 
  characterCategories, 
  suggestedTags, 
  saveCustomCharacter, 
  generateDefaultPersonalityPrompt,
  generateStructuredPersonalityPrompt
} from "@/lib/custom-characters";
import { 
  saveCharacterImage, 
  fileToBase64,
  getCharacterImage
} from "@/lib/image-storage";
import CharacterTraitsSelector from "@/components/character-traits-selector";

interface CharacterFormProps {
  character?: Character;
  onSave?: (character: Character) => void;
  onCancel?: () => void;
}

export default function CharacterForm({ 
  character, 
  onSave,
  onCancel
}: CharacterFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const isEditing = !!character?.id;
  
  const [name, setName] = useState(character?.name || "");
  const [shortName, setShortName] = useState(character?.shortName || "");
  const [description, setDescription] = useState(character?.description || "");
  const [personalityPrompt, setPersonalityPrompt] = useState(character?.personalityPrompt || "");
  const [tags, setTags] = useState<string[]>(character?.tags || []);
  const [category, setCategory] = useState(character?.category || characterCategories[0]);
  const [image, setImage] = useState<string | null>(null);
  const [tagInput, setTagInput] = useState("");
  const [selectedTraits, setSelectedTraits] = useState<{ [category: string]: string[] }>({});
  const [customTraits, setCustomTraits] = useState<{ [traitId: string]: string }>({});
  
  // Load character image if editing
  useEffect(() => {
    if (character?.id) {
      const savedImage = getCharacterImage(character.id);
      if (savedImage) {
        setImage(savedImage);
      }
    }
  }, [character?.id]);
  
  // Update shortName when name changes (if shortName is empty or matches previous name)
  useEffect(() => {
    if (!isEditing || !shortName || shortName === character?.name) {
      setShortName(name);
    }
  }, [name, shortName, isEditing, character?.name]);
  
  // Initialize personality prompt if new character and name/tags change
  useEffect(() => {
    if (!isEditing && name && tags.length > 0 && !personalityPrompt) {
      const defaultPrompt = generateDefaultPersonalityPrompt(name, tags);
      setPersonalityPrompt(defaultPrompt);
    }
  }, [name, tags, isEditing]);

  // Update personality prompt when traits are selected (but don't auto-submit)
  useEffect(() => {
    // Only update if there are traits selected and we're creating a new character
    if (Object.values(selectedTraits).flat().length > 0 && !isEditing) {
      const structuredPrompt = generateStructuredPersonalityPrompt(
        name || 'Character',
        description || 'unique character',
        selectedTraits,
        customTraits
      );
      setPersonalityPrompt(structuredPrompt);
    }
  }, [selectedTraits, customTraits, name, description, isEditing]);
  
  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };
  
  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };
  
  const handleImageChange = async (file: File | null) => {
    if (file) {
      try {
        const base64Image = await fileToBase64(file);
        setImage(base64Image);
      } catch (error) {
        console.error("Error processing image:", error);
        toast({
          title: "Upload Failed",
          description: "Failed to process character image.",
          variant: "destructive",
        });
      }
    } else {
      setImage(null);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast({
        title: "Name Required",
        description: "Please provide a name for your character.",
        variant: "destructive",
      });
      return;
    }
    
    if (!personalityPrompt.trim()) {
      toast({
        title: "Personality Required",
        description: "Please define your character's personality.",
        variant: "destructive",
      });
      return;
    }
    
    if (tags.length === 0) {
      toast({
        title: "Tags Required",
        description: "Please add at least one tag to describe your character.",
        variant: "destructive",
      });
      return;
    }
    
    // Generate description if empty
    const finalDescription = description.trim() || (tags.length > 0 
      ? `A ${tags.slice(0, 2).join(' and ')} character named ${name}.`
      : `An AI character named ${name}.`);
    
    // Create new character object
    const newCharacter: Character = {
      id: character?.id || `custom-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      name,
      shortName: shortName || name,
      description: finalDescription,
      personalityPrompt,
      tags,
      category,
    };
    
    try {
      // Save character data
      const savedCharacter = saveCustomCharacter(newCharacter);
      
      // Save character image if available
      if (image) {
        saveCharacterImage(savedCharacter.id, image);
      }
      
      toast({
        title: isEditing ? "Character Updated" : "Character Created",
        description: `Your character "${name}" has been ${isEditing ? "updated" : "created"} successfully.`,
      });
      
      // Call onSave callback if provided
      if (onSave) {
        onSave(savedCharacter);
      } else {
        // Navigate to character chat
        router.push(`/chat/${savedCharacter.id}`);
      }
    } catch (error) {
      console.error("Error saving character:", error);
      toast({
        title: "Save Failed",
        description: "Failed to save your character. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <div className="flex flex-col items-center md:flex-row md:items-start md:space-x-4">
          <div className="mb-4 md:mb-0">
            <ImageUpload 
              value={image} 
              onChange={handleImageChange} 
              className="h-24 w-24"
              name={name}
            />
            <p className="text-xs text-center text-purple-300 mt-1">Character avatar</p>
          </div>
          
          <div className="flex-1 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Character Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full name"
                  maxLength={30}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="shortName">Short Name (Display Name)</Label>
                <Input
                  id="shortName"
                  value={shortName}
                  onChange={(e) => setShortName(e.target.value)}
                  placeholder="Short or nickname"
                  maxLength={20}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description of your character"
                maxLength={100}
                className="h-16 resize-none"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Category</Label>
              <div className="flex flex-wrap gap-2">
                {characterCategories.map((cat) => (
                  <Badge
                    key={cat}
                    variant={category === cat ? "default" : "outline"}
                    className="cursor-pointer hover:bg-primary/90"
                    onClick={() => setCategory(cat)}
                  >
                    {cat}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="tags">Tags</Label>
        <div className="flex items-center space-x-2 pb-2">
          <Input
            id="tags"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleAddTag()}
            placeholder="Add tags..."
            className="flex-1"
          />
          <Button 
            type="button" 
            onClick={handleAddTag}
            variant="outline"
            size="sm"
            className="flex-shrink-0"
            disabled={!tagInput.trim()}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex flex-wrap gap-2 min-h-10">
          {tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="gap-1">
              {tag}
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-3 w-3 rounded-full p-0 hover:bg-secondary"
                onClick={() => handleRemoveTag(tag)}
              >
                <X className="h-2 w-2" />
                <span className="sr-only">Remove {tag}</span>
              </Button>
            </Badge>
          ))}
        </div>
        
        <div className="flex flex-wrap gap-2 mt-2">
          {suggestedTags.slice(0, 10).filter(tag => !tags.includes(tag)).map((tag) => (
            <Badge 
              key={tag} 
              variant="outline"
              className="cursor-pointer hover:bg-secondary"
              onClick={() => {
                if (!tags.includes(tag)) {
                  setTags([...tags, tag]);
                }
              }}
            >
              {tag}
            </Badge>
          ))}
        </div>
      </div>
      
      <CharacterTraitsSelector 
        selectedTraits={selectedTraits}
        customTraits={customTraits}
        onChange={(traits, custom) => {
          setSelectedTraits(traits);
          setCustomTraits(custom);
        }}
      />
      
      <div className="space-y-2">
        <Label htmlFor="personalityPrompt">
          Personality Profile
          <span className="ml-2 text-xs text-muted-foreground">(Auto-generated from selections, but you can modify)</span>
        </Label>
        <Textarea
          id="personalityPrompt"
          value={personalityPrompt}
          onChange={(e) => setPersonalityPrompt(e.target.value)}
          className="min-h-48 font-mono text-sm"
          maxLength={5000}
        />
        <p className="text-xs text-muted-foreground">
          This prompt guides the AI in creating authentic interactions with your character.
          You can edit this text directly to fine-tune the character further.
        </p>
      </div>
      
      <div className="flex justify-between pt-4">
        {onCancel ? (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        ) : (
          <Button 
            type="button" 
            variant="destructive" 
            className="flex items-center gap-2"
            onClick={() => router.push('/explore')}
          >
            <Trash2 className="h-4 w-4" /> Discard
          </Button>
        )}
        
        <Button 
          type="submit" 
          className="flex items-center gap-2"
        >
          <Save className="h-4 w-4" /> {isEditing ? 'Update' : 'Create'} Character
        </Button>
      </div>
    </form>
  );
} 