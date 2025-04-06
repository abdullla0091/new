import Head from "next/head";
import Link from 'next/link';
import { useState, useMemo, ChangeEvent } from "react";
import styles from "@/styles/Explore.module.css"; // New CSS module for explore page
import { characters, Character } from "@/lib/characters"; // Import character data

// Reusable CharacterCard component (could be moved to a components folder)
const CharacterCard = ({ character }: { character: Character }) => (
  <Link href={`/chat/${character.id}`} className={styles.characterCard}>
    <div className={styles.cardPlaceholder}></div> {/* Placeholder for avatar */}
    <div className={styles.cardInfo}>
      <h3>{character.name}</h3>
      <p>{character.description}</p>
    </div>
    <div className={styles.cardTags}>
      {character.tags.slice(0, 3).map(tag => <span key={tag} className={styles.tag}>{tag}</span>)}
    </div>
  </Link>
);

export default function ExplorePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Get all unique tags from characters for filtering
  const allTags = useMemo(() => {
    const tagsSet = new Set<string>();
    characters.forEach(char => char.tags.forEach(tag => tagsSet.add(tag)));
    return Array.from(tagsSet).sort();
  }, []);

  // Filter characters based on search term and selected tag
  const filteredCharacters = useMemo(() => {
    return characters.filter(char => {
      const nameMatch = char.name.toLowerCase().includes(searchTerm.toLowerCase());
      const descriptionMatch = char.description.toLowerCase().includes(searchTerm.toLowerCase());
      const tagMatch = !selectedTag || char.tags.includes(selectedTag);
      return (nameMatch || descriptionMatch) && tagMatch;
    });
  }, [searchTerm, selectedTag]);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleTagClick = (tag: string | null) => {
    setSelectedTag(tag);
  };

  return (
    <>
      <Head>
        <title>Explore Characters</title>
        <meta name="description" content="Search and filter AI characters" />
      </Head>

      <div className={styles.exploreContainer}>
        <h1 className={styles.mainTitle}>Explore Characters</h1>

        {/* Search Input */}
        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Search by name or description..."
            value={searchTerm}
            onChange={handleSearchChange}
            className={styles.searchInput}
          />
          {/* Optional: Add a search icon button */}
        </div>

        {/* Tag Filters */}
        <div className={styles.tagFilterContainer}>
          <button
            className={`${styles.tagButton} ${!selectedTag ? styles.activeTag : ''}`}
            onClick={() => handleTagClick(null)}
          >
            All
          </button>
          {allTags.map(tag => (
            <button
              key={tag}
              className={`${styles.tagButton} ${selectedTag === tag ? styles.activeTag : ''}`}
              onClick={() => handleTagClick(tag)}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Character Grid */}
        {filteredCharacters.length > 0 ? (
          <div className={styles.characterGrid}>
            {filteredCharacters.map(char => (
              <CharacterCard key={char.id} character={char} />
            ))}
          </div>
        ) : (
          <p className={styles.noResults}>No characters found matching your criteria.</p>
        )}
      </div>
    </>
  );
}
