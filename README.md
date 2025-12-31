# 🎵 Music Streaming App (React Native + Expo)

A modern music streaming mobile application built using **React Native (Expo)**.  
The app supports searching and playing songs, albums, artists, and playlists with **queue management**, **mini player**, and **background playback**.

---

## ✨ Features

- 🔍 Search Songs, Albums, Artists & Playlists
- ▶️ Play music with background & silent mode support
- 📃 Smart Queue Management
  - Album → full album queue
  - Artist → all artist songs queue
  - Playlist → full playlist queue
  - Search → search results queue
- ⏭️ Next / Previous song support
- 🎧 Mini Player (persistent)
- 📱 Full Player Screen
- 🎨 Clean UI with reusable components
- 💾 Queue persistence using AsyncStorage

---

## 🧱 Architecture Overview

src/
├── components/ # Reusable UI components
│ ├── SongCard.tsx

│ ├── AlbumCard.tsx

│ ├── ArtistCard.tsx

│ ├── PlaylistCard.tsx

│ ├── MiniPlayer.tsx

│ └── AppTopHeader.tsx
│
├── screens/ # App screens

│ ├── HomeScreen.tsx

│ ├── AlbumsScreen.tsx

│ ├── ArtistsScreen.tsx

│ ├── PlaylistsScreen.tsx

│ ├── AlbumDetailScreen.tsx

│ ├── PlaylistDetailScreen.tsx

│ ├── ArtistSongsScreen.tsx

│ └── PlayerScreen.tsx
│
├── store/ # Global state (Zustand)

│ └── playerStore.ts
│
├── navigation/ # Navigation setup

│ └── AppNavigator.tsx
│
├── theme/ # Colors & spacing

│ ├── colors.ts

│ └── spacing.ts
│
├── utils/ # Helpers

│ └── htmlDecoder.ts
│
└── App.tsx

---

## 🧠 State Management

- **Zustand** is used for global player state:
  - current song
  - queue
  - playback status
  - position & duration

Why Zustand?
- Simple API
- No boilerplate
- Perfect for media players

---

## 🔊 Audio Handling

- Powered by **expo-av**
- Supports:
  - Background playback
  - Silent mode (iOS)
  - Queue-based playback
  - Auto-play next song when current ends

---

## 🌐 API Used

- Music data fetched from:
  https://saavn.sumit.co


Includes:
- Songs
- Albums
- Artists
- Playlists

---

## 🚀 Setup Instructions

### 1️⃣ Clone Repository
```bash
git clone https://github.com/<your-username>/<repo-name>.git
cd <repo-name>
2️⃣ Install Dependencies
npm install

3️⃣ Start App
npx expo start

Scan QR using Expo Go app.

⚠️ Trade-offs & Decisions
❌ No authentication

1. Keeps the app simple
2. Focus on core playback features

❌ No downloads

1. Streaming only
2. Avoids storage permissions

✅ Queue-first design

1. Ensures predictable playback behavior
2. Matches real-world music apps

🧑‍💻 Tech Stack

1. React Native (Expo)
2. TypeScript
3. Zustand
4. Expo AV
5. React Navigation
6. Axios

🙌 Author

Siddharth Singh
ECE @ IIIT Kota
Passionate about Full-Stack Development 🚀


---

### ✅ What to do now
1. Copy everything above
2. Paste into `README.md`
3. Commit & push

If you want next:
- 📸 Screenshot section
- 🏷️ GitHub repo description
- 📱 Play Store-ready README
- 🎨 App logo & banner

Just tell me 👍
