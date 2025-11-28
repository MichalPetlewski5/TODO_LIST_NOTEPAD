import { useEffect, useState } from "react"
import { api } from "../utils/api"
import { getToken } from "../utils/auth"

export interface AccountData {
    id: string,
    name: string,
    email: string
}

const useUserAccount = (): AccountData | undefined => {
    const [userAccount, setUserAccount] = useState<AccountData | undefined>()

    useEffect(() => {
        const fetchUserAccount = async () => {
            try{
                const token = getToken()
                if (!token) return;

                const account: AccountData = await api("/accounts")
                setUserAccount(account)
            } catch (err: any){
                console.error(`Failed to fetch user account: ${err.message}`)
            }
        }

        fetchUserAccount()
    }, [])

    return userAccount
}

export default useUserAccount