import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Trang chủ",
  description: "Trang chủ của Productic, được tạo bởi Được dev",
};

export default function Home() {
  return (
    <main className="flex items-center justify-center">
      <p className="text-2xl font-bold text-center">
        Xin chào Khách NHA!!!! ĐĂNG NHẬP ĐI
      </p>
    </main>
  );
}
