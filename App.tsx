import { useEffect } from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import { usePlayerStore } from './src/store/playerStore';

export default function App() {
  const loadQueue = usePlayerStore(state => state.loadQueue);

  useEffect(() => {
    // Load queue when app starts
    loadQueue();
  }, []);

  return <AppNavigator />;
}
