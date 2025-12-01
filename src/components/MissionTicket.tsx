import { useEffect } from 'react';

interface Location {
  name: string;
  address: string;
  description: string;
  type?: string;
  lng: number;
  lat: number;
  phone?: string;
  hours?: string;
}

interface MissionTicketProps {
  location: Location;
  isVisible: boolean;
  onClose: () => void;
  onSpinAgain: () => void;
}

export default function MissionTicket({ location, isVisible, onClose, onSpinAgain }: MissionTicketProps) {
  useEffect(() => {
    if (isVisible) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isVisible]);

  const handleOpenMaps = () => {
    // Tạo query string: "Tên quán + Gia Lai" (VD: "V7 Coffee Gia Lai")
    // encodeURIComponent để xử lý các ký tự đặc biệt, khoảng trắng
    const query = encodeURIComponent(`${location.name} Gia Lai`);

    // Sử dụng Google Maps Universal Link
    // api=1: Version mới nhất
    // destination: Đích đến dựa trên tên (Google tự tìm tọa độ chuẩn nhất)
    // dir_action=navigate: Mở thẳng chế độ dẫn đường
    const url = `https://www.google.com/maps/dir/?api=1&destination=${query}&dir_action=navigate`;

    window.open(url, '_blank');
  };

  const getRandomRating = () => {
    return (Math.random() * 1 + 4).toFixed(1);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div
        className="relative max-w-lg w-full transform transition-all duration-500 ease-out animate-ticket-enter"
        style={{
          background: 'linear-gradient(145deg, #FBD38D 0%, #F7931E 20%, #ED8936 100%)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(139, 69, 19, 0.1)',
        }}
      >
        {/* Vintage Ticket Design */}
        <div className="relative overflow-hidden rounded-2xl">
          {/* Perforated Edge Effect */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-repeat-x opacity-20"
            style={{
              backgroundImage: 'radial-gradient(circle at 8px center, transparent 3px, #8B4513 3px)',
              backgroundSize: '16px 100%'
            }}
          ></div>
          <div className="absolute bottom-0 left-0 right-0 h-2 bg-repeat-x opacity-20"
            style={{
              backgroundImage: 'radial-gradient(circle at 8px center, transparent 3px, #8B4513 3px)',
              backgroundSize: '16px 100%'
            }}
          ></div>

          {/* Ticket Header */}
          <div className="px-8 pt-8 pb-4 text-center bg-gradient-to-b from-amber-50/20 to-transparent">
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="text-2xl">🧭</span>
              <h3 className="text-lg font-bold text-wood">LA BÀN ĐẠI NGÀN</h3>
            </div>
            <div className="w-16 h-1 bg-wood/30 mx-auto rounded-full"></div>
          </div>

          {/* Mission Content */}
          <div className="px-8 pb-8">
            {/* Destination Image Placeholder */}
            <div className="relative mb-6 rounded-xl overflow-hidden bg-gradient-to-br from-amber-100 to-amber-200 h-40 flex items-center justify-center border-2 border-wood/20">
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              <div className="text-center z-10">
                <div className="text-4xl mb-2">📍</div>
                <p className="text-sm font-medium text-wood/80">Hình ảnh địa điểm</p>
              </div>

              {/* Vintage Photo Corner */}
              <div className="absolute top-3 right-3 w-6 h-6">
                <div className="absolute top-0 right-0 w-full h-full border-t-2 border-r-2 border-wood/40"></div>
              </div>
              <div className="absolute bottom-3 left-3 w-6 h-6">
                <div className="absolute bottom-0 left-0 w-full h-full border-b-2 border-l-2 border-wood/40"></div>
              </div>
            </div>

            {/* Mission Title */}
            <div className="text-center mb-6">
              <h2 className="text-sm font-medium text-wood/70 mb-1">Định mệnh gọi tên:</h2>
              <h1 className="text-2xl font-bold text-wood leading-tight font-playfair mb-2">
                {location.name}
              </h1>
              {location.type && (
                <span className="inline-block px-3 py-1 text-xs font-semibold bg-wood/20 text-wood rounded-full">
                  {location.type}
                </span>
              )}
            </div>

            {/* Location Details */}
            <div className="space-y-3 mb-6 text-sm">
              <div className="flex items-start gap-3">
                <span className="text-wood/70 mt-0.5">📍</span>
                <p className="text-wood/80 leading-relaxed">{location.address}</p>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-wood/70 mt-0.5">✨</span>
                <p className="text-wood/80 leading-relaxed">{location.description}</p>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2 pt-2">
                <div className="flex text-yellow-600">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={i < Math.floor(parseFloat(getRandomRating())) ? '★' : '☆'}>
                      {i < Math.floor(parseFloat(getRandomRating())) ? '★' : '☆'}
                    </span>
                  ))}
                </div>
                <span className="text-sm font-medium text-wood/80">{getRandomRating()}/5</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleOpenMaps}
                className="flex-1 bg-wood text-amber-50 py-3 px-4 rounded-xl font-bold text-sm hover:bg-wood/90 transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <span>🚀</span>
                <span>Đi ngay thôi!</span>
              </button>

              <button
                onClick={onSpinAgain}
                className="flex-1 bg-amber-100/50 text-wood py-3 px-4 rounded-xl font-bold text-sm hover:bg-amber-100/70 transition-all duration-200 flex items-center justify-center gap-2 border border-wood/20 hover:border-wood/30"
              >
                <span>🔄</span>
                <span>Quay lại</span>
              </button>
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-wood/10 hover:bg-wood/20 transition-colors duration-200 text-wood"
          >
            ✕
          </button>
        </div>

        {/* Ticket Stub */}
        <div className="absolute -right-2 top-1/2 transform -translate-y-1/2 w-4 h-8 bg-amber-200 rounded-r-lg opacity-80"></div>
      </div>

      <style jsx>{`
        @keyframes ticket-enter {
          0% {
            opacity: 0;
            transform: scale(0.8) translateY(20px) rotate(-2deg);
          }
          50% {
            transform: scale(1.05) translateY(-5px) rotate(1deg);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0) rotate(0deg);
          }
        }

        .animate-ticket-enter {
          animation: ticket-enter 0.6s ease-out;
        }
      `}</style>
    </div>
  );
}