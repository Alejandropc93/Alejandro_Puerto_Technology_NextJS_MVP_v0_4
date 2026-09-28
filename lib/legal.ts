export const legal = {
  owner: process.env.NEXT_PUBLIC_LEGAL_OWNER || "PENDIENTE DE COMPLETAR",
  nif: process.env.NEXT_PUBLIC_LEGAL_NIF || "PENDIENTE DE COMPLETAR",
  address: process.env.NEXT_PUBLIC_LEGAL_ADDRESS || "PENDIENTE DE COMPLETAR",
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "PENDIENTE DE COMPLETAR",
  businessName: "Alejandro Puerto Technology",
};

export function hasCompleteLegalIdentity() {
  return !Object.values({ owner: legal.owner, nif: legal.nif, address: legal.address, email: legal.email }).some((value) => value.includes("PENDIENTE"));
}
