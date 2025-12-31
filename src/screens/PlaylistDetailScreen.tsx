import {
  View,
  Text,
  Image,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { useEffect, useState } from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';
import axios from 'axios';

import SongCard from '../components/SongCard';
import MiniPlayer from '../components/MiniPlayer';
import { usePlayerStore } from '../store/playerStore';

import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { decodeHtmlEntities } from '../utils/htmlDecoder';

export default function PlaylistDetailScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { playlistId } = route.params;

  const [playlist, setPlaylist] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const clearQueue = usePlayerStore(state => state.clearQueue);
  const addToQueue = usePlayerStore(state => state.addToQueue);
  const setSong = usePlayerStore(state => state.setSong);

  useEffect(() => {
    let mounted = true;

    axios
      .get(`https://saavn.sumit.co/api/playlists?id=${playlistId}`)
      .then(res => {
        if (mounted) {
          setPlaylist(res.data?.data || null);
        }
      })
      .catch(err => {
        console.error('Error fetching playlist:', err);
        if (mounted) setPlaylist(null);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [playlistId]);

  /* ---------- Loading ---------- */
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  /* ---------- Error ---------- */
  if (!playlist) {
    return (
      <View style={styles.center}>
        <Text style={{ color: colors.muted }}>Playlist not found</Text>
      </View>
    );
  }

  const imageUri =
    playlist.image?.[playlist.image.length - 1]?.url || null;

  const playlistName = decodeHtmlEntities(playlist.name || 'Playlist');
  const description = decodeHtmlEntities(playlist.description || '');

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      {/* ---------- Playlist Header ---------- */}
      <View style={styles.header}>
        {imageUri && (
          <Image source={{ uri: imageUri }} style={styles.image} />
        )}

        <Text style={styles.title}>{playlistName}</Text>

        {description ? (
          <Text style={styles.description} numberOfLines={3}>
            {description}
          </Text>
        ) : null}

        {playlist.songCount && (
          <Text style={styles.meta}>
            {playlist.songCount} songs
          </Text>
        )}
      </View>

      {/* ---------- Songs ---------- */}
      <FlatList
        data={playlist.songs || []}
        keyExtractor={(item, index) =>
          item?.id ? String(item.id) : `song-${index}`
        }
        renderItem={({ item, index }) => (
          <SongCard
            song={item}
            onPress={async () => {
              // 1️⃣ Clear old queue
              clearQueue();

              // 2️⃣ Add full playlist to queue
              playlist.songs.forEach((song: any) => {
                addToQueue(song);
              });

              // 3️⃣ Start selected song
              await setSong(playlist.songs[index]);

              // 4️⃣ Navigate to player
              navigation.navigate('Player');
            }}
          />
        )}
        contentContainerStyle={{ paddingBottom: 120 }}
      />

      <MiniPlayer />
    </View>
  );
}

/* ---------- Styles ---------- */
const styles = StyleSheet.create({
  center: {
    flex: 1,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    padding: spacing.l,
  },
  image: {
    width: 220,
    height: 220,
    borderRadius: 16,
    marginBottom: spacing.m,
  },
  title: {
    color: colors.text,
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  description: {
    color: colors.muted,
    fontSize: 14,
    marginTop: spacing.s,
    textAlign: 'center',
  },
  meta: {
    color: colors.muted,
    fontSize: 14,
    marginTop: spacing.s,
  },
});
