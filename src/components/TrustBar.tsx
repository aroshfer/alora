import { BadgeCheck, Truck, Headphones } from "lucide-react";

export default function TrustBar() {
  const items = [
    { icon: BadgeCheck, label: "Genuine Brands Only" },
    { icon: Truck, label: "Islandwide Delivery" },
    { icon: Headphones, label: "Real Human Support" },
    { icon: BadgeCheck, label: "Easy 3x Instalments" },
  ];

  return (
    <div className="trust-bar">
      <div className="trust-track">
        {[...Array(2)].flatMap((_, loop) =>
          items.map((item, i) => {
            const Icon = item.icon;
            return (
              <span key={`${loop}-${i}`}>
                <Icon size={13} /> {item.label}
              </span>
            );
          })
        )}
      </div>
    </div>
  );
}
