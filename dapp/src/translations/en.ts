export const translations = {
    coming_soon: 'Coming soon !',
    link_copied: 'Link copied !',
    login: 'Connect wallet',
    global: {
        cancel: 'Cancel',
        confirm: 'Confirm',
        remove: 'Remove'
    },
    unlock_view: {
        title: 'Connect your wallet',
        instructions: 'Choose a connection method below'
    },
    account_view: {
        address: 'My address',
        copy_address: 'Copy address to clipboard',
        tokens: 'My tokens',
        no_tokens: 'No tokens yet',
        transactions: 'Latest transactions',
        open_transaction: 'Open in explorer',
        transaction_state: {
            successful: 'Successful',
            pending: 'Pending',
            failed: 'Failed',
        },
        logout: 'Disconnect'
    },
    home: {
        kickstart: 'Start your project with funds from the community',
        fundraise: 'Collect funds for people in needs',
        tip: 'Collect funding from your followers',
        trade: 'Trade your assets with confidence',
        giveaway: 'Make your followers win assets in a fair way',
        airdrop: 'Distribute assets easily to your community',
    },
    tip: {
        how_to: {
            title: 'Collect tips from your supporters',
            step1: {
                title: 'Step 1 - Create a campaign',
                description: 'You can create your own page. Describe your activity and the currency you want to receive.'
            },
            step2: {
                title: 'Step 2 - Share your campaign',
                description: 'Your newly created campaign has a unique link that you can now share with you supporters in order for them to participate.'
            },
            step3: {
                title: 'Step 3 - Claim funds ',
                description: 'You can claim whenever you like. You\'ll be able to close it when you no longer need it.'
            },
        },
        list: {
            how_to: 'How it works ?',
            see_code: 'See contract source code',
            create_campaign: 'Create <1>campaign</1>',
            active_campaigns: 'Active campaigns',
            no_active_campaigns: 'No campaigns created yet',
            ended_campaigns: 'Ended campaigns',
            no_ended_campaigns: 'No campaigns ended yet',
        },
        page: {
            share: 'Share this campaign',
            total_amount: 'Total amount collected',
            total_donations: 'Total donations',
            total_participants: 'Total participants',
            claimable: 'Claimable',
            ended: 'This campaign has ended',
            claim: 'Claim',
            tip: 'Tip',
            amount: {
                label: 'I want to give',
                errors: {
                    required: 'Amount is required',
                    min: 'Amount should be a positive value',
                },
            },
            edit_campaign: 'Edit campaign',
            end_campaign: 'End campaign',
            end_confirm: {
                title: 'End campaign',
                content: 'Are you sure you want to end this campaign ?<1/><2>You won\'t be able to able to reopen it afterwards.<4/>All unclaimed funds will be sent to your address.</2>'
            },
        },
        create_modal: {
            title: 'Create a campaign',
            drop_files: 'Drop the files here ...',
            drag_files: 'Drag some files here, or click to select files',
            create: 'Create campaign',
            name: {
                label: 'Title',
                placeholder: 'Support my activity !',
                errors: {
                    required: 'Title is required',
                },
            },
            currency: {
                label: 'Currency',
            },
            description: {
                label: 'Description',
                placeholder: 'I do great stuff for a living. Please help me make it awesome !',
                errors: {
                    required: 'Description is required',
                },
            },
            fee_notice: 'Creating a campaign requires a transaction on the Elrond Network (Tx fee: ~0.001egld)',
            data_notice: '⚠︎ Data is stored on <1>IPFS</1> in a <3>immutable permanent</3> way, as soon as you submit this form.<5/>Please make sure not to send sensible data.',
        },
        edit_modal: {
            title: 'Edit campaign',
            drop_files: 'Drop the files here ...',
            drag_files: 'Drag some files here, or click to select files',
            edit: 'Edit campaign',
            name: {
                label: 'Title',
                placeholder: 'Support my activity !',
                errors: {
                    required: 'Title is required',
                },
            },
            currency: {
                label: 'Currency',
            },
            description: {
                label: 'Description',
                placeholder: 'I do great stuff for a living. Please help me make it awesome !',
                errors: {
                    required: 'Description is required',
                },
            },
            fee_notice: 'Editing a campaign requires a transaction on the Elrond Network (Tx fee: ~0.001egld)',
            data_notice: '⚠︎ Data is stored on <1>IPFS</1> in a <3>immutable permanent</3> way, as soon as you submit this form.<5/>Please make sure not to send sensible data.',
        },
    },
    trade: {
        how_to: {
            title: 'Trade your assets with confidence',
            step1: {
                title: 'Step 1 - Create an offer',
                description: 'Create a trade offer by selecting the token and amount you want to offer and the token and amount you want in exchange.You can reserve the trade for a specific account if you already know its address.'
            },
            step2: {
                title: 'Step 2 - Send your trade offer',
                description: 'Your newly created offer has a unique link that you can now send directly to the account for which the trade is reserved \(or anyone who\'d fill the trade\).',
            },
            step3: {
                title: 'Step 3 - Wait for the trade to proceed',
                description: 'It\'s up to whoever you sent the trade to proceed now. As soon as they send the requested amount of token asked, the trade will proceed and you\'ll both receive your funds.'
            },
        },
        card: {
            offered: 'Offered',
            requested: 'Requested'
        },
        list: {
            how_to: 'How it works ?',
            see_code: 'See contract source code',
            create_trade: 'Create <1>trade</1>',
            my_trades: 'My trades',
            no_pending_trades: 'No trade created yet',
            reserved_trades: 'Reserved trades',
            no_reserved_trades: 'No trade reserved',
        },
        page: {
            successful: 'Trade successful',
            not_found: 'Trade not found',
            share: 'Send this offer',
            top_notice_owner: 'You created this trade :',
            top_notice_reserved: 'This trade has been reserved for you :',
            trade: 'Trade',
            created_by: 'Created by <0/>',
            reserved_by: 'Reserved for <0/>',
            cancel_trade: 'Cancel trade',
            cancel_confirm: {
                title: 'Cancel trade',
                content: 'Are you sure you want to cancel this trade ?<1/><2>Your funds will be returned to your address.</2>'
            }
        },
        create_modal: {
            title: 'Create a trade',
            create: 'Create trade',
            offered: {
                label: 'I want to offer',
                errors: {
                    min: 'You need to offer at least 0.01 <0/>'
                }
            },
            requested: {
                label: 'In exchange for',
                errors: {
                    min: 'You need to ask at least 0.01 <0/>'
                }
            },
            reserved_for: {
                label: 'Reserve trade for',
                placeholder_address: 'Enter erd address',
                placeholder_herotag: 'Search @herotag',
                errors: {
                    invalid: 'Invalid address format'
                }
            },
            fee_notice: 'Creating a trade requires a transaction on the Elrond Network (Tx fee: ~0.001egld)',
            completion_notice: 'Assets are sent to destination as soon as the contract receive the requested counterpart assets.',
        }
    },
    footerMessage: 'Made with <1/> for the Elrond community.',
    page_not_found: 'Page not found'
};
