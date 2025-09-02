import { ImageTemplate } from "@/types";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "./dialog";
import { Button } from "./button";
import { GalleryHorizontalEnd, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Img } from "./Img";

function CloseModalButton({ onClick }: { onClick: () => void }) {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onClick}
      className="absolute top-3 right-3 z-50 text-black bg-white/80 hover:bg-white backdrop-blur-sm p-1 rounded-full shadow"
    >
      <X className="w-4 h-4" />
    </Button>
  );
}

interface ImageSelectProps {
  imageTemplates: ImageTemplate[];
  onSelect: (value: string) => void;
  isFetching?: boolean;
  isLoading?: boolean;
  disabled?: boolean;
  buttonClassName?: string;
}

const ImageSelect: React.FC<ImageSelectProps> = ({
  imageTemplates,
  onSelect,
  isFetching,
  isLoading,
  disabled,
  buttonClassName,
}) => {
  const [isImageModalOpen, setIsImageModalOpen] = useState<boolean>(false);

  return (
    <>
      <Dialog open={isImageModalOpen} onOpenChange={setIsImageModalOpen}>
        <DialogContent className="w-full max-w-6xl bg-transparent p-0 border-none shadow-none mx-auto px-4 sm:px-6 md:px-8">
          <div className="sr-only">
            <DialogTitle>Pilih Gambar</DialogTitle>
            <DialogDescription>Pilih gambar</DialogDescription>
          </div>
          <div className="relative h-[75vh] md:h-[90vh] flex flex-col items-center justify-center bg-black/70 backdrop-blur-sm rounded-xl pt-14">
            <CloseModalButton onClick={() => setIsImageModalOpen(false)} />
            <div className="flex-1 w-full px-5 pt-1 overflow-auto scrollbar-thin-modern">
              <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
                {imageTemplates.map((template) => {
                  return (
                    <div
                      key={template.id}
                      className={cn(
                        "group relative overflow-hidden transition-all duration-300 cursor-pointer hover:scale-[1.02]"
                      )}
                    >
                      <div className="aspect-[3/4] relative w-full">
                        <Img
                          src={template.image}
                          alt="template"
                          className="w-full h-full object-cover rounded-md"
                          wrapperClassName="w-full h-full"
                        />
                      </div>

                      <div className="my-2 flex justify-center">
                        <Button
                          variant="secondary"
                          size="sm"
                          type="button"
                          className="rounded-full px-6"
                          onClick={() => {
                            onSelect(template.image);
                            setIsImageModalOpen(false);
                          }}
                        >
                          Pilih
                        </Button>
                      </div>
                    </div>
                  );
                })}
                <div
                  className={cn(
                    "group relative overflow-hidden transition-all duration-300 cursor-pointer hover:scale-[1.02]"
                  )}
                >
                  <div className="aspect-[3/4] relative w-full flex-center text-white border border-white rounded-md">
                    Tanpa Foto
                  </div>

                  <div className="my-2 flex justify-center">
                    <Button
                      variant="secondary"
                      size="sm"
                      type="button"
                      className="rounded-full px-6"
                      onClick={() => {
                        onSelect("");
                        setIsImageModalOpen(false);
                      }}
                    >
                      Pilih
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <div className={cn("flex-center", buttonClassName)}>
        <Button
          type="button"
          variant="secondary"
          onClick={() => setIsImageModalOpen(true)}
          isFetching={isFetching}
          isLoading={isLoading}
          disabled={disabled}
        >
          <GalleryHorizontalEnd className="h-4 w-4 mr-2" />
          Pilih
        </Button>
      </div>
    </>
  );
};

export default ImageSelect;
