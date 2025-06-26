"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { personalityTraits } from "@/lib/custom-characters"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Check, X } from "lucide-react"

interface CharacterTraitsSelectorProps {
  selectedTraits: { [category: string]: string[] }
  customTraits: { [traitId: string]: string }
  onChange: (selectedTraits: { [category: string]: string[] }, customTraits: { [traitId: string]: string }) => void
}

export default function CharacterTraitsSelector({
  selectedTraits = {},
  customTraits = {},
  onChange
}: CharacterTraitsSelectorProps) {
  const [activeCategory, setActiveCategory] = useState<string>(Object.keys(personalityTraits)[0])
  const [customTraitInputs, setCustomTraitInputs] = useState<{ [traitId: string]: string }>(customTraits || {})
  const [showCustomInput, setShowCustomInput] = useState<{ [category: string]: boolean }>({})
  
  // Initialize selected traits with empty arrays for each category if not provided
  useEffect(() => {
    const initializedTraits = { ...selectedTraits }
    Object.keys(personalityTraits).forEach(category => {
      if (!initializedTraits[category]) {
        initializedTraits[category] = []
      }
    })
    if (Object.keys(selectedTraits).length === 0) {
      onChange(initializedTraits, customTraitInputs)
    }
  }, [])
  
  const handleTraitClick = (category: string, traitId: string) => {
    const updatedTraits = { ...selectedTraits }
    
    // If this is a custom trait selector
    if (traitId.startsWith('custom-')) {
      // Show the custom input field
      setShowCustomInput({
        ...showCustomInput,
        [category]: true
      })
      
      // Add the custom trait ID if it's not already selected
      if (!updatedTraits[category]?.includes(traitId)) {
        if (!updatedTraits[category]) {
          updatedTraits[category] = []
        }
        updatedTraits[category].push(traitId)
        onChange(updatedTraits, customTraitInputs)
      }
      return
    }
    
    // For regular traits
    // If trait is already selected, remove it
    if (updatedTraits[category]?.includes(traitId)) {
      updatedTraits[category] = updatedTraits[category].filter(id => id !== traitId)
    } 
    // Otherwise add it
    else {
      if (!updatedTraits[category]) {
        updatedTraits[category] = []
      }
      updatedTraits[category].push(traitId)
    }
    
    onChange(updatedTraits, customTraitInputs)
  }
  
  const handleCustomTraitChange = (traitId: string, value: string) => {
    const updatedCustomTraits = { 
      ...customTraitInputs,
      [traitId]: value
    }
    setCustomTraitInputs(updatedCustomTraits)
    onChange(selectedTraits, updatedCustomTraits)
  }
  
  const handleSaveCustomTrait = (category: string, traitId: string) => {
    if (!customTraitInputs[traitId]?.trim()) return
    // Keep the custom trait in selected traits, we've already saved the value in customTraitInputs
    // Just hide the input form
    setShowCustomInput({
      ...showCustomInput,
      [category]: false
    })
  }
  
  const handleCancelCustomTrait = (category: string, traitId: string) => {
    const updatedTraits = { ...selectedTraits }
    // Remove the custom trait ID from selected traits
    if (updatedTraits[category]) {
      updatedTraits[category] = updatedTraits[category].filter(id => id !== traitId)
    }
    
    // Remove the custom trait value
    const updatedCustomTraits = { ...customTraitInputs }
    delete updatedCustomTraits[traitId]
    
    // Hide the input form
    setShowCustomInput({
      ...showCustomInput,
      [category]: false
    })
    
    onChange(updatedTraits, updatedCustomTraits)
  }
  
  const isTraitSelected = (category: string, traitId: string) => {
    return selectedTraits[category]?.includes(traitId) || false
  }
  
  // Count total selected traits
  const totalSelectedTraits = Object.values(selectedTraits).flat().length
  
  // Get custom trait value for a given trait ID
  const getCustomTraitValue = (traitId: string) => {
    return customTraitInputs[traitId] || ""
  }
  
  // Check if trait is a custom trait with a value
  const isCustomTraitWithValue = (category: string, traitId: string) => {
    return traitId.startsWith('custom-') && isTraitSelected(category, traitId) && !showCustomInput[category] && !!customTraitInputs[traitId]
  }
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Personality Traits</h3>
        <Badge variant="outline" className="ml-2">
          {totalSelectedTraits} selected
        </Badge>
      </div>
      
      <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
        <TabsList className="w-full overflow-x-auto flex-wrap justify-start h-auto p-1 gap-1">
          {Object.keys(personalityTraits).map(category => (
            <TabsTrigger 
              key={category} 
              value={category}
              className="relative"
            >
              {category}
              {selectedTraits[category]?.length > 0 && (
                <Badge 
                  variant="default" 
                  className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
                >
                  {selectedTraits[category].length}
                </Badge>
              )}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {Object.entries(personalityTraits).map(([category, traits]) => (
          <TabsContent key={category} value={category} className="pt-4">
            <Card>
              <CardContent className="p-4">
                {/* Custom trait input field */}
                {showCustomInput[category] && (
                  <div className="mb-4">
                    <Label htmlFor={`custom-${category}`} className="mb-2 block">
                      Define custom {category.toLowerCase()}:
                    </Label>
                    <div className="flex gap-2">
                      <Input 
                        id={`custom-${category}`}
                        value={getCustomTraitValue(`custom-${category.toLowerCase().replace(/\s+/g, '-')}`)}
                        onChange={(e) => handleCustomTraitChange(
                          `custom-${category.toLowerCase().replace(/\s+/g, '-')}`, 
                          e.target.value
                        )}
                        placeholder={`Enter your custom ${category.toLowerCase()}...`}
                        className="flex-1"
                      />
                      <Button 
                        type="button"
                        size="sm" 
                        onClick={() => handleSaveCustomTrait(
                          category, 
                          `custom-${category.toLowerCase().replace(/\s+/g, '-')}`
                        )}
                        disabled={!getCustomTraitValue(`custom-${category.toLowerCase().replace(/\s+/g, '-')}`)}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button 
                        type="button"
                        size="sm" 
                        variant="outline"
                        onClick={() => handleCancelCustomTrait(
                          category, 
                          `custom-${category.toLowerCase().replace(/\s+/g, '-')}`
                        )}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                  {traits.map(trait => (
                    <div key={trait.id} className="relative group">
                      {isCustomTraitWithValue(category, trait.id) ? (
                        <Button
                          type="button"
                          variant="default"
                          size="sm"
                          className="w-full justify-start bg-primary text-primary-foreground"
                          onClick={() => setShowCustomInput({...showCustomInput, [category]: true})}
                        >
                          {customTraitInputs[trait.id]}
                        </Button>
                      ) : (
                        <Button
                          type="button"
                          variant={isTraitSelected(category, trait.id) ? "default" : "outline"}
                          size="sm"
                          className={`w-full justify-start ${
                            isTraitSelected(category, trait.id) 
                              ? "bg-primary text-primary-foreground" 
                              : "bg-background hover:bg-muted"
                          }`}
                          onClick={() => handleTraitClick(category, trait.id)}
                        >
                          {trait.label}
                        </Button>
                      )}
                      <div className="hidden group-hover:block absolute z-50 p-2 max-w-xs bg-popover text-popover-foreground rounded-md text-xs shadow-md top-full mt-1">
                        {trait.description}
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-4">
                  Select multiple traits in each category to define your character's personality.
                  Use "Custom..." to define your own traits.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
} 