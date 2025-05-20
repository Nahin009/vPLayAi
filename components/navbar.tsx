import Link from "next/link";
import { ModeToggle } from "./ModeToggle";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export default function Navbar () {
    return (
        <div className="bg-black p-4 flex items-center justify-between">
            {/* Logo on the left */}
            <Link href={"/allvideos"} >
                <div className="flex items-center ml-8">
                    <img src="/logo.png" alt="Logo" className="h-8 w-auto" />
                </div>
            </Link>

            {/* Search bar in the center */}
            <div className="flex flex-row items-center px-2 py-1 w-1/3">
                <Input className=" text-white" placeholder="Find a video..." />
                <Button className="dark">Search</Button>
            </div>

            <div className="mr-8">
                <ModeToggle />
            </div>
        </div>
    )
}
