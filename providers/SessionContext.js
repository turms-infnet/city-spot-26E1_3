import Storage from "@/services/Storage";
import React, { createContext, useContext, useState } from "react";

import Auth from "@/services/Auth";
import { saveImageInStorage } from "@/services/Image";
import { deleteAllDatas } from "@/services/SQLite";

const SessionContext = createContext({});

export function SessionProvider({ children }) {
    const [user, setUser] = React.useState(null);
    const [userProfile, setUserProfile] = React.useState(null);
    const [isLoading, setIsLoading] = React.useState(true);

    const signIn = async (email, password) => {
        try {
            setIsLoading(true);
            const { data, error } = await Auth.signIn(email, password);
            setIsLoading(false);
            if (error) {
                if (error.message) {
                    switch (error.code) {
                        case "invalid_credentials":
                            return "Credenciais inválidas. Verifique seu e-mail e senha.";
                        case "user_not_found":
                            return "Credenciais inválidas. Verifique seu e-mail e senha.";
                        default:
                            return error.message;

                    }
                } else {
                    return error;
                }
            } else {
                await Storage.saveData("@citysport_session", data.user);
                loadUser();
                return "Login realizado com sucesso!";
            }
        } catch (e) {
            console.error(e);
            setIsLoading(false);
        }
    }

    const forgotPassword = async (email) => {
        try {
            setIsLoading(true);
            const { data, error } = await Auth.forgotPassword(email);
            
            setIsLoading(false);
            if (error) {
                if (error.message) {
                    switch (error.code) {
                        case "user_not_found":
                            return "Usuário não encontrado. Verifique seu e-mail.";
                        default:
                            return "Erro ao solicitar recuperação de senha. Tente novamente mais tarde.";
                    }
                } else {
                    return error;
                }
            } else {
                return "Solicitação de recuperação de senha enviada com sucesso!";
            }
        } catch (e) {
            console.error(e);
            setIsLoading(false);
        }
    }

    const updateProfile = async (data) => {
        try {
            setIsLoading(true);

            if (data.image && data.image.indexOf("https://") === -1) {
                data.image = await saveImageInStorage("profiles", null, data.image);
            } else if (data.image === null) {
                data.image = ""
            }
            
            const { data: updatedUser, error } = await Auth.createOrUpdateProfile(data);
            setIsLoading(false);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }

    const signUp = async (email, password) => {
        try {
            setIsLoading(true);
            const { data, error } = await Auth.signUp(email, password);
            const { data: createdProfile, error: profileError } = await Auth.createOrUpdateProfile({
                id: data.user.id,
                image: "",
                email: email,
                birthday: "",
                sex: "",
                name: "",
            });
            setIsLoading(false);
            if (error) {
                if (error.message) {
                    switch (error.code) {
                        case "email_already_exists":
                            return "Este e-mail já está em uso. Tente outro.";
                        default:
                            return "Erro ao entrar. Tente novamente mais tarde.";

                    }
                } else {
                    return error;
                }
            } else {
                return "Registro realizado com sucesso!";
            }
        } catch (e) {
            console.error(e);
            setIsLoading(false);
        }
    }

    const signOut = () => {
        try {
            Auth.signOut();
            setUser(null);
            Storage.clearData("@citysport_session");
            deleteAllDatas();
        } catch (e) {
            console.error(e);
        }
    }

    const loadUserProfile = async (user) => {
        try {
            const { data, error } = await Auth.getUserProfile(user.id);
            console.log(data)
            if (error) {
                console.error("Erro ao carregar perfil do usuário:", error);
            } else {
                setUserProfile(data);
            }
        } catch (error) {
            console.error("Erro ao carregar perfil do usuário:", error);
        }
    }

    const loadUser = async () => {
        try {
            const _user = await Storage.loadData("@citysport_session");
            setUser(_user)

            await loadUserProfile(_user);
            setIsLoading(false);
        } catch (e) {
            console.error(e);
            setIsLoading(false);
        }
    }

    useState(() => {
        loadUser();
    }, [user, isLoading]);

    useState(() => {
        loadUser();
    }, []);

    return <SessionContext.Provider value={{ user, isLoading, signIn, signOut, signUp, updateProfile, userProfile }}>
        {children}
    </SessionContext.Provider>
}

export const useSession = () => useContext(SessionContext);