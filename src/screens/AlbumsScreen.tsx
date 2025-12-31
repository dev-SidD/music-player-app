import {
  View,
  TextInput,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { useEffect, useState } from 'react';
import axios from 'axios';

import AlbumCard from '../components/AlbumCard';
import MiniPlayer from '../components/MiniPlayer';
import AppTopHeader from '../components/AppTopHeader';

import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

export default function AlbumsScreen() {
  const [albums, setAlbums] = useState<any[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setAlbums([]);
      return;
    }

    setLoading(true);

    axios
      .get(`https://saavn.sumit.co/api/search/albums?query=${query}`)
      .then(res => {
        const results = res.data?.data?.results || [];
        setAlbums(Array.isArray(results) ? results : []);
      })
      .catch(() => setAlbums([]))
      .finally(() => setLoading(false));
  }, [query]);

  return (
    <View style={styles.container}>
      {/* ---------- COMMON APP HEADER (LOGO) ---------- */}
      <AppTopHeader />

      {/* ---------- Search ---------- */}
      <TextInput
        placeholder="Search albums..."
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
          data={albums}
          keyExtractor={(item, i) =>
            item?.id ? String(item.id) : `album-${i}`
          }
          renderItem={({ item }) => <AlbumCard album={item} />}
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
