import { Snackbar as RnpSnackbar } from 'react-native-paper';

const Snackbar = ({ children, ...props}) => {
  return <RnpSnackbar {...props}>
        {children}
      </RnpSnackbar>
};


export default Snackbar;