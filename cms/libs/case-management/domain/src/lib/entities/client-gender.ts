export class ClientGender{
        clientGenderId :string|null=null;
        clientId :number=0;
        clientGenderCode !:string;
        otherDesc :string|null=null;       
        creatorId :string|null=null;
        creationTime? :Date|null=null;
        lastModifierId :string|null=null;
        lastModificationTime? :Date|null=null;
        isDeleted :boolean=false;
        deleterId :string|null=null;
        deletionTime? :Date|null=null;
        extraProperties :string|null=null;
        concurrencyStamp :string|null=null;
        activeFlag :string='';
}