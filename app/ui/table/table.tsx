import TableRow from "./table-row";
import Toolbar from "./toolbar";

export default function Table({ data, minWidths }: { data: Record<string, any>[][], minWidths: number[] }) {
    const columns = getColumnsFromData(data);
    const minTotalWidth = columns.reduce((acc, curr, i) => acc + minWidths[i], 0); // Calcoliamo la larghezza minima della tabella

    return (
        <div className='flex flex-col overflow-x-auto w-full mt-4'>
            <div className='inline-block' style={{ minWidth: `${minTotalWidth}px` }}>
                 {/* <Toolbar /> */}
                <div className='flex w-full justify-between items-center px-4 py-2 border-b border-gray-200 bg-gray-100 font-medium'>
                    {columns.map((column, i) => (
                        <div 
                            key={column}
                            className={`flex-1 px-3 text-gray-700 min-w-[${minWidths[i]}px]`}
                        >
                            {column}
                        </div>
                    ))}
                </div>
                <div className='flex flex-col table-rows-wrapper'>
                    {data.map((row, index) => (
                        <TableRow key={index} data={row} minWidths={minWidths} />
                    ))}
                </div>
            </div>
        </div>
    );
}

const getColumnsFromData = (data: Record<string, any>[]) => {
    return data[0].map((item) => item.nome);
}
