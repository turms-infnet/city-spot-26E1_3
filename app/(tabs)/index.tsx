import { Appbar, Confirm, FAB, ListItem } from '@/components/customs';
import useConfirm from '@/hooks/useConfirm';
import useLocations from '@/hooks/useLocations';
import { useSession } from '@/providers/SessionContext';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';

export default function HomeScreen() {
  const { locations, loading, syncLocation, setPage, setLimit, setSearch, listLocations, _deleteLocation } = useLocations() as { locations: any[], loading: boolean, syncLocation: any, setPage: any, setLimit: any, setSearch: any, listLocations: any, _deleteLocation: any };
  const { signOut } = useSession() as { signOut: any };
  const router = useRouter();
  const theme = useTheme();
  const { visible, hideDialog, showConfirm, confirmConfig } = useConfirm() as { visible: any, hideDialog: any, showConfirm: any, confirmConfig: any };

  useEffect(() => {
    syncLocation();
  }, [])

  useFocusEffect(
    useCallback(() => {
      listLocations();
    }, [listLocations])
  );

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
                          onLongPress={() => {
                            showConfirm(
                              "Deletar local?",
                              "Tem certeza que deseja deletar esta localização? Essa ação não poderá ser revertida.",
                              async () => {
                                await _deleteLocation(location.id, location.id_server)
                              })
                          }}
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
            <Confirm 
              visible={visible} 
              hideDialog={hideDialog}
              title={confirmConfig.title}
              text={confirmConfig.text}
              onConfirm={confirmConfig.onConfirm}
              confirmButtonText="Deletar"
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