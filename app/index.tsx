import { ScrollView } from 'react-native';
import Homepage from '../components/screens/Homepage';

export default function IndexPage() {
  return <ScrollView><Homepage showHeader={false} showBottomNav={false} /></ScrollView>;
}
