import Header from "./Header";

export default function Layaut({ children }) {
  return (
    <>
      <Header />
      <div className="w-full overflow-hidden bg-black h-screen p-4">{children}</div>
    </>
  );
}
