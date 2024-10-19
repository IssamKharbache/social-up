import { useRef } from "react";
import { Cropper, ReactCropperElement } from "react-cropper";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import "cropperjs/dist/cropper.css";

interface CropImageModalProps {
  src: string;
  cropAscpectRatio: number;
  onCropped: (blob: Blob | null) => void;
  onClose: () => void;
}

const CropImageModal = ({
  src,
  cropAscpectRatio,
  onCropped,
  onClose,
}: CropImageModalProps) => {
  const cropperRef = useRef<ReactCropperElement>(null);

  //crop function

  const crop = () => {
    const cropper = cropperRef.current?.cropper;
    if (!cropper) return;
    cropper.getCroppedCanvas().toBlob((blob) => onCropped(blob), "image/webp");
    onClose();
  };
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Crop Image</DialogTitle>
        </DialogHeader>
        <Cropper
          src={src}
          ref={cropperRef}
          aspectRatio={cropAscpectRatio}
          className="mx-auto size-fit"
          guides={false}
          zoomable={false}
        />
        <DialogFooter>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={crop}>Crop</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CropImageModal;
