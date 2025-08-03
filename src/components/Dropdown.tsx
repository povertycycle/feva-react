/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    createContext,
    Dispatch,
    HTMLAttributes,
    SetStateAction,
    useContext,
    useEffect,
    useRef,
    useState,
} from "react";

const DropdownContext = createContext<{
    display: boolean;
    setDisplay: Dispatch<SetStateAction<boolean>>;
}>({
    display: false,
    setDisplay: () => {},
});

/**
 * [v2.0] - Dropdown component adjusted for desktop and mobile.
 * @param placement Optional placement on left or right.
 */
const DropdownComponent: React.FC<HTMLAttributes<HTMLDivElement>> = ({
    className,
    children,
}) => {
    const [display, setDisplay] = useState<boolean>(false);
    const closeMenu = (e?: any) => {
        e?.stopPropagation();
        setDisplay(false);
    };
    const ref = useRef<HTMLDivElement | null>(null);
    useEffect(() => {
        const handler = (evt: MouseEvent) => {
            if (!!ref.current && !ref.current.contains(evt.target as Node)) {
                closeMenu();
            }
        };
        document.addEventListener("mousedown", handler);
        return () => {
            document.removeEventListener("mousedown", handler);
        };
    }, []);

    return (
        <DropdownContext.Provider value={{ display, setDisplay }}>
            <div ref={ref} className={`relative flex ${className}`}>
                {children}
            </div>
        </DropdownContext.Provider>
    );
};

/**
 * [v2.0] Dropdown toggle component to display toggling button.
 */
const Toggle: React.FC<HTMLAttributes<HTMLButtonElement>> = ({
    className,
    children,
    ...restProps
}) => {
    const { setDisplay } = useContext(DropdownContext);

    return (
        <button
            {...restProps}
            className={className}
            onClick={() => {
                setDisplay(true);
            }}
        >
            {children}
        </button>
    );
};

/**
 * [v2.0] - Menu inside dropdown component.
 */
const Menu: React.FC<HTMLAttributes<HTMLDivElement>> = ({
    children,
    className,
    ...restProps
}) => {
    const { display } = useContext(DropdownContext);

    return (
        <div
            {...restProps}
            className={`${
                display ? "max-h-[400px]" : "max-h-0"
            } duration-400 ease-in transition-[max-height] flex flex-col top-full overflow-hidden shadow-sm absolute z-50 ${className} bg-white`}
        >
            {children}
        </div>
    );
};

/**
 * [v2.0] - Selection item display component
 */
const Item: React.FC<HTMLAttributes<HTMLDivElement>> = ({
    className,
    children,
    onClick,
    ...restProps
}) => {
    const { setDisplay } = useContext(DropdownContext);

    return (
        <div
            onClick={(e: any) => {
                e.stopPropagation();
                setDisplay(false);
                onClick?.(e);
            }}
            {...restProps}
            className={`cursor-pointer ${className}`}
        >
            {children}
        </div>
    );
};

export const Dropdown = Object.assign(DropdownComponent, {
    Toggle,
    Menu,
    Item,
});
