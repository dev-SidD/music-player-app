import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { usePlayerStore } from '../store/playerStore';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { decodeHtmlEntities } from '../utils/htmlDecoder';

export default function MiniPlayer() {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const { currentSong, isPlaying, togglePlay, position, duration } = usePlayerStore();

  // Don't show on PlayerScreen
  if (route.name === 'Player') {
    return null;
  }

  // Don't show if no song is selected
  if (!currentSong) {
    return null;
  }

  const imageUri = currentSong.image?.[currentSong.image.length - 1]?.url || null;
  const artistNames = currentSong.artists?.primary
    ?.map((artist: any) => artist.name)
    .join(', ') || 'Unknown Artist';

  const decodedSongName = decodeHtmlEntities(currentSong.name || '');
  const decodedArtistNames = decodeHtmlEntities(artistNames);

  return (
    <Pressable
      style={styles.container}
      onPress={() => navigation.navigate('Player')}
    >
      <View style={styles.content}>
        {/* Album Art */}
        {imageUri ? (
          <Image
            source={{ uri: imageUri }}
            style={styles.albumArt}
            resizeMode="cover"
          />
        ) : (
          <View style={[styles.albumArt, styles.albumArtPlaceholder]}>
            <Text style={styles.placeholderText}>♪</Text>
          </View>
        )}

        {/* Song Info */}
        <View style={styles.songInfo}>
          <Text style={styles.songName} numberOfLines={1}>
            {decodedSongName}
          </Text>
          <Text style={styles.artistName} numberOfLines={1}>
            {decodedArtistNames}
          </Text>
        </View>

        {/* Play/Pause Button */}
        <Pressable
          onPress={(e) => {
            e.stopPropagation();
            togglePlay();
          }}
          style={styles.playButton}
        >
          <Text style={styles.playButtonIcon}>
            {isPlaying ? '⏸' : '▶'}
          </Text>
        </Pressable>
      </View>
      
      {/* Progress Bar */}
      <View style={styles.progressBarContainer}>
        <View 
          style={[
            styles.progressBar, 
            { width: `${duration > 0 ? (position / duration) * 100 : 0}%` }
          ]} 
        />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderTopColor: colors.bg,
    paddingBottom: spacing.m,
    paddingTop: spacing.s,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.m,
  },
  albumArt: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: spacing.m,
  },
  albumArtPlaceholder: {
    backgroundColor: colors.bg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: colors.muted,
    fontSize: 20,
  },
  songInfo: {
    flex: 1,
    marginRight: spacing.m,
  },
  songName: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  artistName: {
    color: colors.muted,
    fontSize: 12,
  },
  playButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButtonIcon: {
    color: '#FFFFFF',
    fontSize: 18,
    marginLeft: 2,
  },
  progressBarContainer: {
    height: 2,
    backgroundColor: colors.bg,
    width: '100%',
  },
  progressBar: {
    height: '100%',
    backgroundColor: colors.primary,
  },
});

