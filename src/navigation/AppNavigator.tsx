import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from '../screens/HomeScreen';
import ArtistsScreen from '../screens/ArtistsScreen';
import AlbumsScreen from '../screens/AlbumsScreen';
import PlaylistsScreen from '../screens/PlaylistsScreen';

import PlayerScreen from '../screens/PlayerScreen';
import ArtistSongsScreen from '../screens/ArtistSongsScreen';
import AlbumDetailScreen from '../screens/AlbumDetailScreen';
import PlaylistDetailScreen from '../screens/PlaylistDetailScreen';

import { colors } from '../theme/colors';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

/* ---------------- Bottom Tabs ---------------- */
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.bg,
          borderTopColor: colors.card,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
        tabBarIcon: ({ color, size, focused }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          switch (route.name) {
            case 'Songs':
              iconName = focused
                ? 'musical-notes'
                : 'musical-notes-outline';
              break;

            case 'Artists':
              iconName = focused
                ? 'people'
                : 'people-outline';
              break;

            case 'Albums':
              iconName = focused
                ? 'albums'
                : 'albums-outline';
              break;

            case 'Playlists':
              iconName = focused
                ? 'list'
                : 'list-outline';
              break;

            default:
              iconName = 'ellipse';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="Songs"
        component={HomeScreen}
        options={{ tabBarLabel: 'Songs' }}
      />

      <Tab.Screen
        name="Artists"
        component={ArtistsScreen}
        options={{ tabBarLabel: 'Artists' }}
      />

      <Tab.Screen
        name="Albums"
        component={AlbumsScreen}
        options={{ tabBarLabel: 'Albums' }}
      />

      <Tab.Screen
        name="Playlists"
        component={PlaylistsScreen}
        options={{ tabBarLabel: 'Playlists' }}
      />
    </Tab.Navigator>
  );
}

/* ---------------- Root Stack ---------------- */
export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          gestureEnabled: true,
        }}
      >
        {/* Bottom Tabs */}
        <Stack.Screen
          name="MainTabs"
          component={MainTabs}
        />

        {/* Full Screen Pages */}
        <Stack.Screen
          name="Player"
          component={PlayerScreen}
        />

        <Stack.Screen
          name="ArtistSongs"
          component={ArtistSongsScreen}
        />

        <Stack.Screen
          name="AlbumDetail"
          component={AlbumDetailScreen}
        />

        <Stack.Screen
          name="PlaylistDetail"
          component={PlaylistDetailScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
