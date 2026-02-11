import { Pressable } from 'react-native';
import { Avatar, Card } from 'react-native-paper';

const ListItem = (props) => (
    <Pressable onPress={props.onPress} onLongPress={props.onLongPress}>
        <Card.Title
          {...props}
          title={props.title}
          subtitle={props.subtitle}
          left={(props) => <Avatar.Icon {...props} icon="map-marker"/>}
        />
    </Pressable>
);

export default ListItem;