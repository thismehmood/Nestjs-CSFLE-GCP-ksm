export interface Patient {
  bloodGroup: string;
  ethnicity: string;
  medications: Medication[];
  allergies: Allergy[];
  overallHealth: string;
  healthProblems: string[];
  familyHistory: string[];
  otherFamilyHistories: OtherFamilyHistory[];
}

interface Medication {
  name: string;
  dosage: string;
  status: boolean;
}

interface Allergy {
  allergicTo: string;
  reaction: string;
  stillAllergic: boolean;
}

interface OtherFamilyHistory {
  relationship: string;
  description: string;
}
