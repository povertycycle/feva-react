/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { ContextData } from "@/features/labels/interfaces/dataset";
import { MouseEvent, ReactNode, useEffect, useRef, useState } from "react";

interface ContextMenuProps extends ContextData {
    closeMenu: () => void;
    children: React.ReactNode;
}

export const useMenu = () => {
    const [menu, setMenu] = useState<ContextData | null>(null);

    const onContextMenu = (e: MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        const { left } = (e.target as HTMLDivElement).getBoundingClientRect();
        setMenu({ clientX: e.clientX, clientY: e.clientY, left });
    };

    const closeMenu = () => setMenu(null);

    const Menu: React.FC<{ children: ReactNode }> = ({ children }) =>
        menu && (
            <ContextMenu {...menu} closeMenu={closeMenu}>
                {children}
            </ContextMenu>
        );

    return {
        menu,
        onContextMenu,
        closeMenu,
        ContextMenu: Menu,
    };
};

const ContextMenu: React.FC<ContextMenuProps> = ({
    clientX,
    clientY,
    closeMenu,
    children,
}) => {
    const ctxRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function removeDisplay(e: any) {
            const elem = e.target as HTMLElement;
            if (elem && !elem.hasAttribute("data-menu")) {
                console.log("close");
                closeMenu();
            }
        }
        document.addEventListener("mousedown", removeDisplay);

        return () => {
            document.removeEventListener("mousedown", removeDisplay);
        };
    }, []);

    return (
        <div
            ref={ctxRef}
            style={{
                top: `${clientY}px`,
                left: `${clientX}px`,
            }}
            className="fixed z-[1000] py-1.5 bg-white rounded-sm text-sm w-96 shadow-md"
        >
            {children}
        </div>
    );
};
