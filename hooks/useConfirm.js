import { useState } from "react"

const useConfirm = () => {
    const [visible, setVisible] = useState(false)
    const [confirmConfig, setConfirmConfig] = useState({
        title: "",
        text: "",
        onConfirm: () => { }
    })

    const showConfirm = (title, text, onConfirm) => {
        setConfirmConfig({ title, text, onConfirm });
        setVisible(true);
    }

    const hideDialog = () => {
        setVisible(false)
    }

    return {
        visible,
        confirmConfig,
        showConfirm,
        hideDialog,
    }
}

export default useConfirm;