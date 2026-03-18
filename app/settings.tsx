import { Appbar, SwitchGroup } from "@/components/customs";
import { useSession } from "@/providers/SessionContext";
import { useTheme } from "@/providers/ThemeContext";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";

export default function SettingsScreen() {
  const { signOut } = useSession() as { signOut: any };
  const router = useRouter();
  const  [colorMode, setColorMode] = useState(null);
  const { changeTheme, activeTheme } = useTheme() as { changeTheme: any, activeTheme: any };

  const options = [
    {value:  "system", label: "Padrão"},
    {value:  "light", label: "Claro"},
    {value:  "dark", label: "Escuro"}
  ]

  useEffect(() => {
    setColorMode(activeTheme)
  }, [])

  useEffect(() => {
    if(colorMode !== null) {
      changeTheme(colorMode)
    }
  }, [colorMode]);


  return <>
            <Appbar
              onBack={() => {
                router.back();
              }}
              title="Configurações"
              icons={[
                { name: 'logout', onPress: () => signOut() },
              ]}
            />
            <SwitchGroup 
              side={"left"}
              title={"Escolha seu modo de cor"} options={options} selected={colorMode} setSelected={setColorMode}
            />
          </>;
}