
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UploadCloud, Trash2 } from "lucide-react";
import { uploadServicePhoto } from "@/lib/storage";
import { toast } from "sonner";

interface PhotoUploaderProps {
  serviceId: string;
  onPhotoUploaded: (url: string) => void;
}

export const PhotoUploader: React.FC<PhotoUploaderProps> = ({ 
  serviceId, 
  onPhotoUploaded 
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleClearFile = () => {
    setSelectedFile(null);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    
    setLoading(true);
    try {
      const photoUrl = await uploadServicePhoto(selectedFile, serviceId);
      
      if (photoUrl) {
        onPhotoUploaded(photoUrl);
        setSelectedFile(null);
        toast.success('Foto carregada com sucesso');
      } else {
        toast.error('Erro ao carregar foto');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Erro ao carregar foto');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <div className="flex flex-col space-y-2">
        <Label htmlFor="photo-upload">Selecione uma foto</Label>
        <div className="flex gap-2">
          <Input
            id="photo-upload"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="flex-1"
          />
          {selectedFile && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleClearFile}
              className="text-red-500 hover:bg-red-50 hover:text-red-600"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {selectedFile && (
        <div className="space-y-2">
          <div className="text-sm text-muted-foreground">
            Arquivo selecionado: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)
          </div>
          <Button 
            onClick={handleUpload} 
            disabled={loading}
            className="w-full"
          >
            <UploadCloud className="mr-2 h-4 w-4" />
            {loading ? 'Carregando...' : 'Carregar Foto'}
          </Button>
        </div>
      )}
    </div>
  );
};
