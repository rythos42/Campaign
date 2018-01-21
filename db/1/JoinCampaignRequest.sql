use Campaign;

create table JoinCampaignRequest (
    Id int not null AUTO_INCREMENT,
    UserId int not null,
    FactionId int not null,
    CampaignId int not null,
    primary key (Id),
    foreign key JoinCampaignRequest_User (UserId) references User(Id),
    foreign key JoinCampaignRequest_Faction (FactionId) references Faction(Id),
    foreign key JoinCampaignRequest_Campaign (CampaignId) references Campaign(Id)
) 