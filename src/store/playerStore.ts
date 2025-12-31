import { create } from 'zustand';
import { Audio } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';

type PlayerState = {
  currentSong: any;
  isPlaying: boolean;
  sound: Audio.Sound | null;
  isLoading: boolean;
  position: number;
  duration: number;
  queue: any[];
  currentIndex: number;
  setSong: (song: any) => Promise<void>;
  addToQueue: (song: any) => void;
  removeFromQueue: (songId: string) => void;
  clearQueue: () => void;
  nextSong: () => Promise<void>;
  previousSong: () => Promise<void>;
  togglePlay: () => Promise<void>;
  stop: () => Promise<void>;
  seekTo: (position: number) => Promise<void>;
  updatePosition: () => Promise<void>;
  unloadSound: () => Promise<void>;
  loadQueue: () => Promise<void>;
  saveQueue: () => Promise<void>;
};

// Global reference to ensure only one sound instance
let currentSoundInstance: Audio.Sound | null = null;
let positionUpdateInterval: NodeJS.Timeout | null = null;

const QUEUE_STORAGE_KEY = '@music_player_queue';
const CURRENT_INDEX_STORAGE_KEY = '@music_player_current_index';

export const usePlayerStore = create<PlayerState>((set, get) => ({
  currentSong: null,
  isPlaying: false,
  sound: null,
  isLoading: false,
  position: 0,
  duration: 0,
  queue: [],
  currentIndex: -1,

  setSong: async (song: any) => {
    const { currentSong: existingSong, queue, addToQueue } = get();
    
    // If it's the same song, don't reload
    if (existingSong && song && existingSong.id === song.id && currentSoundInstance) {
      return;
    }

    // Add to queue if not already there
    const songIndex = queue.findIndex((s: any) => s.id === song.id);
    if (songIndex === -1) {
      addToQueue(song);
      const updatedQueue = get().queue;
      const newIndex = updatedQueue.length - 1;
      set({ currentIndex: newIndex });
    } else {
      set({ currentIndex: songIndex });
    }
    
    // Stop and unload previous song FIRST - this is critical
    if (currentSoundInstance) {
      try {
        const status = await currentSoundInstance.getStatusAsync();
        if (status.isLoaded) {
          if (status.isPlaying) {
            await currentSoundInstance.stopAsync();
          }
          await currentSoundInstance.unloadAsync();
        }
      } catch (error) {
        console.error('Error stopping previous sound:', error);
        // Force unload even if stop failed
        try {
          await currentSoundInstance.unloadAsync();
        } catch (unloadError) {
          console.error('Error unloading sound:', unloadError);
        }
      }
      currentSoundInstance = null;
    }
    
    // Clear state
    set({ sound: null, isPlaying: false });

    if (!song) {
      set({ currentSong: null, isPlaying: false, sound: null });
      return;
    }

    set({ currentSong: song, isLoading: true, isPlaying: false, sound: null });

    try {
      // Get audio URL from song
      let audioUrl = 
        song.downloadUrl?.[song.downloadUrl.length - 1]?.link ||
        song.downloadUrl?.[0]?.link ||
        song.media_url ||
        song.mediaUrl ||
        song.url ||
        song.downloadUrl;

      if (!audioUrl && typeof song.downloadUrl === 'string') {
        audioUrl = song.downloadUrl;
      }

      if (Array.isArray(song.downloadUrl) && song.downloadUrl.length > 0) {
        const lastItem = song.downloadUrl[song.downloadUrl.length - 1];
        audioUrl = lastItem?.link || lastItem?.url || audioUrl;
      }

      if (!audioUrl) {
        console.error('No audio URL found for song:', song);
        set({ isLoading: false });
        return;
      }

      // Configure audio mode
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
        shouldDuckAndroid: true,
      });

      // Create and load new sound
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: audioUrl },
        { shouldPlay: true }
      );

      // Update global reference
      currentSoundInstance = newSound;

      // Get initial duration
      const status = await newSound.getStatusAsync();
      const duration = status.isLoaded ? (status.durationMillis || 0) / 1000 : 0;

      set({ 
        sound: newSound, 
        isPlaying: true, 
        isLoading: false,
        position: 0,
        duration: duration
      });

      // Start position updates with end detection
      startPositionUpdates(newSound, async () => {
        // When song ends, play next
        const { queue } = get();
        if (queue.length > 0) {
          await get().nextSong();
        }
      });
    } catch (error) {
      console.error('Error loading audio:', error);
      set({ isLoading: false, isPlaying: false });
      currentSoundInstance = null;
    }
  },

  addToQueue: (song: any) => {
    const { queue } = get();
    // Don't add if already in queue
    if (queue.some((s: any) => s.id === song.id)) {
      return;
    }
    const newQueue = [...queue, song];
    set({ queue: newQueue });
    get().saveQueue();
  },

  removeFromQueue: (songId: string) => {
    const { queue, currentIndex, currentSong } = get();
    const newQueue = queue.filter((s: any) => s.id !== songId);
    let newIndex = currentIndex;
    
    // Adjust current index if needed
    if (currentIndex >= newQueue.length) {
      newIndex = newQueue.length - 1;
    } else if (currentSong && currentSong.id === songId) {
      // If removing current song, play next or previous
      if (newQueue.length > 0) {
        newIndex = Math.min(currentIndex, newQueue.length - 1);
      } else {
        newIndex = -1;
      }
    } else {
      // Adjust index if song before current was removed
      const removedIndex = queue.findIndex((s: any) => s.id === songId);
      if (removedIndex < currentIndex) {
        newIndex = currentIndex - 1;
      }
    }

    set({ queue: newQueue, currentIndex: newIndex });
    get().saveQueue();

    // If current song was removed, play new current
    if (currentSong && currentSong.id === songId && newQueue.length > 0) {
      get().setSong(newQueue[newIndex]);
    }
  },

  clearQueue: () => {
    set({ queue: [], currentIndex: -1 });
    get().saveQueue();
  },

  nextSong: async () => {
    const { queue, currentIndex } = get();
    if (queue.length === 0) return;

    const nextIndex = currentIndex < queue.length - 1 ? currentIndex + 1 : 0; // Loop to start
    const nextSong = queue[nextIndex];
    
    if (nextSong) {
      set({ currentIndex: nextIndex });
      await get().setSong(nextSong);
    }
  },

  previousSong: async () => {
    const { queue, currentIndex } = get();
    if (queue.length === 0) return;

    const prevIndex = currentIndex > 0 ? currentIndex - 1 : queue.length - 1; // Loop to end
    const prevSong = queue[prevIndex];
    
    if (prevSong) {
      set({ currentIndex: prevIndex });
      await get().setSong(prevSong);
    }
  },

  togglePlay: async () => {
    const { sound } = get();
    
    if (!sound) {
      const { currentSong, setSong } = get();
      if (currentSong) {
        await setSong(currentSong);
      }
      return;
    }

    try {
      const status = await sound.getStatusAsync();
      
      if (!status.isLoaded) {
        console.warn('Sound is not loaded yet');
        return;
      }

      if (status.isPlaying) {
        await sound.pauseAsync();
        set({ isPlaying: false });
      } else {
        await sound.playAsync();
        set({ isPlaying: true });
      }
    } catch (error) {
      console.error('Error toggling play:', error);
    }
  },

  stop: async () => {
    const { sound } = get();
    if (sound) {
      try {
        await sound.stopAsync();
        set({ isPlaying: false });
      } catch (error) {
        console.error('Error stopping audio:', error);
      }
    }
  },

  seekTo: async (position: number) => {
    const { sound } = get();
    if (sound) {
      try {
        await sound.setPositionAsync(position * 1000); // Convert to milliseconds
        set({ position });
      } catch (error) {
        console.error('Error seeking:', error);
      }
    }
  },

  updatePosition: async () => {
    const { sound } = get();
    if (sound) {
      try {
        const status = await sound.getStatusAsync();
        if (status.isLoaded) {
          const position = (status.positionMillis || 0) / 1000;
          const duration = (status.durationMillis || 0) / 1000;
          set({ position, duration });
        }
      } catch (error) {
        console.error('Error updating position:', error);
      }
    }
  },

  unloadSound: async () => {
    // Stop position updates
    stopPositionUpdates();
    
    const { sound } = get();
    const soundToUnload = sound || currentSoundInstance;
    
    if (soundToUnload) {
      try {
        const status = await soundToUnload.getStatusAsync();
        if (status.isLoaded && status.isPlaying) {
          await soundToUnload.stopAsync();
        }
        await soundToUnload.unloadAsync();
      } catch (error) {
        console.error('Error unloading sound:', error);
      }
      currentSoundInstance = null;
      set({ sound: null, isPlaying: false, position: 0, duration: 0 });
    }
  },

  loadQueue: async () => {
    try {
      const [savedQueue, savedIndex] = await Promise.all([
        AsyncStorage.getItem(QUEUE_STORAGE_KEY),
        AsyncStorage.getItem(CURRENT_INDEX_STORAGE_KEY),
      ]);

      if (savedQueue) {
        const queue = JSON.parse(savedQueue);
        const currentIndex = savedIndex ? parseInt(savedIndex, 10) : -1;
        set({ queue, currentIndex });
      }
    } catch (error) {
      console.error('Error loading queue:', error);
    }
  },

  saveQueue: async () => {
    try {
      const { queue, currentIndex } = get();
      await Promise.all([
        AsyncStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(queue)),
        AsyncStorage.setItem(CURRENT_INDEX_STORAGE_KEY, currentIndex.toString()),
      ]);
    } catch (error) {
      console.error('Error saving queue:', error);
    }
  },
}));

// Helper functions for position updates
function startPositionUpdates(sound: Audio.Sound, onEnd?: () => void) {
  stopPositionUpdates(); // Clear any existing interval
  
  positionUpdateInterval = setInterval(async () => {
    try {
      const status = await sound.getStatusAsync();
      if (status.isLoaded) {
        const position = (status.positionMillis || 0) / 1000;
        const duration = (status.durationMillis || 0) / 1000;
        usePlayerStore.setState({ position, duration });

        // Check if song ended
        if (status.didJustFinish && onEnd) {
          onEnd();
        }
      }
    } catch (error) {
      // Sound might be unloaded, stop updates
      stopPositionUpdates();
    }
  }, 500); // Update every 500ms
}

function stopPositionUpdates() {
  if (positionUpdateInterval) {
    clearInterval(positionUpdateInterval);
    positionUpdateInterval = null;
  }
}
