export interface FilterProps {
    onChange?: (val: { year: number; month: number }) => void;
    defaultYear?: number;
    defaultMonth?: number;
}

export interface MenuBarProps {
    menus: string[];
    onChange?: (menu: string) => void;
    activeMenu?: string;
    sort?: boolean;
    filter?: boolean;
    search?: boolean;
    operational?: boolean;
    filterProps?: FilterProps;
    searchQuery?: string;
    onSearch?: (query: string) => void;
    onExportExcel?: () => void;
}