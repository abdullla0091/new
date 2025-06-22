"use client"

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Character } from "@/lib/characters";
import CharacterForm from "@/components/character-form";
import CharacterCard from "@/components/character-card";
import { 
  getCustomCharacters, 
  deleteCustomCharacter 
} from "@/lib/custom-characters";
import { useToast } from "@/components/ui/use-toast";
import { Plus, RefreshCw, Edit, Trash, Sparkles, Wand2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";

export default function CustomCharactersPage() {
  const { toast } = useToast();
  const [customCharacters, setCustomCharacters] = useState<Character[]>([]);
  const [characterToEdit, setCharacterToEdit] = useState<Character | undefined>(undefined);
  const [characterToDelete, setCharacterToDelete] = useState<Character | undefined>(undefined);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  // Load custom characters
  const loadCharacters = () => {
    const characters = getCustomCharacters();
    setCustomCharacters(characters);
  };
  
  useEffect(() => {
    loadCharacters();
    
    // Listen for storage events or custom-characters-changed events
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'custom-characters') {
        loadCharacters();
      }
    };
    
    const handleCustomCharactersChanged = () => {
      loadCharacters();
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('custom-characters-changed', handleCustomCharactersChanged);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('custom-characters-changed', handleCustomCharactersChanged);
    };
  }, []);
  
  const handleCreateCharacter = (character: Character) => {
    setIsCreateDialogOpen(false);
    loadCharacters();
    toast({
      title: "Character Created",
      description: `${character.name} has been created successfully.`,
    });
  };
  
  const handleEditCharacter = (character: Character) => {
    setIsEditDialogOpen(false);
    setCharacterToEdit(undefined);
    loadCharacters();
    toast({
      title: "Character Updated",
      description: `${character.name} has been updated successfully.`,
    });
  };
  
  const handleConfirmDelete = () => {
    if (characterToDelete) {
      const name = characterToDelete.name;
      const deleted = deleteCustomCharacter(characterToDelete.id);
      
      if (deleted) {
        loadCharacters();
        toast({
          title: "Character Deleted",
          description: `${name} has been deleted.`,
        });
      } else {
        toast({
          title: "Delete Failed",
          description: "Failed to delete the character. Please try again.",
          variant: "destructive",
        });
      }
      
      setCharacterToDelete(undefined);
      setIsDeleteDialogOpen(false);
    }
  };
  
  return (
    <div className="container mx-auto py-6 px-4 space-y-6 z-10">
      <div className="text-center mb-8">
        <span className="inline-block px-4 py-1 bg-purple-900/50 rounded-full text-purple-300 text-sm font-medium mb-4">
          PERSONALIZE
        </span>
        <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-300">
          Custom Characters
        </h1>
        <p className="text-gray-200 max-w-2xl mx-auto">
          Create and manage your own AI characters with unique personalities and backstories.
        </p>
      </div>

      <div className="bg-indigo-900/20 backdrop-blur-md p-6 rounded-2xl border border-purple-500/20 shadow-[0_0_50px_rgba(139,92,246,0.15)]">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-purple-200">Your Characters</h2>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={loadCharacters}
              className="flex items-center gap-1 bg-indigo-800/40 border-purple-500/20 hover:bg-purple-600/30 text-white"
            >
              <RefreshCw className="h-4 w-4" />
              <span className="hidden sm:inline">Refresh</span>
            </Button>
            
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="flex items-center gap-1 bg-purple-600 hover:bg-purple-700 shadow-[0_0_15px_rgba(168,85,247,0.4)]">
                  <Plus className="h-4 w-4" />
                  <span>Create Character</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto bg-indigo-950/95 border-purple-500/30 text-white">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-300">Create Custom Character</DialogTitle>
                  <DialogDescription className="text-gray-300">
                    Create your own AI character with a unique personality.
                  </DialogDescription>
                </DialogHeader>
                <CharacterForm onSave={handleCreateCharacter} onCancel={() => setIsCreateDialogOpen(false)} />
              </DialogContent>
            </Dialog>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {customCharacters.length === 0 ? (
            <div className="col-span-full p-10 text-center bg-indigo-900/30 backdrop-blur-md rounded-xl border border-purple-500/20">
              <Wand2 className="h-12 w-12 mx-auto mb-4 text-purple-400 opacity-70" />
              <h3 className="text-xl font-semibold mb-3 text-purple-200">No Custom Characters Yet</h3>
              <p className="text-gray-300 mb-6 max-w-md mx-auto">
                Create your first custom character to start chatting with your own AI persona.
              </p>
              <Button 
                onClick={() => setIsCreateDialogOpen(true)}
                className="flex items-center gap-2 mx-auto bg-purple-600 hover:bg-purple-700 shadow-[0_0_15px_rgba(168,85,247,0.4)]"
              >
                <Plus className="h-4 w-4" />
                Create Your First Character
              </Button>
            </div>
          ) : (
            customCharacters.map((character) => (
              <div key={character.id} className="relative group">
                <CharacterCard character={character} />
                
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {/* Edit Button */}
                  <Button
                    variant="secondary"
                    size="icon"
                    className="h-8 w-8 rounded-full bg-indigo-700/80 hover:bg-indigo-600 text-white"
                    onClick={() => {
                      setCharacterToEdit(character);
                      setIsEditDialogOpen(true);
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  
                  {/* Delete Button */}
                  <Button
                    variant="secondary"
                    size="icon"
                    className="h-8 w-8 rounded-full bg-red-600/70 hover:bg-red-600 text-white"
                    onClick={() => {
                      setCharacterToDelete(character);
                      setIsDeleteDialogOpen(true);
                    }}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
                
                {/* Custom character badge */}
                <div className="mt-1 flex justify-center">
                  <Badge variant="outline" className="flex items-center gap-1 text-xs bg-indigo-800/40 border-purple-500/20 text-purple-300">
                    <Sparkles className="h-3 w-3" />
                    Custom
                  </Badge>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      
      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto bg-indigo-950/95 border-purple-500/30 text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-300">
              Edit {characterToEdit?.name}
            </DialogTitle>
            <DialogDescription className="text-gray-300">
              Modify your custom character's details.
            </DialogDescription>
          </DialogHeader>
          {characterToEdit && (
            <CharacterForm 
              character={characterToEdit} 
              onSave={handleEditCharacter} 
              onCancel={() => {
                setIsEditDialogOpen(false);
                setCharacterToEdit(undefined);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="bg-indigo-950/95 border-purple-500/30 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl text-purple-200">Delete {characterToDelete?.name}?</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-300">
              This action cannot be undone. This will permanently delete the character
              and remove all related data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-indigo-800/40 border-purple-500/20 hover:bg-purple-600/30 text-white">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
} 