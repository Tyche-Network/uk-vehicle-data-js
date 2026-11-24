export interface Meta { requestId: string; sandbox?: boolean; partial?: boolean; stale?: boolean; sources?: Record<string, { status: string; fetchedAt?: string }>; usage?: { plan: string; used: number; limit: number; period: string } }
export interface MotTest { date: string; result: 'pass' | 'fail'; expiryDate: string | null; odometer: { value: number | null; unit: 'mi' | 'km' | null }; testNumber: string | null; defects: { type: string; text: string; dangerous: boolean }[] }
export interface Vehicle {
  registration: string; make: string | null; model: string | null; colour: string | null; fuelType: string | null;
  engineCapacityCc: number | null; co2EmissionsGPerKm: number | null; euroStatus: string | null; yearOfManufacture: number | null; firstRegistered: string | null;
  tax: { status: string | null; dueDate: string | null; daysUntilDue: number | null };
  mot: { status: string | null; expiryDate: string | null; daysUntilExpiry: number | null; testCount: number; latestResult: string | null; tests: MotTest[] };
  mileage: { latest: { date: string; miles: number } | null; averageMilesPerYear: number | null; anomalyFound: boolean; anomalies: { type: string; detail: string }[] };
  cleanAirZone: { estimate: true; result: 'likely_compliant' | 'likely_non_compliant' | 'uncertain' | 'unknown'; basis: string; euroStandard?: number | null; requiredEuro?: number | null } | null;
  [k: string]: unknown;
}
export class TycheApiError extends Error { status: number; code: string; body: unknown }
export class VehicleData {
  constructor(opts?: { apiKey?: string; baseUrl?: string; timeoutMs?: number; fetch?: typeof fetch });
  lookup(registration: string): Promise<{ data: Vehicle; meta: Meta }>;
  bulk(registrations: string[]): Promise<{ data: ({ registration: string; data?: Vehicle; error?: { code: string } })[]; meta: Meta }>;
  watch(registration: string, url: string, daysBefore?: number[]): Promise<{ data: { id: string } }>;
  listWatches(): Promise<{ data: unknown[] }>;
  deleteWatch(id: string): Promise<null>;
  account(): Promise<{ data: unknown }>;
}
export function verifyWebhook(rawBody: string, header: string, secret: string, toleranceSecs?: number): Promise<boolean>;
export default VehicleData;
