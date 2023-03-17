export interface NavigationMenu {
    menuId: string;
    parentId?: any;
    name: string;
    code: string;
    url: string;
    icon: string;
    hasBadge: boolean;
    sequenceNbr: number;
    subMenus: NavigationMenu[];
}