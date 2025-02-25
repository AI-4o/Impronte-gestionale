import ContrattoViewer from '@/app/ui/contratto-wrapper/contratto-wrapper';

const YourPage = () => {
  return (
    <div className='flex flex-col items-center pt-4 justify-center w-full'>
      <h1 className="mb-4 text-xl md:text-2xl">CREAZIONE CONTRATTO E SPEDIZIONE PDF AL CLIENTE</h1>
      <ContrattoViewer />
    </div>
  );
};

export default YourPage;