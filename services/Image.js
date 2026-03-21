import { decode } from 'base64-arraybuffer';
import { supabase } from "./Supabase";

export const saveImageInStorage = async (folder, fileName, image) => {
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
        console.error("Erro de autenticação:", authError);
        return { data: null, error: authError || new Error("Usuário não autenticado.") };
    }

    if (fileName === null) {
        fileName = `${user.id}_${new Date().getTime()}.png`;
    }

    const { error: uploadError } = await supabase.storage.from("images").upload(`${folder}/${fileName}`, decode(image), {
        contentType: 'image/png'
    })
    if (uploadError) {
        console.error("[[saveImageInStorage]] >> Erro no upload:", uploadError);
        return { data: null, error: uploadError };
    }

    const { data: { publicUrl }, error: urlError } = supabase.storage.from("images").getPublicUrl(`${folder}/${fileName}`);
    if (urlError) return { error: urlError };

    return publicUrl
}