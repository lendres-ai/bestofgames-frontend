import dynamic from "next/dynamic";

const WishlistClient = dynamic(() => import("./WishlistClient"), { ssr: false });

export default function WishlistPage() {
  return <WishlistClient />;
}

