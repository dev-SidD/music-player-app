  import { View, Text, Image, Pressable, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
  import { useNavigation } from '@react-navigation/native';
  import { useEffect } from 'react';
  import Slider from '@react-native-community/slider';
  import { usePlayerStore } from '../store/playerStore';
  import { colors } from '../theme/colors';
  import { spacing } from '../theme/spacing';
  import { decodeHtmlEntities } from '../utils/htmlDecoder';
  import { formatTime } from '../utils/timeFormatter';

  export default function PlayerScreen() {
    const navigation = useNavigation<any>();
    const { 
      currentSong, 
      isPlaying, 
      isLoading, 
      position, 
      duration, 
      queue,
      togglePlay, 
      seekTo,
      nextSong,
      previousSong,
      loadQueue
    } = usePlayerStore();

    useEffect(() => {
      // Load queue on mount
      loadQueue();
    }, []);

    if (!currentSong) {
      return (
        <View style={styles.container}>
          <Text style={styles.emptyText}>No song selected</Text>
        </View>
      );
    }

    const imageUri = currentSong.image?.[currentSong.image.length - 1]?.url || null;
    const artistNames = currentSong.artists?.primary
      ?.map((artist: any) => artist.name)
      .join(', ') || 'Unknown Artist';

    const decodedSongName = decodeHtmlEntities(currentSong.name || '');
    const decodedArtistNames = decodeHtmlEntities(artistNames);

    return (
      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Pressable
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Text style={styles.backButtonText}>↓</Text>
          </Pressable>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>Now Playing</Text>
          </View>
          <View style={styles.headerRight} />
        </View>

        {/* Album Art */}
        <View style={styles.albumArtContainer}>
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
        </View>

        {/* Song Info */}
        <View style={styles.songInfoContainer}>
          <Text style={styles.songName} numberOfLines={2}>
            {decodedSongName}
          </Text>
          <Text style={styles.artistName} numberOfLines={1}>
            {decodedArtistNames}
          </Text>
        </View>

        {/* Seek Bar */}
        <View style={styles.seekBarContainer}>
          <Slider
            style={styles.seekBar}
            minimumValue={0}
            maximumValue={duration || 1}
            value={position}
            onSlidingComplete={(value) => seekTo(value)}
            minimumTrackTintColor={colors.primary}
            maximumTrackTintColor={colors.card}
            thumbTintColor={colors.primary}
          />
          <View style={styles.timeContainer}>
            <Text style={styles.timeText}>{formatTime(position)}</Text>
            <Text style={styles.timeText}>{formatTime(duration)}</Text>
          </View>
        </View>

        {/* Controls */}
        <View style={styles.controlsContainer}>
          <Pressable 
            style={[styles.controlButton, queue.length === 0 && styles.controlButtonDisabled]}
            onPress={previousSong}
            disabled={queue.length === 0}
          >
            <Text style={[styles.controlIcon, queue.length === 0 && styles.controlIconDisabled]}>⏮</Text>
          </Pressable>
          
          <Pressable
            onPress={togglePlay}
            style={[styles.playButton, isPlaying && styles.playButtonActive]}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.playButtonIcon}>
                {isPlaying ? '⏸' : '▶'}
              </Text>
            )}
          </Pressable>

          <Pressable 
            style={[styles.controlButton, queue.length === 0 && styles.controlButtonDisabled]}
            onPress={nextSong}
            disabled={queue.length === 0}
          >
            <Text style={[styles.controlIcon, queue.length === 0 && styles.controlIconDisabled]}>⏭</Text>
          </Pressable>
        </View>
      </ScrollView>
    );
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.bg,
    },
    contentContainer: {
      paddingBottom: spacing.xl,
      alignItems: 'center',
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
      paddingHorizontal: spacing.m,
      paddingTop: 50,
      paddingBottom: spacing.m,
    },
    backButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.card,
      justifyContent: 'center',
      alignItems: 'center',
    },
    backButtonText: {
      color: colors.text,
      fontSize: 20,
      fontWeight: 'bold',
    },
    headerCenter: {
      flex: 1,
      alignItems: 'center',
    },
    headerTitle: {
      color: colors.text,
      fontSize: 16,
      fontWeight: '600',
    },
    headerRight: {
      width: 40,
    },
    albumArtContainer: {
      width: '85%',
      aspectRatio: 1,
      maxWidth: 350,
      marginTop: spacing.l,
      marginBottom: spacing.xl,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.5,
      shadowRadius: 16,
      elevation: 12,
    },
    albumArt: {
      width: '100%',
      height: '100%',
      borderRadius: 20,
    },
    albumArtPlaceholder: {
      backgroundColor: colors.card,
      justifyContent: 'center',
      alignItems: 'center',
    },
    placeholderText: {
      color: colors.muted,
      fontSize: 60,
    },
    songInfoContainer: {
      alignItems: 'center',
      marginBottom: spacing.xl,
      paddingHorizontal: spacing.xl,
      width: '100%',
    },
    songName: {
      color: colors.text,
      fontSize: 26,
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: spacing.s,
    },
    artistName: {
      color: colors.muted,
      fontSize: 16,
      textAlign: 'center',
    },
    seekBarContainer: {
      width: '100%',
      paddingHorizontal: spacing.xl,
      marginBottom: spacing.xl,
    },
    seekBar: {
      width: '100%',
      height: 40,
      marginBottom: spacing.s,
    },
    timeContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
    },
    timeText: {
      color: colors.muted,
      fontSize: 12,
      fontWeight: '500',
    },
    controlsContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      paddingHorizontal: spacing.xl,
      gap: spacing.xl,
    },
    controlButton: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: colors.card,
      justifyContent: 'center',
      alignItems: 'center',
    },
    controlIcon: {
      color: colors.text,
      fontSize: 24,
    },
    controlButtonDisabled: {
      opacity: 0.3,
    },
    controlIconDisabled: {
      opacity: 0.5,
    },
    playButton: {
      backgroundColor: colors.primary,
      width: 80,
      height: 80,
      borderRadius: 40,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.5,
      shadowRadius: 12,
      elevation: 10,
    },
    playButtonActive: {
      backgroundColor: colors.primary,
    },
    playButtonIcon: {
      color: '#FFFFFF',
      fontSize: 36,
      marginLeft: 4,
    },
    emptyText: {
      color: colors.muted,
      fontSize: 18,
    },
  });

