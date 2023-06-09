import dynamic from "next/dynamic";

const PhaserComponent = dynamic(() => import("../components/PhaserComponent"), {
  ssr: false,
});

export default function Home() {
  return (
    <>
      <PhaserComponent />
    </>
  );
}
