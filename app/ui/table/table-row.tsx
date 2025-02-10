export default function TableRow({ data, minWidths }: { data: Record<string, any>[], minWidths: number[] }) {
    console.log("row: ", data);
    
    return (
        <div className='flex w-full justify-between items-center px-4 py-2 border-b border-gray-200 hover:bg-gray-50 transition-colors'>
            {data.map((item, i) => (
                <div 
                    key={item.nome}
                    className={`flex-1 px-3 text-gray-700 min-w-[${minWidths[i]}px] border-r border-gray-200 `}
                >
                    {item.valore?.toString() ?? '-' }
                </div>
            ))}
        </div>
    );
}