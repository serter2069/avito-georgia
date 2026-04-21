import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Homepage from '../components/screens/Homepage';

export default function IndexPage() {
  return <SafeAreaView edges={['top']} style={{ flex: 1 }}><ScrollView><Homepage showHeader={false} showBottomNav={false} /></ScrollView></SafeAreaView>;
}
