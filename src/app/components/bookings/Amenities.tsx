// src/app/components/booking/Amenities.tsx
import { Wifi, Car, Coffee, Dog } from "lucide-react";
import IconCircle from "../ui/IconCircle";

type Meta = { wifi?: boolean; parking?: boolean; breakfast?: boolean; pets?: boolean } | undefined;

export default function Amenities({ meta }: { meta: Meta }) {
  const A = meta || {};
  return (
    <div className="mt-5 flex flex-wrap items-center justify-center gap-4 md:gap-5">
      <IconCircle active={!!A.pets} Icon={Dog} label="Pets" />
      <IconCircle active={!!A.wifi} Icon={Wifi} label="Wi-Fi" />
      <IconCircle active={!!A.breakfast} Icon={Coffee} label="Breakfast" />
      <IconCircle active={!!A.parking} Icon={Car} label="Parking" />
    </div>
  );
}
