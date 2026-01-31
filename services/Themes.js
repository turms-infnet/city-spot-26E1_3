import {
    MD3DarkTheme,
    MD3LightTheme
} from 'react-native-paper';

const light = {
    ...MD3LightTheme,
    colors: {
        ...MD3LightTheme.colors,
        primary: 'tomato',
        secondary: 'yellow',
    },
};

const dark = {
    ...MD3DarkTheme,
    colors: {
        ...MD3DarkTheme.colors,
        primary: 'tomato',
        secondary: 'yellow',
    },
};

export default {
    dark,
    light
}