import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { decodeHtmlEntities } from '../utils/htmlDecoder';

type AlbumCardProps = {
  album: any;
};

export default function AlbumCard({ album }: AlbumCardProps) {
  const navigation = useNavigation<any>();

  if (!album || typeof album !== 'object') return null;

  const imageUri =
    album.image?.[album.image.length - 1]?.url || null;

  const albumName =
    decodeHtmlEntities(album.name || 'Unknown Album');

  const artistName =
    decodeHtmlEntities(
      album.artists?.primary
        ?.map((a: any) => a.name)
        .join(', ') || 'Unknown Artist'
    );

  return (
    <Pressable
      onPress={() =>
        navigation.navigate('AlbumDetail', {
          albumId: album.id, // ✅ ONLY ID
        })
      }
      style={styles.container}
    >
      {imageUri ? (
        <Image source={{ uri: imageUri }} style={styles.albumImage} />
      ) : (
        <View style={[styles.albumImage, styles.albumImagePlaceholder]}>
          <Text style={styles.placeholderText}>♪</Text>
        </View>
      )}

      <View style={styles.albumInfo}>
        <Text style={styles.albumName} numberOfLines={1}>
          {albumName}
        </Text>

        <Text style={styles.artistName} numberOfLines={1}>
          {artistName}
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
    paddingHorizontal: spacing.m,
  },
  albumImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: spacing.m,
  },
  albumImagePlaceholder: {
    backgroundColor: colors.card,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: colors.muted,
    fontSize: 24,
  },
  albumInfo: {
    flex: 1,
  },
  albumName: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  artistName: {
    color: colors.muted,
    fontSize: 14,
    marginBottom: 2,
  },
  songCount: {
    color: colors.muted,
    fontSize: 12,
  },
});

