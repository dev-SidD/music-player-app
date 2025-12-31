import {
  View,
  TextInput,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

import SongCard from '../components/SongCard';
import MiniPlayer from '../components/MiniPlayer';
import AppTopHeader from '../components/AppTopHeader';
import { usePlayerStore } from '../store/playerStore';

import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

export default function HomeScreen() {
  const navigation = useNavigation<any>();

  const setSong = usePlayerStore(state => state.setSong);
  const clearQueue = usePlayerStore(state => state.clearQueue);
  const addToQueue = usePlayerStore(state => state.addToQueue);

  const [songs, setSongs] = useState<any[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setSongs([]);
      return;
    }

    setLoading(true);

    axios
      .get(`https://saavn.sumit.co/api/search/songs?query=${query}`)
      .then(res => {
        const results = res.data?.data?.results || [];
        setSongs(Array.isArray(results) ? results : []);
      })
      .catch(() => setSongs([]))
      .finally(() => setLoading(false));
  }, [query]);

  return (
    <View style={styles.container}>
      {/* ---------- COMMON APP HEADER (LOGO) ---------- */}
      <AppTopHeader />

      {/* ---------- Search ---------- */}
      <TextInput
        placeholder="Search songs..."
        placeholderTextColor={colors.muted}
        value={query}
        onChangeText={setQuery}
        style={styles.searchInput}
      />

      {/* ---------- Results ---------- */}
      {loading ? (
        <ActivityIndicator
          color={colors.primary}
          style={styles.loader}
        />
      ) : (
        <FlatList
          data={songs}
          keyExtractor={(item, i) =>
            item?.id ? String(item.id) : `song-${i}`
          }
          renderItem={({ item, index }) => (
            <SongCard
              song={item}
              onPress={async () => {
                // 1️⃣ Clear old queue
                clearQueue();

                // 2️⃣ Add all search results to queue
                songs.forEach(song => addToQueue(song));

                // 3️⃣ Play selected song
                await setSong(songs[index]);

                // 4️⃣ Go to Player
                navigation.navigate('Player');
              }}
            />
          )}
          contentContainerStyle={styles.listContent}
        />
      )}

      <MiniPlayer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  searchInput: {
    margin: spacing.m,
    padding: spacing.m,
    borderRadius: 14,
    backgroundColor: colors.card,
    color: colors.text,
    fontSize: 16,
  },
  loader: {
    marginTop: spacing.xl,
  },
  listContent: {
    paddingBottom: 120, // space for MiniPlayer
  },
});
