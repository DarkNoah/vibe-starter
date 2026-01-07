ALTER TABLE `user` ADD `stripeCustomerId` text;--> statement-breakpoint
ALTER TABLE `user` ADD `stripeSubscriptionId` text;--> statement-breakpoint
ALTER TABLE `user` ADD `stripePriceId` text;--> statement-breakpoint
ALTER TABLE `user` ADD `stripeSubscriptionStatus` text;--> statement-breakpoint
ALTER TABLE `user` ADD `stripeCurrentPeriodEnd` integer;