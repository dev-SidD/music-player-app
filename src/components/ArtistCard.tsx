import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { decodeHtmlEntities } from '../utils/htmlDecoder';

type ArtistCardProps = {
  artist: any;
};

export default function ArtistCard({ artist }: ArtistCardProps) {
  const navigation = useNavigation<any>();

  if (!artist || typeof artist !== 'object') return null;

  const imageUri =
    artist.image?.[artist.image.length - 1]?.url || null;

  const artistName = decodeHtmlEntities(artist.name || 'Unknown Artist');

  const artistRole =
    decodeHtmlEntities(artist.role || artist.type || 'Artist');

  return (
    <Pressable
      onPress={() =>
        navigation.navigate('ArtistSongs', {
          artistId: artist.id,
          artistName: artist.name,
        })
      }
      style={styles.container}
    >
      {imageUri ? (
        <Image
          source={{ uri: imageUri }}
          style={styles.artistImage}
        />
      ) : (
        <View style={[styles.artistImage, styles.artistImagePlaceholder]}>
          <Text style={styles.placeholderText}>♪</Text>
        </View>
      )}

      <View style={styles.artistInfo}>
        <Text style={styles.artistName} numberOfLines={1}>
          {artistName}
        </Text>

        <Text style={styles.artistRole} numberOfLines={1}>
          {artistRole}
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
  artistImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: spacing.m,
  },
  artistImagePlaceholder: {
    backgroundColor: colors.card,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: colors.muted,
    fontSize: 24,
  },
  artistInfo: {
    flex: 1,
  },
  artistName: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  artistRole: {
    color: colors.muted,
    fontSize: 14,
    marginTop: 2,
  },
});
