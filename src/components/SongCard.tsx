import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { decodeHtmlEntities } from '../utils/htmlDecoder';

export default function SongCard({ song, onPress }: any) {
  if (!song) return null;

  const imageUri =
    song.image?.[song.image.length - 1]?.url || null;

  const artistNames =
    song.artists?.primary?.map((a: any) => a.name).join(', ') || 'Unknown Artist';

  return (
    <Pressable
      onPress={onPress}
      android_ripple={{ color: colors.cardAlt }}
      style={({ pressed }) => [
        styles.container,
        pressed && { opacity: 0.7 },
      ]}
    >
      {imageUri ? (
        <Image source={{ uri: imageUri }} style={styles.image} />
      ) : (
        <View style={[styles.image, styles.placeholder]}>
          <Text style={styles.placeholderText}>♪</Text>
        </View>
      )}

      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>
          {decodeHtmlEntities(song.name)}
        </Text>
        <Text style={styles.subtitle} numberOfLines={1}>
          {decodeHtmlEntities(artistNames)}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.m,
    paddingHorizontal: spacing.l,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  image: {
    width: 56,
    height: 56,
    borderRadius: 8,
    marginRight: spacing.m,
  },
  placeholder: {
    backgroundColor: colors.cardAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    color: colors.muted,
    fontSize: 22,
  },
  info: {
    flex: 1,
  },
  title: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  subtitle: {
    color: colors.muted,
    fontSize: 13,
    marginTop: 2,
  },
});
