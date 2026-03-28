import { supabase } from "@/services/Supabase";

const Auth = {
    signIn: async (email, password) => {
        return await supabase.auth.signInWithPassword({
            email: email.toLowerCase(),
            password: password
        })
    },
    signUp: async (email, password) => {
        return await supabase.auth.signUp({
            email: email.toLowerCase(),
            password: password
        })
    },
    signOut: async () => {
        return await supabase.auth.signOut();
    },
    isLoggedIn: async () => {
        const session = await supabase.auth.getSession();
        return session != null;
    },
    forgotPassword: async (email) => {
        return await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: "https://citysport-26e1-3.supabase.co/auth/v1/callback",
        });
    },
    getUser: async () => {
        const resp = await supabase.auth.getUser();
        return resp?.data?.user;
    },
    getUserProfile: async (userId) => {
        return await supabase.from("profile").select("*").eq("id", userId).single();
    },
    createOrUpdateProfile: async (data) => {
        return await supabase.from("profile").upsert(data).eq("id", data.id);
    },
    updatePassword: async (password) => {
        return await supabase.auth.updateUser({
            password: password
        })
    }
}

export default Auth;