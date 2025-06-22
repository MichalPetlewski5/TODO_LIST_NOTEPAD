import { useEffect, useState } from "react"


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
                const storedAccountID = localStorage.getItem("accID") || sessionStorage.getItem("accID")

                if (!storedAccountID) return;

                const response = await fetch('http://localhost:3004/accounts')
                if (!response.ok){
                    throw new Error(`HTTP ERROR: ${response.status}`)
                }

                const data: AccountData[] = await response.json()
                const foundAccount = data.find((acc) => acc.id === storedAccountID)

                if (foundAccount){
                    setUserAccount(foundAccount)
                }
            } catch (err: any){
                console.error(`Failed to fetch user account: ${err.message}`)
            }
        }

        fetchUserAccount()
    }, [])

    return userAccount
}

export default useUserAccount