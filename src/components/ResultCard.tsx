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

interface ResultCardProps {
  location: Location;
  onSpinAgain: () => void;
}

export default function ResultCard({ location, onSpinAgain }: ResultCardProps) {
  const getCategoryBadgeColor = (type: string = 'default') => {
    const colorMap: { [key: string]: string } = {
      'Lẩu Buffet': 'bg-red-100 text-red-800',
      'Nướng Hàn Quốc': 'bg-orange-100 text-orange-800',
      'Cơm Niêu': 'bg-yellow-100 text-yellow-800',
      'Bún': 'bg-green-100 text-green-800',
      'Phở': 'bg-blue-100 text-blue-800',
      'Cơm Gà': 'bg-purple-100 text-purple-800',
      'Lẩu': 'bg-pink-100 text-pink-800',
      'Homestay': 'bg-indigo-100 text-indigo-800',
      'Khách Sạn': 'bg-teal-100 text-teal-800',
      default: 'bg-gray-100 text-gray-800'
    };
    return colorMap[type] || colorMap.default;
  };

  const getRandomRating = () => {
    // Generate a random rating between 4.0 and 5.0
    return (Math.random() * 1 + 4).toFixed(1);
  };

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

  const rating = getRandomRating();

  return (
    <div className="bg-white rounded-2xl shadow-2xl max-w-md mx-auto overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
      {/* Header with celebration */}
      <div className="bg-gradient-to-r from-accent to-accent-2 p-4 text-center text-white">
        <div className="text-3xl mb-2">🎉</div>
        <h2 className="text-lg font-bold">Kết quả của bạn!</h2>
      </div>

      {/* Location Image Placeholder */}
      <div className="h-48 bg-gradient-to-br from-panel to-panel-2 flex items-center justify-center">
        <div className="text-center text-muted">
          <div className="text-4xl mb-2">📍</div>
          <p className="text-sm">Hình ảnh địa điểm</p>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        {/* Name and Category */}
        <div>
          <h3 className="text-xl font-bold text-text mb-2">{location.name}</h3>
          {location.type && (
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getCategoryBadgeColor(location.type)}`}>
              {location.type}
            </span>
          )}
        </div>

        {/* Address */}
        <div className="flex items-start space-x-3">
          <div className="text-brand mt-1">📍</div>
          <div>
            <p className="text-sm text-text">{location.address}</p>
          </div>
        </div>

        {/* Description */}
        <div className="flex items-start space-x-3">
          <div className="text-brand mt-1">ℹ️</div>
          <div>
            <p className="text-sm text-muted">{location.description}</p>
          </div>
        </div>

        {/* Phone (if available) */}
        {location.phone && (
          <div className="flex items-center space-x-3">
            <div className="text-brand">📞</div>
            <div>
              <p className="text-sm text-text">{location.phone}</p>
            </div>
          </div>
        )}

        {/* Hours (if available) */}
        {location.hours && (
          <div className="flex items-center space-x-3">
            <div className="text-brand">🕐</div>
            <div>
              <p className="text-sm text-text">{location.hours}</p>
            </div>
          </div>
        )}

        {/* Rating */}
        <div className="flex items-center space-x-2">
          <div className="flex text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <span key={i} className={i < Math.floor(parseFloat(rating)) ? '★' : '☆'}>
                {i < Math.floor(parseFloat(rating)) ? '★' : '☆'}
              </span>
            ))}
          </div>
          <span className="text-sm font-semibold text-text">{rating}/5</span>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3 pt-4">
          <button
            onClick={handleOpenMaps}
            className="flex-1 bg-brand text-white py-3 px-4 rounded-xl font-semibold hover:bg-brand/90 transition-colors duration-200 flex items-center justify-center space-x-2"
          >
            <span>📍</span>
            <span>Chỉ đường</span>
          </button>

          <button
            onClick={onSpinAgain}
            className="flex-1 bg-gray-100 text-text py-3 px-4 rounded-xl font-semibold hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center space-x-2"
          >
            <span>🔄</span>
            <span>Quay lại</span>
          </button>
        </div>
      </div>
    </div>
  );
}