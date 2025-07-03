export interface DataWebhookPagarme {
  id: string
  account: Account
  type: string
  created_at: string
  data: Data
}

export interface Account {
  id: string
  name: string
}

export interface Data {
  id: string
  code: string
  amount: number
  currency: string
  closed: boolean
  items: Item[]
  customer: Customer
  shipping: Shipping
  status: string
  created_at: string
  updated_at: string
  closed_at: string
  charges: Charge[]
}

export interface Item {
  id: string
  description: string
  amount: number
  quantity: number
  status: string
  created_at: string
  updated_at: string
}

export interface Customer {
  id: string
  name: string
  email: string
  document: string
  type: string
  delinquent: boolean
  created_at: string
  updated_at: string
  phones: Phones
}

// biome-ignore lint/complexity/noBannedTypes: <explanation>
export type Phones = {}

export interface Shipping {
  amount: number
  description: string
  address: Address
}

export interface Address {
  zip_code: string
  city: string
  state: string
  country: string
  line_1: string
}

export interface Charge {
  id: string
  code: string
  gateway_id: string
  amount: number
  status: string
  currency: string
  payment_method: string
  paid_at: string
  created_at: string
  updated_at: string
  customer: Customer2
  last_transaction: LastTransaction
}

export interface Customer2 {
  id: string
  name: string
  email: string
  document: string
  type: string
  delinquent: boolean
  created_at: string
  updated_at: string
  phones: Phones2
}

// biome-ignore lint/complexity/noBannedTypes: <explanation>
export type Phones2 = {}

export interface LastTransaction {
  id: string
  transaction_type: string
  gateway_id: string
  amount: number
  status: string
  success: boolean
  installments: number
  acquirer_name: string
  acquirer_affiliation_code: string
  acquirer_tid: string
  acquirer_nsu: string
  acquirer_auth_code: string
  operation_type: string
  card: Card
  created_at: string
  updated_at: string
  gateway_response: GatewayResponse
}

export interface Card {
  id: string
  last_four_digits: string
  brand: string
  holder_name: string
  exp_month: number
  exp_year: number
  status: string
  created_at: string
  updated_at: string
  billing_address: BillingAddress
  type: string
}

export interface BillingAddress {
  zip_code: string
  city: string
  state: string
  country: string
  line_1: string
}

export interface GatewayResponse {
  code: string
}