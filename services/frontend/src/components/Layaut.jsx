export default function Layaut({ children }) {
  return (
    <>
      <div className="w-full h-full flex flex-col overflow-hidden">
        {children}
      </div>
    </>
  );
}
