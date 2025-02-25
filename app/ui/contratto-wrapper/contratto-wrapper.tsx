'use client';

import { useEffect, useState } from 'react';

interface ContrattoViewerProps {
  width?: string | number;
  height?: string | number;
}

const ContrattoViewer: React.FC<ContrattoViewerProps> = ({ 
  width = '100%', 
  height = '800px' 
}) => {
  const [baseUrl, setBaseUrl] = useState<string>('');
  const [iframeLoaded, setIframeLoaded] = useState(false);

  useEffect(() => {
    // Recupera la base URL quando il componente viene montato
    if (typeof window !== 'undefined') {
      setBaseUrl(window.location.origin);
    }
  }, []);
  
  const url = `/contratto-form/index.html`
  return (
    <div className="contratto-wrapper">
      {baseUrl && (
        <iframe
          src={url}
          width={width}
          height={height}
          frameBorder="0"
          title="Contratto Viewer"
          className="contratto-iframe"
          sandbox="allow-same-origin allow-scripts allow-forms"
          loading="lazy"
          onLoad={() => setIframeLoaded(true)}
        />
      )}
      <style jsx>{`
        .contratto-wrapper {
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
        }
        .contratto-iframe {
          border: none;
          width: ${typeof width === 'number' ? `${width}px` : width};
          height: ${typeof height === 'number' ? `${height}px` : height};
          background: white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
      `}</style>
    </div>
  );
};

export default ContrattoViewer;