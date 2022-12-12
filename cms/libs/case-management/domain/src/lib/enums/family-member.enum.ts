export enum FamilyMember{
   S="S",
   D=  "D",
   P="P",
   F="F",
   OF=" OF",
   ONF="ONF",
   PSC="PSC",
   DCO="DCO"
}


export const FamilyMember2LabelMapping: Record<FamilyMember, string> = {
    [FamilyMember.S]: "Spouse",
    [FamilyMember.D]:"Dependent",
    [FamilyMember.DCO]:"Dependent (court ordered)",
    [FamilyMember.P]:"Partner",
    [FamilyMember.PSC]:"Partner (shared child)",
    [FamilyMember.OF]:"Other Family",
    [FamilyMember.ONF]:"Other Non-Family",
    [FamilyMember.F]:"Friend"

}