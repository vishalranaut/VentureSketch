import { StyleSheet, Text, View, Pressable } from 'react-native';
import { colors, spacing, typography, radii } from '@venture-sketch/theme';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>VentureSketch</Text>
        <Text style={styles.subtitle}>The premium workspace for your next big idea.</Text>
        
        <Pressable style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}>
          <Text style={styles.buttonText}>Get Started</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: parseInt(spacing.lg, 10),
  },
  card: {
    backgroundColor: colors.surface,
    padding: parseInt(spacing.xl, 10),
    borderRadius: parseInt(radii.xl, 10),
    width: '100%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  title: {
    fontSize: parseInt(typography.fontSize['3xl'], 10),
    fontWeight: 'bold',
    marginBottom: parseInt(spacing.sm, 10),
    color: colors.primary,
  },
  subtitle: {
    fontSize: parseInt(typography.fontSize.base, 10),
    textAlign: 'center',
    color: colors.textSecondary,
    marginBottom: parseInt(spacing.xl, 10),
  },
  button: {
    backgroundColor: colors.secondary,
    paddingVertical: parseInt(spacing.md, 10),
    paddingHorizontal: parseInt(spacing.xl, 10),
    borderRadius: parseInt(radii.full, 10),
    width: '100%',
    alignItems: 'center',
  },
  buttonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  buttonText: {
    color: colors.textPrimary,
    fontWeight: 'bold',
    fontSize: parseInt(typography.fontSize.lg, 10),
  }
});
