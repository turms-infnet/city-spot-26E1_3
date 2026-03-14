import { Appbar, SwitchGroup } from "@/components/customs";
import { useSession } from "@/providers/SessionContext";
import { useTheme } from "@/providers/ThemeContext";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";

export default function SettingsScreen() {
  const { signOut } = useSession() as { signOut: any };
  const router = useRouter();
  const  [colorMode, setColorMode] = useState("default");
  const { changeTheme } = useTheme() as { changeTheme: any };

  const options = [
    {value:  "default", label: "Padrão"},
    {value:  "light", label: "Claro"},
    {value:  "dark", label: "Escuro"}
  ]

  useEffect(() => {
    changeTheme(colorMode)
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