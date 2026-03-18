import Themes from '@/services/Themes';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState } from "react";
import { useColorScheme } from 'react-native';
import { PaperProvider } from 'react-native-paper';

const ThemeContext = createContext({});

export function ThemeProvider({ children }) {
    const systemColorScheme = useColorScheme();
    const [themeMode, setThemeMode] = useState("system")
    const [isReady, setIsReady] =  useState(false);

    useEffect(() => {
        const loadTheme = async () => {
            try {
                const savedTheme = await AsyncStorage.getItem("@app_theme");
                if (savedTheme) {
                    setThemeMode(savedTheme)
                }
            } catch(err) {
                console.error("Um erro ocorreu: ", err)
            } finally {
                setIsReady(true)
            }
        }
        loadTheme();
    },  [])

    const changeTheme = async (mode) => {
        setThemeMode(mode);
        await AsyncStorage.setItem("@app_theme", mode);
    }
    
    if (!isReady) return null

    // TODO: Resolver na proxima aula
    const activeTheme = themeMode === "system" ? systemColorScheme : themeMode;

    const theme = activeTheme === "dark" ? Themes.dark : (
        activeTheme === "light" ? Themes.light : Themes[systemColorScheme]
    );


    return <ThemeContext.Provider value={{ themeMode, changeTheme, activeTheme }}>
        <PaperProvider theme={theme}>
            {children}
        </PaperProvider>
    </ThemeContext.Provider>
}

export const useTheme = () => useContext(ThemeContext);