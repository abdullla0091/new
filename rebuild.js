const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Function to delete directory recursively
function deleteFolderRecursive(folderPath) {
  if (fs.existsSync(folderPath)) {
    fs.readdirSync(folderPath).forEach((file) => {
      const curPath = path.join(folderPath, file);
      if (fs.lstatSync(curPath).isDirectory()) {
        deleteFolderRecursive(curPath);
      } else {
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(folderPath);
    console.log(`Deleted folder: ${folderPath}`);
  }
}

try {
  // Delete build cache directories
  const directories = ['.next', 'node_modules/.cache'];
  
  directories.forEach(dir => {
    try {
      console.log(`Attempting to delete ${dir}...`);
      deleteFolderRecursive(dir);
    } catch (error) {
      console.warn(`Warning: Could not completely delete ${dir}. Error: ${error.message}`);
    }
  });

  // Create placeholder files if they don't exist
  const routePaths = [
    'app/custom-characters',
    'app/favorites',
    'app/profile',
    'app/appearance',
    'app/settings/language'
  ];

  routePaths.forEach(routePath => {
    const pagePath = path.join(routePath, 'page.tsx');
    if (!fs.existsSync(pagePath)) {
      // Create directory if it doesn't exist
      if (!fs.existsSync(routePath)) {
        fs.mkdirSync(routePath, { recursive: true });
        console.log(`Created directory: ${routePath}`);
      }
      
      // Create a basic placeholder page
      const placeholder = `"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useLanguage } from "@/app/i18n/LanguageContext";
import { cn } from "@/lib/utils";

export default function PlaceholderPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const { language, isKurdish } = useLanguage();
  
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-purple-950 to-indigo-950 text-white">
      <div className="p-4 flex items-center">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => router.back()}
          className={cn("rounded-full text-white hover:bg-white/10", isKurdish ? "ml-2" : "mr-2")}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-semibold">
          {isKurdish ? "پەڕەی کاتی" : "Placeholder Page"}
        </h1>
      </div>
      
      <div className="px-4 py-6 flex-1">
        <div className="bg-indigo-900/50 backdrop-blur-sm rounded-xl border border-purple-500/20 p-8 text-center">
          <p className={cn("text-lg text-purple-300", isKurdish && "text-right")}>
            {isKurdish 
              ? "ئەم بەشە بەم زووانە بەردەست دەبێت."
              : "This feature will be available soon."}
          </p>
        </div>
      </div>
    </div>
  );
}`;
      
      fs.writeFileSync(pagePath, placeholder);
      console.log(`Created placeholder page: ${pagePath}`);
    }
  });

  console.log('Starting rebuild process...');
  
  // Run npm install to ensure all dependencies are properly installed
  console.log('Running npm install...');
  execSync('npm install', { stdio: 'inherit' });
  
  // Build the application
  console.log('Building application...');
  execSync('npm run build', { stdio: 'inherit' });
  
  console.log('Rebuild completed successfully!');
} catch (error) {
  console.error('Error during rebuild process:', error);
  process.exit(1);
} 