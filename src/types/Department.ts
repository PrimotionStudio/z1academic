export interface Department {
  _id: string;
  facultyId: string;
  name: string;
  maxLevels: number;
  jambCutOff: number;
  programTitle: string;
  createdAt: Date & string;
  updatedAt: Date & string;
}

export interface InputDepartment {
  facultyId: string;
  name: string;
  maxLevels: number;
  jambCutOff: number;
  programTitle: string;
}
