use Campaign;

create table AuthorizationToken (
    Id int not null AUTO_INCREMENT,
    HashedToken char(64) not null,
    UserId int not null,
    Expires datetime not null,
    primary key (Id),
    foreign key AuthorizationToken_User (UserId) references User(Id)
) 