import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
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

export default function ArtistSongsScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();

  const { artistId, artistName } = route.params;

  const [songs, setSongs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const clearQueue = usePlayerStore(state => state.clearQueue);
  const addToQueue = usePlayerStore(state => state.addToQueue);
  const setSong = usePlayerStore(state => state.setSong);

  useEffect(() => {
    axios
      .get(`https://saavn.sumit.co/api/artists/${artistId}/songs`)
      .then(res => {
        const songsData = res.data?.data?.songs || [];
        setSongs(Array.isArray(songsData) ? songsData : []);
      })
      .catch(err => {
        console.error('Error fetching artist songs:', err);
        setSongs([]);
      })
      .finally(() => setLoading(false));
  }, [artistId]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      {/* ---------- Header ---------- */}
      <Text
        style={{
          color: colors.text,
          fontSize: 22,
          fontWeight: 'bold',
          padding: spacing.m,
        }}
      >
        {decodeHtmlEntities(artistName)}
      </Text>

      {/* ---------- Songs ---------- */}
      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} />
      ) : (
        <FlatList
          data={songs}
          keyExtractor={(item, index) =>
            item?.id ? String(item.id) : `song-${index}`
          }
          renderItem={({ item, index }) => (
            <SongCard
              song={item}
              onPress={async () => {
                // 🔥 CORE ARTIST QUEUE LOGIC

                // 1️⃣ Clear old queue
                clearQueue();

                // 2️⃣ Add all artist songs
                songs.forEach(song => addToQueue(song));

                // 3️⃣ Start playback from tapped song
                await setSong(songs[index]);

                navigation.navigate('Player');
              }}
            />
          )}
          contentContainerStyle={{ paddingBottom: 120 }}
        />
      )}

      <MiniPlayer />
    </View>
  );
}
