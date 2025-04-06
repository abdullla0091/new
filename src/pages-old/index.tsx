import Head from "next/head";
import Link from 'next/link';
import styles from "@/styles/HomeFeed.module.css"; // New CSS module for the home feed
import { characters, Character } from "@/lib/characters"; // Import character data

// Placeholder data - replace with actual logic later
const popularCharacters = characters.slice(0, 4); // Example: first 4
const trendingCharacters = characters.slice(1, 5); // Example: some overlap
const recentChats = [ // Example recent chats
  { characterId: 'h', lastMessage: 'See you later!', timestamp: '10m ago' },
  { characterId: 'dilan', lastMessage: 'Haha, that was funny.', timestamp: '1h ago' },
];

// Define a type for the chat data
interface RecentChat {
  characterId: string;
  lastMessage: string;
  timestamp: string;
}

// Helper component for character cards
const CharacterCard = ({ character }: { character: Character }) => (
  <Link href={`/chat/${character.id}`} className={styles.characterCard}>
    {/* Add character avatar here later */}
    {/* <img src={character.avatarUrl || '/default-avatar.png'} alt={character.name} /> */}
    <div className={styles.cardPlaceholder}></div> {/* Placeholder for avatar */}
    <div className={styles.cardInfo}>
      <h3>{character.name}</h3>
      <p>{character.description}</p>
    </div>
  </Link>
);

// Helper component for recent chat items
const RecentChatItem = ({ chat }: { chat: RecentChat }) => {
  const character = characters.find(c => c.id === chat.characterId);
  if (!character) return null;

  return (
    <Link href={`/chat/${character.id}`} className={styles.recentChatItem}>
      {/* Add character avatar here later */}
      <div className={styles.cardPlaceholder} style={{ width: '40px', height: '40px', flexShrink: 0 }}></div> {/* Smaller placeholder */}
      <div className={styles.recentChatInfo}>
        <h4>{character.name}</h4>
        <p>{chat.lastMessage}</p>
      </div>
      <span className={styles.recentChatTimestamp}>{chat.timestamp}</span>
    </Link>
  );
};


export default function HomePage() {
  return (
    <>
      <Head>
        <title>Chat Characters - Home</title>
        <meta name="description" content="Chat with AI characters" />
      </Head>

      <div className={styles.homeContainer}>
        <h1 className={styles.mainTitle}>Discover Characters</h1>

        {/* Section: Popular Characters */}
        <section className={styles.characterSection}>
          <h2>Popular Now</h2>
          <div className={styles.characterGrid}>
            {popularCharacters.map(char => (
              <CharacterCard key={char.id} character={char} />
            ))}
          </div>
        </section>

        {/* Section: Trending Characters */}
        <section className={styles.characterSection}>
          <h2>Trending</h2>
          <div className={styles.characterGrid}>
            {trendingCharacters.map(char => (
              <CharacterCard key={char.id} character={char} />
            ))}
          </div>
        </section>

        {/* Section: Recent Chats */}
        <section className={styles.recentChatsSection}>
          <h2>Recent Chats</h2>
          <div className={styles.recentChatsList}>
            {recentChats.length > 0 ? (
              recentChats.map((chat, index) => (
                <RecentChatItem key={index} chat={chat} />
              ))
            ) : (
              <p className={styles.noRecentChats}>No recent chats yet.</p>
            )}
          </div>
        </section>

      </div>
    </>
  );
}
