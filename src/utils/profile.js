// Maps the investor profile from GET /auth/me (which nests the agreement flags under `agreement`)
// to the flat flags the UI reads.
export function normalizeProfile(profile) {
  if (!profile || typeof profile !== 'object') return profile;
  const a = profile.agreement || {};
  return {
    ...profile,
    purchase_agree: !!(a.purchaseAgree ?? profile.purchase_agree ?? profile.purchaseAgree),
    consent_kyc: !!(a.consentKyc ?? profile.consent_kyc ?? profile.consentKyc),
    terms_accepted: !!(a.termsAndCondition ?? profile.terms_accepted ?? profile.termsAndCondition),
    agreement_file: a.agreementFile ?? profile.agreement_file ?? null,
  };
}

/** Pull the user object out of any /auth/me response shape. */
export function profileFromResponse(res) {
  return normalizeProfile(res?.data?.user || res?.data || res?.user || res);
}
