// Navigation-bar links
import {CreditCardIcon, PlusCircle, UserCircle2 } from "lucide-react"
export const NavLinks =  [   {
        // All transactions
            label: 'Transactions',
            path: '/',
            icon: CreditCardIcon ,
            className: 'nav-icon me-2'
        },
        // link to add transaction
        {
            label: 'Add Transaction',
            path: '/add-transaction',
            icon: PlusCircle,
            className: 'nav-icon me-2 text-info'
        },
        // settings
        {
            label: 'Settings',
            path: '#settings',
            icon: UserCircle2,
            className: 'nav-icon me-2'
        },
]