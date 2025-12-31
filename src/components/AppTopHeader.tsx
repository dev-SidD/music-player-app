import { View, Text, StyleSheet, Image } from 'react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

export default function AppTopHeader() {
  return (
    <View style={styles.container}>
      {/* Logo (optional image) */}
      {/* 
      <Image
        source={require('../assets/logo.png')}
        style={styles.logo}
      /> 
      */}

      {/* App Name */}
      <Text style={styles.title}>MusicX</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 60,
    backgroundColor: colors.bg,
    justifyContent: 'center',
    paddingHorizontal: spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: colors.card,
  },
  title: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  logo: {
    width: 32,
    height: 32,
  },
});
