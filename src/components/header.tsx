"use client";
import { useAppContext } from "@/app/app-provider";
import ButtonLogout from "@/components/button-logout";
import { ModeToggle } from "@/components/mode-toggle";
import Link from "next/link";

export default function Header() {
  const { user } = useAppContext();

  const url = "https://development.tuantmstudyingnestjs.xyz/login";
  // const environmentName =
  //   window.location.href.split("://")[1].split(".")[0] !== ""
  //     ? window.location.href.split("://")[1].split(".")[0]
  //     : "production";

  const environmentName =
    url.split("://")[1].split(".")[0] !== ""
      ? url.split("://")[1].split(".")[0]
      : "production";

  return (
    <div className="flex flex-col space-x-4 items-center justify-center min-h-[200px] hover:bg-slate-500 hover:text-slate-50">
      <h2>Môi trường: {environmentName}</h2>
      <div className="flex flex-row space-x-4 items-center justify-center">
        <ul className="flex space-x-4">
          <li>
            <Link href="/products">Sản phẩm</Link>
          </li>

          {user ? (
            <>
              <li>
                <Link href={"/me"}>
                  Xin chào <strong>{user.name}</strong>
                </Link>
              </li>
              <li>
                <ButtonLogout />
              </li>
            </>
          ) : (
            <>
              <li>
                <Link href="/login">Đăng nhập</Link>
              </li>
              <li>
                <Link href="/register">Đăng ký</Link>
              </li>
            </>
          )}
        </ul>
        <ModeToggle />
      </div>
    </div>
  );
}
