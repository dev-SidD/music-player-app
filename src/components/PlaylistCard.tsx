import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { decodeHtmlEntities } from '../utils/htmlDecoder';

type PlaylistCardProps = {
  playlist: any;
};

export default function PlaylistCard({ playlist }: PlaylistCardProps) {
  const navigation = useNavigation<any>();

  if (!playlist || typeof playlist !== 'object') return null;

  const imageUri =
    playlist.image?.[playlist.image.length - 1]?.url || null;

  const playlistName =
    decodeHtmlEntities(playlist.name || 'Unknown Playlist');

  const subtitle =
    decodeHtmlEntities(playlist.subtitle || playlist.type || 'Playlist');

  return (
    <Pressable
      onPress={() =>
        navigation.navigate('PlaylistDetail', {
          playlistId: playlist.id, // ✅ ONLY ID
        })
      }
      style={styles.container}
    >
      {imageUri ? (
        <Image source={{ uri: imageUri }} style={styles.image} />
      ) : (
        <View style={[styles.image, styles.imagePlaceholder]}>
          <Text style={styles.placeholderText}>🎵</Text>
        </View>
      )}

      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {playlistName}
        </Text>

        <Text style={styles.subtitle} numberOfLines={1}>
          {subtitle}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.m,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: spacing.m,
  },
  imagePlaceholder: {
    backgroundColor: colors.card,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: colors.muted,
    fontSize: 22,
  },
  info: {
    flex: 1,
  },
  name: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  subtitle: {
    color: colors.muted,
    fontSize: 14,
    marginTop: 2,
  },
});
