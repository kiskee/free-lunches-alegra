export default function Layaut({ children }) {
  return (
    <>
      <div className="w-full h-screen flex flex-col overflow-hidden">
        {children}
      </div>
    </>
  );
}
