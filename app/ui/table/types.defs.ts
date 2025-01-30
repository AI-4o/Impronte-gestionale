export type TableRow = {
    id: string;
    cells: JSX.Element[];
}
export type TableColumn = {
    id: string;
    isVisible: boolean;
    isSortable: boolean;
    isFilterable: boolean;
}

