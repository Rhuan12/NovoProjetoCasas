import { useState } from 'react'
import Image from 'next/image'
import { Property } from '@/lib/supabase'
import { ChevronLeft, ChevronRight, X, Maximize2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface PropertyImageGalleryProps {
  property: Property
}

export function PropertyImageGallery({ property }: PropertyImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Coletar todas as imagens disponíveis
  const images = [
    property.main_photo_url,
    property.photo_2_url,
    property.photo_3_url,
    property.photo_4_url,
    property.photo_5_url,
    property.photo_6_url,
    property.photo_7_url,
    property.photo_8_url,
    property.photo_9_url,
    property.photo_10_url
  ].filter(Boolean) as string[]

  const isSold = property.status === 'sold'

  if (images.length === 0) {
    return (
      <div className="w-full h-96 bg-background-tertiary rounded-xl flex items-center justify-center">
        <span className="text-text-muted">Sem fotos disponíveis</span>
      </div>
    )
  }

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + images.length) % images.length)
  }

  return (
    <>
      <div className="space-y-4">
        {/* Imagem principal */}
        <div className="relative w-full h-96 md:h-[500px] rounded-xl overflow-hidden group">
          <Image
            src={images[selectedImage]}
            alt={`${property.title} - Foto ${selectedImage + 1}`}
            fill
            className={`object-cover transition-all duration-300 ${
              isSold ? 'filter-sold' : ''
            }`}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
            priority
          />
          
          {/* Overlay para imóveis vendidos */}
          {isSold && (
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
              <div className="bg-sold/90 text-white px-4 py-2 rounded-lg font-semibold">
                VENDIDO
              </div>
            </div>
          )}

          {/* Botões de navegação */}
          {images.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white hover:bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ChevronLeft size={20} />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white hover:bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ChevronRight size={20} />
              </Button>
            </>
          )}

          {/* Botão expandir */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsModalOpen(true)}
            className="absolute top-4 right-4 bg-black/50 text-white hover:bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Maximize2 size={16} />
          </Button>

          {/* Contador de imagens */}
          {images.length > 1 && (
            <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
              {selectedImage + 1} / {images.length}
            </div>
          )}
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-2">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`relative flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                  selectedImage === index 
                    ? 'border-accent-primary' 
                    : 'border-transparent hover:border-background-tertiary'
                }`}
              >
                <Image
                  src={image}
                  alt={`${property.title} - Thumbnail ${index + 1}`}
                  fill
                  className={`object-cover ${isSold ? 'filter-sold' : ''}`}
                  sizes="80px"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Modal de imagem ampliada */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          <div className="relative max-w-7xl max-h-full w-full h-full flex items-center justify-center">
            {/* Imagem ampliada */}
            <div className="relative w-full h-full max-w-5xl max-h-5xl">
              <Image
                src={images[selectedImage]}
                alt={`${property.title} - Foto ${selectedImage + 1}`}
                fill
                className={`object-contain ${isSold ? 'filter-sold' : ''}`}
                sizes="100vw"
              />
            </div>

            {/* Botão fechar */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 bg-black/50 text-white hover:bg-black/70"
            >
              <X size={20} />
            </Button>

            {/* Navegação no modal */}
            {images.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white hover:bg-black/70"
                >
                  <ChevronLeft size={24} />
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white hover:bg-black/70"
                >
                  <ChevronRight size={24} />
                </Button>

                {/* Contador no modal */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full">
                  {selectedImage + 1} / {images.length}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}