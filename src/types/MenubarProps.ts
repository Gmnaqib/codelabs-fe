export interface MenuBarProps {
    menus: string[]
    onChange?: (menu: string) => void
    activeMenu?: string
    sort?: boolean
}