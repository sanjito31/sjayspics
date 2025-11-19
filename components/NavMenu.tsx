import { Menu, Eclipse, Trees, Building, TreePalm } from "lucide-react"
import { Button } from "./ui/button"
import Link from "next/link"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Label } from "./ui/label"



export default function NavMenu() {


    return (
        <Popover>
            <PopoverTrigger>
                <Menu></Menu>
            </PopoverTrigger>
            <PopoverContent align="start">
                <div className="flex items-center font-mono">
                    <p className="m-2 font-semibold text-xl border-white">Collections</p>
                    <div className="flex flex-col items-start justify-center ml-2">
                        
                        <Button variant="ghost" name="astro" className="px-2">
                            <Link href="/collections/astrophotography">
                                    <Eclipse />
                            </Link>
                            <Label htmlFor="astro">Astro</Label>
                        </Button>
                        <Button variant="ghost" name="nature" className="px-2">
                            <Link href="/collections/nature">
                                    <Trees />
                            </Link>
                            <Label htmlFor="nature">Nature</Label>
                        </Button>
                        <Button variant="ghost" name="nyc" className="px-2">
                            <Link href="/collections/nyc">
                                    <Building />
                            </Link>
                            <Label htmlFor="nyc">NYC</Label>
                        </Button>
                        <Button variant="ghost" name="los-angeles" className="px-2">
                            <Link href="/collections/los-angeles">
                                    <TreePalm />
                            </Link>
                            <Label htmlFor="los-angeles">LA</Label>
                        </Button>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    )
}