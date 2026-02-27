"use client"

import { signOut } from "@/lib/auth/auth-client"
import { DropdownMenuItem } from "./ui/dropdown-menu"
import { useRouter } from "next/navigation"

export default function LogoutBtn() {
    const router = useRouter()
    return (
        <DropdownMenuItem
            onClick={async () => {
                const res = await signOut()
                if(res.data) {
                router.push("/login")
                }else {
                    alert("Failed to logout")
                }
            }}
        >
            Logout
        </DropdownMenuItem>
    )
}