# Form Meditations Contracts

Form is a SocialFi L2 built using the OP stack. Meditations is a campaign to bring users and assets to the Form blockchain.

The core of the Meditations campaign is a staking contract. The staking contract allows anyone to stake any amount of certain allowed assets. The users are always in control of their funds - netiher the staking contract nor any admin address should be able to move funds on behalf of the users without the user's explicit consent. The users should also be able to withdraw their staked funds at any time.

Users that deposit assets into the staking contract will accrue Form Points based on how much and for how long they have staked. The users might optionally accrue other points or tokens from other projects that might want to reward users in our staking contract. Certain assets will have a points 'boost' so they accrue points at a higher (or lower) than base-rate of points accrual.

At the end of the staking period, there will be a migration contract that will allow users to migrate their assets to the Form L2. This is optional - users can instead choose to simply unstake and not migrate over their assets. Users will get bonus points if they choose to migrate.

The contracts will have some admin features. Admin should be able to add new assets to an allowlist as and when the market for them develops. Note that we will only support ERC20 tokens and we won't support rebasing tokens. We will support ETH staking, however. Admin should be able to deploy and add a migration contract. This migration contract needs to be completely opt-in from a user point of view, i.e. a user may choose to use this contract to migrate assets or ignore it and simply unstake. The migration contract should not be allowed to force the user to migrate their assets. Admin may optionally have an emergency pause feature.

This campaign will run on the Ethereum mainnet.
