import React, { useState, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import type { Dish } from '../data/dishes';

interface SpinWheelProps {
    items: Dish[];
    onSpinEnd?: (dish: Dish) => void;
}

const COLORS = [
    '#FF6B6B', // Đỏ nhạt
    '#4ECDC4', // Xanh ngọc
    '#FFE66D', // Vàng
    '#FF9F43', // Cam
    '#A8E6CF', // Xanh lá mạ
    '#FF8B94', // Hồng
    '#C7CEEA', // Tím nhạt
    '#FFDAC1', // Cam đào
];

export default function SpinWheel({ items, onSpinEnd }: SpinWheelProps) {
    const [isSpinning, setIsSpinning] = useState(false);
    const controls = useAnimation();
    const rotationRef = useRef(0); // Lưu góc quay hiện tại để quay tiếp từ đó

    // Fallback if data is missing or undefined
    const safeItems = items || [];
    if (safeItems.length === 0) {
        console.warn("SpinWheel: No items provided");
    }

    // Đảm bảo có ít nhất 1 món để tránh lỗi chia cho 0
    const wheelItems = safeItems.length > 0 ? safeItems : [{ id: '0', name: 'Đang tải...', image: '', description: '', priceRange: '', suggestedPlaces: [] }];

    const numSlices = wheelItems.length;
    const sliceAngle = 360 / numSlices;

    const handleSpin = async () => {
        if (isSpinning) return;
        setIsSpinning(true);

        // 1. Tính toán ngẫu nhiên
        // Quay ít nhất 5 vòng (1800 độ) + một góc ngẫu nhiên
        const randomOffset = Math.random() * 360;
        const newRotation = rotationRef.current + 1800 + randomOffset;

        // 2. Bắt đầu quay animation
        await controls.start({
            rotate: newRotation,
            transition: { duration: 4, ease: [0.2, 0.8, 0.2, 1] } // Easing kiểu "bánh xe trôi"
        });

        // 3. Cập nhật ref để lần sau quay tiếp
        rotationRef.current = newRotation;

        // 4. TÍNH TOÁN KẾT QUẢ (Logic sửa lỗi sai món)
        // Vì kim chỉ ở góc 12 giờ (tức là góc -90 độ trong SVG hoặc 270 độ).
        // Tuy nhiên, CSS rotate quay container.
        // Góc thực tế của bánh xe so với điểm xuất phát (Mod 360)
        const normalizedRotation = newRotation % 360;

        // Tính góc bù lại để tìm ra miếng nào đang ở đỉnh (Góc 0/360 của bánh xe sau khi quay)
        // Công thức: (360 - góc quay) % 360
        const degreesFromZero = (360 - normalizedRotation) % 360;

        // Xác định index
        const winningIndex = Math.floor(degreesFromZero / sliceAngle);

        // Đảm bảo index nằm trong giới hạn (phòng trường hợp 360/360)
        const finalIndex = winningIndex >= numSlices ? 0 : winningIndex;

        // 5. Kết thúc
        setIsSpinning(false);
        const result = wheelItems[finalIndex];

        if (onSpinEnd) {
            onSpinEnd(result!); // Thêm dấu chấm than để bảo TS "Yên tâm, tôi lo được"
        }

        // Dispatch custom event for Astro page
        if (typeof window !== 'undefined') {
            const event = new CustomEvent('spin-complete', { detail: result });
            window.dispatchEvent(event);
        }
    };

    // Hàm tạo đường cong SVG (Arc)
    const getCoordinatesForPercent = (percent: number) => {
        const x = Math.cos(2 * Math.PI * percent);
        const y = Math.sin(2 * Math.PI * percent);
        return [x, y];
    };

    return (
        <div className="relative flex flex-col items-center justify-center py-10">
            {/* Container của Vòng quay */}
            <div className="relative w-[320px] h-[320px] md:w-[450px] md:h-[450px]">

                {/* Mũi tên chỉ (Pointer) - Đứng yên ở trên cùng */}
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-20 text-red-600 drop-shadow-xl">
                    <ArrowDown size={50} fill="currentColor" strokeWidth={3} />
                </div>

                {/* Bánh xe xoay */}
                <motion.div
                    className="w-full h-full rounded-full border-8 border-white shadow-2xl overflow-hidden bg-white"
                    animate={controls}
                    style={{ originX: 0.5, originY: 0.5 }}
                >
                    {/* SVG vẽ hình rẻ quạt */}
                    {/* Rotate -90deg để miếng đầu tiên bắt đầu từ góc 12h */}
                    <svg viewBox="-1 -1 2 2" className="w-full h-full transform -rotate-90">
                        {wheelItems.map((item, index) => {
                            const startAngle = index / numSlices;
                            const endAngle = (index + 1) / numSlices;
                            const [startX, startY] = getCoordinatesForPercent(startAngle);
                            const [endX, endY] = getCoordinatesForPercent(endAngle);
                            const largeArcFlag = sliceAngle > 180 ? 1 : 0;

                            // Vẽ miếng bánh
                            const pathData = `M 0 0 L ${startX} ${startY} A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY} Z`;

                            // Tính góc để xoay chữ nằm giữa miếng bánh
                            // Góc giữa = (start + end) / 2 * 360
                            const midAngle = (startAngle + endAngle) / 2 * 360; // Góc tính bằng độ

                            return (
                                <g key={item.id}>
                                    <path d={pathData} fill={COLORS[index % COLORS.length]} stroke="white" strokeWidth="0.02" />

                                    {/* Text - Xử lý hiển thị chữ */}
                                    <text
                                        x="0.75" // Đẩy chữ ra sát mép ngoài (bán kính = 1)
                                        y="0"
                                        fill="white"
                                        fontSize="0.09" // Chữ nhỏ lại một chút để đỡ tràn
                                        fontWeight="bold"
                                        textAnchor="end" // Căn lề phải (tính từ tâm ra)
                                        alignmentBaseline="middle"
                                        transform={`rotate(${midAngle})`} // Xoay chữ theo góc của miếng bánh
                                        style={{
                                            textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
                                            pointerEvents: 'none'
                                        }}
                                    >
                                        {/* Cắt ngắn tên nếu dài quá 15 ký tự */}
                                        {item.name.length > 15 ? item.name.substring(0, 14) + '...' : item.name}
                                    </text>
                                </g>
                            );
                        })}
                    </svg>
                </motion.div>

                {/* Nút tròn ở giữa (Trang trí) */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg z-10 border-4 border-orange-100">
                    <span className="text-2xl font-bold text-orange-500">
                        {isSpinning ? '...' : 'ĂN'}
                    </span>
                </div>
            </div>

            {/* Nút bấm quay */}
            <button
                onClick={handleSpin}
                disabled={isSpinning}
                className={`
          mt-12 px-12 py-4 rounded-full text-xl font-bold text-white shadow-xl transition-all transform
          ${isSpinning
                        ? 'bg-gray-400 cursor-not-allowed scale-95'
                        : 'bg-gradient-to-r from-orange-500 to-red-500 hover:scale-105 hover:shadow-orange-500/40 active:scale-95'}
        `}
            >
                {isSpinning ? 'Đang chọn món...' : 'QUAY NGAY!'}
            </button>
        </div>
    );
}