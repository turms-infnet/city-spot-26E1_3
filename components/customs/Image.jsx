import { Image as RnImage } from 'react-native';

const Image = ({ children, ...props }) => (
    <RnImage {...props}>
        {children}
    </RnImage>
);

export default Image;