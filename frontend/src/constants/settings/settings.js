// ACCOUNT SETTINGS
const AccountSettings = [

    // personal information (section 1)
    {
    sectionName: 'View and edit personal information',

    options:[  
    // view account details
    {
        label: 'View account details',
        path: '/account-details',
        type: 'link',
    },

    //    change name
    {
        label: 'Change name',
        path: '/change-name',
        type: 'link',
    },
    //    change email
    {
        label: 'Change email',
        path: '/change-email',
        type: 'link',
    },
    ]
},

// transaction management (section 2)
{
    sectionName:  'Transaction management',
    options: [ 
        // view transaction status
        {
        label: 'View transaction summary',
        path: '/transaction-status',
        type: 'button',
    },
    // set monthly budget
    {
        label: 'Set monthly budget',
        path: '/set-budget',
        type: 'link',
    },
    // clear all transactions
    {
        label: 'Clear all transactions',
        path: '/clear-all-transactions',
        type: 'button'
    }
    ]
},
{
     // privacy and security ( section 3 )
    sectionName: 'Privacy and Security',

    // change account password
    options: [{
        label: 'Change password',
        path: '/change-password',
        type: 'link',
    },
    // delete account
    {
        label: 'Delete account',
        path: '/delete-account',
        type: 'link'
        
    },
    // log out from account
    {
        label: 'Log out',
        path: '/logout',
        type: 'button',
    }]
}
]

export default AccountSettings;