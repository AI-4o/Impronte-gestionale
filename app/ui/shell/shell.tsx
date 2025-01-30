"use client";
import { ReactNode, useEffect, useRef } from "react";
import { useState } from "react";
import Modal from "../modal";

export default function Shell({ children }: { children: ReactNode }) {

    const [shortcut, setShortcut] = useState<string>('');
    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        setShortcut((s) => s + e.key);
        if (e.key == 'Escape') { // reset shortcut
            setShortcut('');
        }

    }
    useEffect(() => {
        if (shortcut === shortcuts.changeLg.shortcut) {
            window.location.href = `/dashboard/${shortcuts.changeLg.page}`;
            setShortcut('');
        }
        if (shortcut === shortcuts.preventivo.shortcut) {
            window.location.href = `/dashboard/${shortcuts.preventivo.page}`;
            setShortcut('');
        }
        if (shortcut === shortcuts.dataTable.shortcut) {
            window.location.href = `/dashboard/${shortcuts.dataTable.page}`;
            setShortcut('');
        }
        if (shortcut === shortcuts.aggiungi.shortcut) {
            window.location.href = `/dashboard/${shortcuts.aggiungi.page}`;
            setShortcut('');
        }
    }, [shortcut]);
    return (
        <div
            tabIndex={0}
            className="shell"
            onKeyDown={(e) => handleKeyDown(e)}
        >
            <div className="modal-container">
                <Modal dark={true} showModal={shortcut.startsWith('Alt@#')} header={<p>Shortcut detected 🧠</p>} body={shortcut} />
            </div>
            {children}
        </div>
    );
}

/** enums corresponding to page navigation shortcuts */
const shortcuts = {
    changeLg: { shortcut: 'Alt@#1', page: '' },
    preventivo: { shortcut: 'Alt@#2', page: 'general-interface' },
    dataTable: { shortcut: 'Alt@#3', page: 'data-table' },
    aggiungi: { shortcut: 'Alt@#4', page: 'aggiungi' }
}