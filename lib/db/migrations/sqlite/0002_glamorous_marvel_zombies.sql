CREATE TABLE `user_billing` (
	`userId` text PRIMARY KEY NOT NULL,
	`stripeCustomerId` text,
	`stripeSubscriptionId` text,
	`stripePriceId` text,
	`stripeSubscriptionStatus` text,
	`stripeCurrentPeriodEnd` integer,
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_billing_stripeCustomerId_unique` ON `user_billing` (`stripeCustomerId`);--> statement-breakpoint
ALTER TABLE `user` DROP COLUMN `stripeCustomerId`;--> statement-breakpoint
ALTER TABLE `user` DROP COLUMN `stripeSubscriptionId`;--> statement-breakpoint
ALTER TABLE `user` DROP COLUMN `stripePriceId`;--> statement-breakpoint
ALTER TABLE `user` DROP COLUMN `stripeSubscriptionStatus`;--> statement-breakpoint
ALTER TABLE `user` DROP COLUMN `stripeCurrentPeriodEnd`;