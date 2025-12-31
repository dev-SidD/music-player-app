import {
  View,
  TextInput,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { useEffect, useState } from 'react';
import axios from 'axios';

import PlaylistCard from '../components/PlaylistCard';
import MiniPlayer from '../components/MiniPlayer';
import AppTopHeader from '../components/AppTopHeader';

import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

export default function PlaylistsScreen() {
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [query, setQuery] = useState('arijit');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setPlaylists([]);
      return;
    }

    setLoading(true);

    axios
      .get(`https://saavn.sumit.co/api/search/playlists?query=${query}`)
      .then(res => {
        const results = res.data?.data?.results || [];
        setPlaylists(Array.isArray(results) ? results : []);
      })
      .catch(() => setPlaylists([]))
      .finally(() => setLoading(false));
  }, [query]);

  return (
    <View style={styles.container}>
      {/* ---------- COMMON APP HEADER (LOGO) ---------- */}
      <AppTopHeader />

      {/* ---------- Search ---------- */}
      <TextInput
        placeholder="Search playlists..."
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
          data={playlists}
          keyExtractor={(item, index) =>
            item?.id ? String(item.id) : `playlist-${index}`
          }
          renderItem={({ item }) => (
            <PlaylistCard playlist={item} />
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
