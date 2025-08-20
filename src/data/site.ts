export interface NavItem {
  href: string;
  titleEn: string;
  titleVi: string;
}

export interface SiteData {
  titleEn: string;
  titleVi: string;
  descriptionEn: string;
  descriptionVi: string;
  nav: NavItem[];
}

const site: SiteData = {
  titleEn: "Gia Lai Province",
  titleVi: "Tỉnh Gia Lai",
  descriptionEn:
    "Explore the Central Highlands: history, culture, attractions, cuisine, and the spirit of Gia Lai.",
  descriptionVi:
    "Khám phá Tây Nguyên: lịch sử, văn hoá, danh thắng, ẩm thực và hơi thở của Gia Lai.",
  nav: [
    { href: "/", titleEn: "Home", titleVi: "Trang chủ" },
    { href: "/history", titleEn: "History", titleVi: "Lịch sử" },
    { href: "/culture", titleEn: "Culture", titleVi: "Văn hoá" },
    { href: "/attractions", titleEn: "Attractions", titleVi: "Danh thắng" },
    { href: "/food", titleEn: "Food", titleVi: "Ẩm thực" },
    { href: "/map", titleEn: "Map", titleVi: "Bản đồ" },
    { href: "/about", titleEn: "About", titleVi: "Giới thiệu" },
  ],
};

export default site;
