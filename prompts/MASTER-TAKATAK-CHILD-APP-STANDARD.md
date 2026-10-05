# PROMPT MAÎTRE — STANDARD GROUPE TAKATAK / TAKATAK AUTH / TAKATAK DASHBOARD

Contexte général:
Ce site/application fait partie de l’écosystème GROUPE TAKATAK.

GROUPE TAKATAK est le cerveau central de tout l’écosystème.  
TAKATAK Auth est le standard d’identité, connexion, inscription, OTP, rôles et accès.  
TAKATAK Dashboard est le centre d’opérations qui gère les utilisateurs, entreprises, permissions, analytics, marketing, publicité, billing, social, intégrations et administration.

Ce projet est une application enfant.  
Elle garde ses propres données métier, son identité visuelle spécifique et ses fonctionnalités propres, mais elle doit suivre le même standard de connexion, compte utilisateur, portail professionnel et intégration future avec TAKATAK Dashboard.

Règle d’architecture obligatoire:
- GROUPE TAKATAK = autorité centrale
- TAKATAK Auth = identité maître / connexion / inscription / OTP / rôles
- TAKATAK Dashboard = opérations centrales / backend maître / admin / analytics / marketing / intégrations
- Application enfant = site ou app spécialisée avec ses propres données métier
- Ne jamais créer un deuxième système d’identité maître
- Ne jamais créer un backend central séparé qui duplique TAKATAK
- Ne jamais faire communiquer directement deux applications enfants entre elles
- Toute communication inter-app doit suivre:
  Application enfant → GROUPE TAKATAK / TAKATAK Dashboard → application autorisée

Important:
Ne pas prétendre que l’intégration production TAKATAK est déjà active si l’adapter/API officiel n’existe pas encore.
Préparer le site pour l’intégration TAKATAK, mais ne pas créer une fausse connexion.

Objectif:
Mettre en place un standard uniforme pour tous mes sites:
- même logique de connexion
- même logique d’inscription
- même accès client
- même accès professionnel/marchand
- même structure de compte
- même UX de langue
- même compatibilité future avec TAKATAK Dashboard
- même style professionnel, moderne, premium, mobile-first

## 1. Authentification standard TAKATAK

Le site doit avoir une expérience de connexion inspirée de TAKATAK Auth.

Prévoir:
- connexion email/mot de passe
- inscription email
- connexion Google si configurée
- connexion Facebook seulement si réellement configurée
- connexion Apple seulement si réellement configurée
- vérification téléphone/SMS OTP si configurée
- vérification email OTP si configurée
- mot de passe oublié
- réinitialisation mot de passe
- gestion des erreurs claire
- chargement propre
- messages humains et professionnels

Ne jamais afficher un bouton social qui ne fonctionne pas.
Si un provider n’est pas configuré, le cacher ou afficher “Bientôt disponible” de manière propre.

## 2. Rôles utilisateurs

Le système doit clairement supporter:

- Client / utilisateur normal
- Professionnel / marchand / entreprise
- Admin
- Futur opérateur TAKATAK / dashboard

Un même utilisateur peut avoir plusieurs rôles.
Exemple:
Le même email peut être client et professionnel.

Le site doit permettre:
- accès client
- accès professionnel
- changement de mode si l’utilisateur a plusieurs rôles
- portail professionnel
- tableau de bord marchand/entreprise
- retour au mode client

Ne pas créer des comptes doublons inutilement.

## 3. Header / navigation standard

Le header doit être uniforme sur tous les sites.

Inclure:
- logo du site/app
- navigation principale
- sélecteur de langue compact
- bouton compte
- menu compte propre
- accès client
- accès professionnel
- CTA “Enregistrer mon entreprise” ou équivalent si applicable
- CTA “Accéder au portail professionnel”
- connexion / inscription
- profil
- paramètres
- déconnexion

Langues:
- FR
- EN
- ES

Ne pas créer une grosse infrastructure de traduction si elle n’existe pas encore, mais l’interface doit être prête pour le multilingue.

## 4. Menu compte standard

Le menu compte doit inclure selon l’état de l’utilisateur:

Si déconnecté:
- Se connecter
- Créer un compte
- Continuer avec Google, si configuré
- Connexion email
- Connexion téléphone/SMS, si configurée
- Devenir professionnel, si applicable

Si connecté client:
- Mon profil
- Mes projets
- Mes favoris / collections
- Mes avis
- Paramètres
- Devenir professionnel
- Déconnexion

Si connecté professionnel/marchand:
- Tableau de bord professionnel
- Mon entreprise
- Mes messages
- Mes notifications
- Mes demandes clients
- Facturation / plans
- Améliorer ma visibilité
- Retour au mode client
- Déconnexion

## 5. Portail professionnel / marchand

Chaque site qui contient des entreprises, services, réservations, ventes, projets ou clients doit prévoir un portail professionnel.

Le portail professionnel doit suivre le standard TAKATAK Dashboard:

- Accueil / tableau de bord
- Informations entreprise
- Profil public
- Services / produits
- Photos / médias
- Horaires
- Statut ouvert/fermé
- Messages
- Notifications
- Demandes clients / leads
- Analytics
- Publicité / visibilité
- Plans / facturation
- Paramètres
- Support
- Menu

Ne pas dupliquer la logique centrale de TAKATAK Dashboard.
Le portail local peut gérer les données spécifiques au site, mais l’architecture doit rester compatible avec TAKATAK.

## 6. Inscription entreprise / professionnel

Le flow d’inscription entreprise doit inclure:

- nom de l’entreprise
- nom du propriétaire/responsable
- email
- téléphone
- vérification OTP si disponible
- adresse
- ville
- province
- code postal
- pays
- Google Places autocomplete si disponible
- catégorie / type de service
- description
- photos/logo
- site web
- réseaux sociaux
- horaires
- zone de service
- acceptation des conditions
- création du profil professionnel

Il doit y avoir une protection contre les doublons:
- ne pas créer deux entreprises pour le même utilisateur sans confirmation
- détecter si l’utilisateur a déjà une entreprise
- rediriger vers le portail existant si applicable

## 7. QR d’inscription professionnelle

Si pertinent, ajouter un QR code professionnel:

Texte:
“Scannez pour enregistrer votre entreprise”
“Continuer l’inscription sur mobile”

Le QR doit pointer vers:
- la page d’inscription professionnelle
- ou le portail d’onboarding
- avec tracking source si disponible

Le QR ne doit jamais contourner l’auth, les permissions ou la sécurité.

## 8. UX visuelle standard

Tous les sites doivent avoir un style professionnel, premium, moderne et humain.

Direction:
- moins IA
- moins template
- plus premium
- plus humain
- mobile-first
- interface claire
- belles cartes
- vrais états vides
- textes utiles
- animations subtiles
- boutons propres
- bonne hiérarchie visuelle

Palette recommandée TAKATAK/QMAPS:
- bleu profond
- bleu électrique
- blanc
- noir/slate
- gris clair
- accents lumineux

Le site peut adapter les couleurs selon sa marque, mais l’expérience compte/auth/portail doit rester cohérente avec GROUPE TAKATAK.

## 9. Sécurité / confidentialité

Obligatoire:
- ne jamais exposer les emails publiquement
- ne jamais exposer les données privées d’un utilisateur
- ne jamais permettre à un utilisateur de s’auto-attribuer admin
- ne jamais collecter de carte bancaire directement dans le site
- utiliser Stripe Checkout/Billing Portal ou provider sécurisé
- ne jamais mettre `.env` dans les archives/release
- protéger les routes admin
- protéger les routes professionnelles
- respecter RLS / permissions existantes
- ne pas créer de fausse connexion backend

## 10. Paiement / plans / publicité

Si le site contient des plans, add-ons, publicité ou fonctionnalités premium:

- aucun champ carte bancaire brut
- aucun faux checkout
- aucun faux succès
- tous les paiements passent par Stripe ou provider sécurisé
- si Stripe n’est pas configuré, afficher “Bientôt disponible”
- expliquer clairement ce qui est actif vs bientôt disponible
- CTA vers plans/facturation
- essai gratuit seulement si réellement supporté ou affiché comme “bientôt disponible”

## 11. Intégration future TAKATAK

Ajouter une note développeur interne:

Ce site est une application enfant de l’écosystème GROUPE TAKATAK.
L’intégration future avec TAKATAK Dashboard doit passer par un adapter/API/event boundary.
Le site ne doit pas dupliquer TAKATAK Auth ni créer un deuxième master identity.
Le site garde ses données métier locales jusqu’à l’intégration officielle.
Les données autorisées pourront éventuellement être synchronisées avec TAKATAK Dashboard.

## 12. À ne pas faire

Ne pas:
- créer un nouveau backend central parallèle
- créer un nouveau système master identity
- créer de faux providers sociaux
- créer de faux paiements
- casser l’auth existant
- casser l’onboarding existant
- casser les rôles
- casser les données métier
- dupliquer les utilisateurs inutilement
- lier directement cette app à une autre app enfant
- prétendre que TAKATAK est connecté en production si ce n’est pas vrai

## 13. Vérification finale

Avant livraison, vérifier:

- build production
- routes publiques
- login/signup
- Google login si configuré
- OTP si configuré
- profil utilisateur
- changement client/professionnel
- onboarding entreprise
- portail professionnel
- dashboard
- logout
- mobile
- erreurs
- empty states
- sécurité
- pas de `.env`
- pas de champs carte bancaire
- aucune régression backend/RLS/paiement

Retour attendu:
- fichiers modifiés
- pages modifiées
- auth/account UX résumé
- portail professionnel résumé
- providers disponibles
- OTP status
- TAKATAK integration-readiness note
- tests/build run
- confirmation qu’aucune fausse connexion TAKATAK n’a été ajoutée
- confirmation que l’app reste indépendante mais prête pour GROUPE TAKATAK

Résumé final:
Chaque site doit rester son propre produit, mais l’accès compte, l’inscription, les rôles, le portail professionnel et l’intégration future doivent suivre le standard GROUPE TAKATAK / TAKATAK Auth / TAKATAK Dashboard.
