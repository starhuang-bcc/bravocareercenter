CREATE TABLE `consultation_requests` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(128) NOT NULL,
	`email` varchar(320) NOT NULL,
	`phone` varchar(32) NOT NULL,
	`serviceType` enum('career','dream') NOT NULL DEFAULT 'career',
	`consultationMode` enum('online','in_person') NOT NULL DEFAULT 'online',
	`preferredTime` varchar(512) NOT NULL,
	`message` text,
	`status` enum('new','contacted','scheduled','closed') NOT NULL DEFAULT 'new',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `consultation_requests_id` PRIMARY KEY(`id`)
);
