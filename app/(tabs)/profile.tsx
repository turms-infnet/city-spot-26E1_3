import { Appbar } from "@/components/customs";
import { useSession } from "@/providers/SessionContext";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";

export default function TabTwoScreen() {
    const { signOut, user } = useSession() as { signOut: any, user: any };
    const router = useRouter();
    const [profile, setProfile] = useState<any>(null);

    // console.info("User", user.user_metadata)

    useEffect(() => {
      if (user !== null && user !== undefined) {  
        setProfile({
          email: user.email,
          name: user.user_metadata.name,
          avatar: user.user_metadata.avatar_url,
          birthday: user.user_metadata.birthday,
          sex: user.user_metadata.sex,
        })
      }
    }, [])

    return  <>
            <Appbar 
              title="Perfil"
              icons={[
                { name: 'cog-outline', onPress: () => router.push('/settings')   },
                { name: 'logout', onPress: () => signOut() },
              ]}
            />
          </>;
}