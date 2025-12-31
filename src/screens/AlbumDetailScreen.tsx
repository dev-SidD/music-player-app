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

export default function AlbumDetailScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { albumId } = route.params;

  const [album, setAlbum] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const clearQueue = usePlayerStore(state => state.clearQueue);
  const addToQueue = usePlayerStore(state => state.addToQueue);
  const setSong = usePlayerStore(state => state.setSong);

  useEffect(() => {
    let mounted = true;

    axios
      .get(`https://saavn.sumit.co/api/albums?id=${albumId}`)
      .then(res => {
        if (mounted) {
          setAlbum(res.data?.data || null);
        }
      })
      .catch(err => {
        console.error('Error fetching album:', err);
        if (mounted) setAlbum(null);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [albumId]);

  /* ---------- Loading ---------- */
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  /* ---------- Error ---------- */
  if (!album) {
    return (
      <View style={styles.center}>
        <Text style={{ color: colors.muted }}>Album not found</Text>
      </View>
    );
  }

  const imageUri =
    album.image?.[album.image.length - 1]?.url || null;

  const artistNames =
    album.artists?.primary
      ?.map((a: any) => a.name)
      .join(', ') || 'Unknown Artist';

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      {/* ---------- Album Header ---------- */}
      <View style={styles.header}>
        {imageUri && (
          <Image source={{ uri: imageUri }} style={styles.albumImage} />
        )}

        <Text style={styles.albumName}>
          {decodeHtmlEntities(album.name)}
        </Text>

        <Text style={styles.artistName}>
          {decodeHtmlEntities(artistNames)}
        </Text>

        {album.year && (
          <Text style={styles.meta}>
            {album.year} • {album.language}
          </Text>
        )}
      </View>

      {/* ---------- Songs ---------- */}
      <FlatList
        data={album.songs || []}
        keyExtractor={(item, index) =>
          item?.id ? String(item.id) : `song-${index}`
        }
        renderItem={({ item, index }) => (
          <SongCard
            song={item}
            onPress={async () => {
              // 1️⃣ Clear old queue
              clearQueue();

              // 2️⃣ Add full album to queue
              album.songs.forEach((song: any) => {
                addToQueue(song);
              });

              // 3️⃣ Start selected song
              await setSong(album.songs[index]);

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
  albumImage: {
    width: 220,
    height: 220,
    borderRadius: 16,
    marginBottom: spacing.m,
  },
  albumName: {
    color: colors.text,
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  artistName: {
    color: colors.muted,
    fontSize: 16,
    marginTop: 4,
  },
  meta: {
    color: colors.muted,
    fontSize: 14,
    marginTop: 4,
  },
});
