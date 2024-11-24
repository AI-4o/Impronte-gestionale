import { lusitana } from "@/app/ui/fonts";
import GeneralInterfaceForm from "@/app/ui/general-interface/general-interface-form";

export default function GeneralInterfacePage() {

    return (
        <>
            <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>General Interface</h1>

            <GeneralInterfaceForm />
            
        </>

    );
}