USE Campaign;

ALTER TABLE CampaignEntry DROP COLUMN UsersFactionId;
ALTER TABLE CampaignEntry ADD COLUMN AttackingFactionId INT NOT NULL