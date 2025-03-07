import Header from "./Header";

export default function Layaut({children}){


    return (
        <>
        <Header />
        <div className="flex flex-col min-h-screen bg-black">
        {children}

        </div>
        </>
    )
}