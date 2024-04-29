import { useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'

const Modal = ({ open, children, onClose }) => {
    const dialog = useRef()

    // Previous implementation
    // useImperativeHandle(ref, () => {
    //     return {
    //         open: () => {
    //             dialog.current?.showModal()
    //         },
    //         close: () => {
    //             dialog.current?.close()
    //         },
    //     }
    // })

    useEffect(() => {
        if (open) {
            dialog.current?.showModal()
        } else {
            dialog.current?.close()
        }
    })

    return createPortal(
        // Adding onClose due to the a small bug, when user try to close the dialog via 'Esc' key
        <dialog className="modal" ref={dialog} onClose={onClose}>
            {open ? children : null}
        </dialog>,
        document.getElementById('modal') as HTMLElement
    )
}

export default Modal
