import { Avatar as RnpAvatar } from 'react-native-paper';

import avatar from "../../assets/images/padrao.png";

const Avatar = (props) => (
  <RnpAvatar.Image {...props} source={props.source ? props.source : avatar}/>
);
export default Avatar