"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();
  const menuItems = [
    { name: "Coaches", href: "/dashboard/coaches" },
    { name: "Settings", href: "/dashboard/settings" },
  ];

  return (
    <div className="w-56 h-screen bg-gray-800 text-white flex flex-col p-4 space-y-2">
      <h2 className="text-xl font-bold mb-4">Init</h2>
      {menuItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`text-left px-3 py-2 rounded-md block transition ${
            pathname === item.href
              ? "bg-gray-700 font-semibold"
              : "hover:bg-gray-700"
          }`}
        >
          {item.name}
        </Link>
      ))}
    </div>
  );
}
