export type Periodo = "manha" | "almoco" | "tarde" | "noite";
export type MedKind = "cap1" | "cap2" | "tab1" | "tab2" | "oval";

export type Horario = {
  hora: string;
  refeicao: string;
  periodo: Periodo;
};

export type Tomada = {
  data: string;
  horario: string;
  tomadoEm: string;
};

export type Remedio = {
  id: string;
  nome: string;
  apelido?: string;
  dose: string;
  para?: string;
  kind: MedKind;
  fotoId?: string;
  horarios: Horario[];
  alarmeAtivo: boolean;
  tomadas: Tomada[];
  criadoEm: string;
};

export type DoseMock = {
  id: number;
  remedioId: string;
  nome: string;
  dose: string;
  h: string;
  periodo: Periodo;
  tomado: boolean;
  kind: MedKind;
  quando: string;
};

export type IconFC = (props: { size?: number; stroke?: number }) => React.ReactNode;

export type GroupMock = {
  key: Periodo;
  label: string;
  h: string;
  acento: string;
  Icon: IconFC;
  items: DoseMock[];
};
