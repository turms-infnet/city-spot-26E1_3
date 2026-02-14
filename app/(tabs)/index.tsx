import { Appbar, FAB, ListItem } from '@/components/customs';
import useLocations from '@/hooks/useLocations';
import { useSession } from '@/providers/SessionContext';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';

export default function HomeScreen() {
  const { locations, loading, syncLocation, setPage, setLimit, setSearch } = useLocations() as { locations: any[], loading: boolean, syncLocation: any, setPage: any, setLimit: any, setSearch: any };
  const { signOut } = useSession() as { signOut: any };
  const router = useRouter();
  const theme = useTheme();

  useEffect(() => {
    syncLocation();
  }, [])

  return  <>
            <Appbar 
              title="Home"
              icons={[
                { name: 'cog-outline', onPress: () => router.push('/settings')   },
                { name: 'logout', onPress: () => signOut() },
              ]}
            />
            {
              locations && locations.length > 0 ? locations.map((location: any, index: number) => {
                return <ListItem 
                          color={theme.colors.secondary}
                          onPress={() => router.push({ pathname: '/location', params: { id: location.id, location: JSON.stringify(location) } })}
                          onLongPress={() => alert("Press mais tempo")}
                          key={`location_${index}`} title={location.name} subtitle={location.address}/>
              }) : "Nenhuma localização encontrada"
            }
            <FAB 
              icon="plus"
              color= "white"
              style={{
                ...styles.fab,
                backgroundColor: theme.colors.secondary,
              }}
              onPress={() => router.push('/location')}
            />
          </>;
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
})