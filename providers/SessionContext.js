import Storage from "@/services/Storage";
import React, { createContext, useContext, useState } from "react";

import Auth from "@/services/Auth";

const SessionContext = createContext({});

export function SessionProvider({ children }) {
    const [user, setUser] = React.useState(null);
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
                            return "Erro ao entrar. Tente novamente mais tarde.";

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


    const signUp = async (email, password) => {
        try {
            setIsLoading(true);
            const { data, error } = await Auth.signUp(email, password);
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
        } catch (e) {
            console.error(e);
        }
    }

    const loadUser = async () => {
        try {
            const _user = await Storage.loadData("@citysport_session");
            setUser(_user)
            setIsLoading(false);
        } catch (e) {
            console.error(e);
            setIsLoading(false);
        }
    }

    useState(() => {
        loadUser();
    }, [user, isLoading]);



    return <SessionContext.Provider value={{ user, isLoading, signIn, signOut, signUp }}>
        {children}
    </SessionContext.Provider>
}

export const useSession = () => useContext(SessionContext);