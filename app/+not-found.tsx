import { Link, Stack } from 'expo-router'
import { StyleSheet, Text, View } from 'react-native'

export default function NotFound() {
  return (
    <>
      <Stack.Screen options={{ title: 'Page Not Found' }} />
      <View style={styles.container}>
        <Text style={styles.title}>404</Text>
        <Text style={styles.subtitle}>Page not found</Text>
        <Link href="/" style={styles.link}>
          <Text>Go to Home</Text>
        </Link>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  title: { fontSize: 64, fontWeight: 'bold' },
  subtitle: { fontSize: 18, marginBottom: 20, color: '#666' },
  link: { marginTop: 16, paddingVertical: 12, paddingHorizontal: 24 },
})
