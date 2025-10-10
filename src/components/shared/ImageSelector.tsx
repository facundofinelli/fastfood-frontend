import { useState } from "react";

type ImageSelectorProps = {
  images: string[];
  selected?: string;
  onSelect: (image: string) => void;
};

export const ImageSelector: React.FC<ImageSelectorProps> = ({
  images,
  selected,
  onSelect,
}) => {
  const [selectedImage, setSelectedImage] = useState(selected || "");

  const handleSelect = (img: string) => {
    setSelectedImage(img);
    onSelect(img);
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Seleccionar imagen</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {images.map((img) => (
          <div
            key={img}
            className={`relative rounded-lg overflow-hidden cursor-pointer border-2 transition-transform duration-200 ${
              selectedImage === img
                ? "border-yellow-500 scale-105 shadow-lg"
                : "border-gray-300 hover:scale-105"
            }`}
            onClick={() => handleSelect(img)}
          >
            <img
              src={img}
              alt={img}
              className="object-cover w-full h-30 rounded-md"
            />
          </div>
        ))}
      </div>
    </div>
  );
};
