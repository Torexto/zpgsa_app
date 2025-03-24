type Bus = {
  id: string;
  label: string;
  lat: number;
  lon: number;
  line: string;
  deviation: string;
  icon: string;
  destination: string;
};

type Stop = {
  city: string;
  name: string;
  id: string;
  lat: number;
  lon: number;
};

type StopInfo = {
  id: string;
  buses: StopInfoBus[];
};

type StopInfoBus = {
  time: string;
  line: string;
  destination: string;
  operating_days: string;
  school_restriction: string;
}

export type { Bus, Stop, StopInfo, StopInfoBus };
