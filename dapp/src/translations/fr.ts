export const translations = {
    coming_soon: 'Disponible prochainement !',
    link_copied: 'Lien copié !',
    login: 'Connecter le portefeuille',
    global: {
        cancel: 'Annuler',
        confirm: 'Confirmer',
        remove: 'Retirer',
    },
    unlock_view: {
        title: 'Connecter votre portefeuille',
        instructions: 'Choisissez une méthode de connexion ci-dessous'
    },
    account_view: {
        address: 'Mon adresse',
        copy_address: 'Copier l\'adresse dans le presse-papier',
        tokens: 'Mes tokens',
        no_tokens: 'Aucun token',
        transactions: 'Dernières transactions',
        open_transaction: 'Voir dans l\'explorer',
        transaction_state: {
            successful: 'Validée',
            pending: 'En attente',
            failed: 'Échouée',
        },
        logout: 'Se déconnecter'
    },
    home: {
        kickstart: 'Démarrez votre projet avec l\'aide de la communauté',
        fundraise: 'Collectez des fonds pour une cause',
        tip: 'Collectez des fonds de la part de la communauté',
        trade: 'Échangez vos actifs en toute confiance',
        giveaway: 'Faites gagner votre communauté d\'une manière juste',
        airdrop: 'Distribuez des lots facilement à votre communauté',
    },
    tip: {
        how_to: {
            title: 'Collectez les dons de votre communauté',
            step1: {
                title: 'Étape 1 - Créez une campagne de don',
                description: 'Vous pouvez créer votre propre page. Décrivez votre activité et choisissez la monnaie que vous souhaitez recevoir pour les dons.'
            },
            step2: {
                title: 'Étape 2 - Partagez votre campagne',
                description: 'Votre campagne nouvellement créée a un lien unique que vous pouvez à présent partager à votre communauté afin qu\'ils y participent.'
            },
            step3: {
                title: 'Étape 3 - Réclamez les fonds ',
                description: 'Vous pouvez réclamer les fonds à n\'importe quel moment, autant de fois que vous le souhaitez. Vous pourrez terminer la campagne lorsque vous ne souhaiterez plus recevoir de dons.'
            },
        },
        list: {
            how_to: 'Comment ça marche ?',
            see_code: 'Voir le code du contrat',
            create_campaign: 'Créer <1>une campagne de don</1>',
            active_campaigns: 'Campagnes en cours',
            no_active_campaigns: 'Aucune campagne créée',
            ended_campaigns: 'Campagnes terminées',
            no_ended_campaigns: 'Aucune campagne terminée',
        },
        page: {
            share: 'Partagez le lien de cette campagne',
            total_amount: 'Montant total collecté',
            total_donations: 'Nombre de dons',
            total_participants: 'Nombre de participants',
            claimable: 'Montant à retirer',
            ended: 'Cette campagne est terminée',
            claim: 'Retirer',
            tip: 'Faire un don',
            amount: {
                label: 'Je souhaite donner',
                errors: {
                    required: 'Le montant ne doit pas être vide',
                    min: 'Le montant doit être supérieur à 0',
                },
            },
            edit_campaign: 'Modifier la campagne',
            end_campaign: 'Terminer la campagne',
            end_confirm: {
                title: 'Terminer la campagne',
                content: 'Êtes-vous sûr･e de vouloit terminer cette campagne ?<1/><2>Vous ne serez plus en mesure de l\'ouvir à nouveau. <1/> Tous les fonds non retirés seront envoyés à votre adresse.</2>'
            }
        },
        create_modal: {
            title: 'Créer une campagne de don',
            drop_files: 'Déposez le fichier ici ...',
            drag_files: 'Glissez un fichier ici, ou cliquez pour en choisir un',
            create: 'Créer la campagne',
            name: {
                label: 'Title',
                placeholder: 'Soutenez mon activité !',
                errors: {
                    required: 'Le titre est requis',
                },
            },
            currency: {
                label: 'Monnaie',
            },
            description: {
                label: 'Description',
                placeholder: 'Je fais des choses super. Aidez-moi à les rendre géniales !',
                errors: {
                    required: 'La description ne doit pas être vide',
                },
            },
            fee_notice: 'Créer une campagne de don requiert une transaction sur le réseau Elrond (frais de tx: ~0.001egld)',
            data_notice: '⚠︎ Les metadonnées et l\'image sont stoquées sur <1>IPFS</1> de façon <3>permanente et immuable</3>, dès lors que vous envoyez ce formulaire.<5/>Veuillez vous assurer de ne pas envoyer de données sensibles.',
        },
        edit_modal: {
            title: 'Modifier la campagne',
            drop_files: 'Déposez le fichier ici ...',
            drag_files: 'Glissez un fichier ici, ou cliquez pour en choisir un',
            edit: 'Modifier la campagne',
            name: {
                label: 'Title',
                placeholder: 'Soutenez mon activité !',
                errors: {
                    required: 'Le titre est requis',
                },
            },
            currency: {
                label: 'Monnaie',
            },
            description: {
                label: 'Description',
                placeholder: 'Je fais des choses super. Aidez-moi à les rendre géniales !',
                errors: {
                    required: 'La description ne doit pas être vide',
                },
            },
            fee_notice: 'Modifier une campagne de don requiert une transaction sur le réseau Elrond (frais de tx: ~0.001egld)',
            data_notice: '⚠︎ Les metadonnées et l\'image sont stoquées sur <1>IPFS</1> de façon <3>permanente et immuable</3>, dès lors que vous envoyez ce formulaire.<5/>Veuillez vous assurer de ne pas envoyer de données sensibles.',
        },
    },
    trade: {
        how_to: {
            title: 'Échangez vos actifs en toute confiance',
            step1: {
                title: 'Étape 1 - Créez une offre',
                description: 'Créez une offre d\'échange en choisissant le token et le montant que vous souhaitez offrir ainsi que le token et le montantque vous souhaitez en échange. Vous pouvez réserver l\'échange pour une addresse spécifique si vous la connaissez d\'avance.'
            },
            step2: {
                title: 'Étape 2 - Envoyez le lien de votre offre',
                description: 'Votre offre nouvellement créée possède un lien unique que vous pouvez à présent envoyer au(x) destinataire(s) de cet échange.',
            },
            step3: {
                title: 'Étape 3 - Attendez la fin de l\'échange',
                description: 'C\'est à l\'autre d\'envoyer sa partie de l\'échange à présent. Dès que les fonds seront envoyés par l\'autre partie, l\'échange se fera et vous recevrez chacun la somme qui vous est dûe.'
            },
        },
        card: {
            offered: 'Proposé',
            requested: 'Demandé'
        },
        list: {
            how_to: 'Comment ça marche ?',
            see_code: 'Voir le code du contrat',
            create_trade: 'Créer <1>une offre</1>',
            my_trades: 'Mes échanges',
            no_pending_trades: 'Pas d\'échange en attente',
            reserved_trades: 'Échange réservés',
            no_reserved_trades: 'Pas d\'échange réservé',
        },
        page: {
            successful: 'Échange effectué',
            not_found: 'Offre introuvable',
            share: 'Envoyez le lien de cet échange',
            top_notice_owner: 'Vous avez créé cette offre :',
            top_notice_reserved: 'Cette offre a été réservée pour vous :',
            trade: 'Échanger',
            created_by: 'Créee par <0/>',
            reserved_by: 'Réservée pour <0/>',
            cancel_trade: 'Annuler l\'échange',
            cancel_confirm: {
                title: 'Annuler l\'échange',
                content: 'Êtes-vous sûr･e de vouloir annuler cet échange ?<1/><2>Vos fonds seront renvoyés sur votre adresse.</2>'
            }
        },
        create_modal: {
            title: 'Créer une offre d\'échange',
            create: 'Créer une offre',
            offered: {
                label: 'Je souhaite proposer',
                errors: {
                    min: 'Vous devez proposer au moins 0.01 <0/>'
                }
            },
            requested: {
                label: 'En échange de',
                errors: {
                    min: 'Vous devez demander au moins 0.01 <0/>'
                }
            },
            reserved_for: {
                label: 'Réserver l\'échange pour',
                placeholder_address: 'Entrer l\'adresse erd',
                placeholder_herotag: 'Rechercher un @herotag',
                errors: {
                    invalid: 'Format de l\'adresse non valide'
                }
            },
            fee_notice: 'Créer une offre d\'échange requiert d\'envoyer une transaction sur le réseau Elrond (frais de tx: ~0.001egld)',
            completion_notice: 'Les fonds sont envoyés aux parties respectives automatiquement dès que le contrat reçois la partie restante de l\'échange.',
        }
    },
    footerMessage: 'Fait avec <1/> pour la communauté Elrond.',
    page_not_found: 'Page introuvable'
};
