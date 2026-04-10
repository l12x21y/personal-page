import React, { useRef } from 'react';
import { Asset } from '../../types.ts';
import CloseIcon from '../icons/CloseIcon.tsx';
import { getAssetUrl } from '../../utils/assetUrl.ts';
import UploadIcon from '../icons/UploadIcon.tsx';
import PdfIcon from '../icons/PdfIcon.tsx';
import TrashIcon from '../icons/TrashIcon.tsx';
import PlusIcon from '../icons/PlusIcon.tsx';
import SparklesIcon from '../icons/SparklesIcon.tsx';

interface AssetManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  assets: Asset[];
  onAddAsset: (file: File) => void;
  onDeleteAsset: (assetId: number) => void;
  onCreateProject: (asset: Asset) => void;
  onAutofill: (asset: Asset) => void;
}

const AssetManagerModal: React.FC<AssetManagerModalProps> = ({
  isOpen,
  onClose,
  assets,
  onAddAsset,
  onDeleteAsset,
  onCreateProject,
  onAutofill,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach(file => onAddAsset(file));
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100]"
      aria-modal="true"
      role="dialog"
      onClick={onClose}
    >
      <div
        className="bg-white border border-gray-200 rounded-lg shadow-2xl w-full max-w-4xl h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="p-4 flex items-center justify-between border-b border-gray-200">
          <h2 className="text-2xl font-bold text-black">Asset Manager</h2>
          <button onClick={onClose} className="p-2 text-gray-500 hover:text-black transition-colors" aria-label="Close asset manager">
            <CloseIcon className="w-6 h-6" />
          </button>
        </header>
        <main className="p-6 flex-grow overflow-y-auto bg-gray-50">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            <button
              onClick={handleUploadClick}
              className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-500 hover:bg-gray-100 hover:border-gray-400 hover:text-black transition-all"
            >
              <UploadIcon className="w-8 h-8 mb-2" />
              <span className="text-sm font-semibold">Upload New</span>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              multiple
              onChange={handleFileChange}
              accept="image/png, image/jpeg, image/webp, application/pdf"
              className="hidden"
            />
            {assets.map((asset) => (
              <div key={asset.id} className="group relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
                {asset.type === 'image' ? (
                  <img src={asset.url} alt={asset.name} className="w-full h-full object-cover" />
                                  <img src={getAssetUrl(asset.url)} alt={asset.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center p-2">
                    <PdfIcon className="w-1/2 h-1/2 text-gray-400" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-2">
                  <p className="text-xs text-white text-center break-words w-full mb-2 px-1">{asset.name}</p>
                  <div className="flex space-x-2">
                    {asset.type === 'pdf' && (
                       <button
                        onClick={() => onAutofill(asset)}
                        className="p-2 bg-gray-600 rounded-full text-white hover:bg-gray-500 transition-colors"
                        title="Autofill portfolio from this asset"
                      >
                        <SparklesIcon className="w-5 h-5" />
                      </button>
                    )}
                    <button
                      onClick={() => onCreateProject(asset)}
                      className="p-2 bg-gray-600 rounded-full text-white hover:bg-gray-500 transition-colors"
                      title="Create project from this asset"
                    >
                      <PlusIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => onDeleteAsset(asset.id)}
                      className="p-2 bg-gray-600 rounded-full text-white hover:bg-gray-500 transition-colors"
                      title="Delete asset"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AssetManagerModal;